import io
import json
import os
import urllib
from random import choice
from typing import Union

import requests
from PIL import Image

from consul_config.consul_services import get_healthy_service_host_url
from export_collections.exceptions.InvalidFieldTypeException import InvalidFieldTypeException
from export_collections.exceptions.NotAnAdminException import NotAnAdminException
from export_collections.exceptions.NotJsonRequestException import NotJsonRequestException
from export_collections.models import ExportToken
from global_exception.exceptions.ResponseAsException import ResponseAsException


def get_video_processing_url():
    ret = choice(("http://localhost:8083", "http://localhost:7073"))
    if 'INSIDE_DOCKER_CONTAINER' in os.environ:
        ret = choice([
            os.environ['VIDEO_PROCESSING_SERVICE_URL'],
            os.environ['VIDEO_PROCESSING_SERVICE_URL_2'],
        ])
    ret = get_healthy_service_host_url(os.environ['VIDEO_PROCESSING_SERVICE_NAME'], ret)
    return ret


def get_collection_url():
    ret = "http://localhost:8086"
    if 'INSIDE_DOCKER_CONTAINER' in os.environ:
        ret = os.environ['ART_COLLECTIONS_URL']
    ret = get_healthy_service_host_url(os.environ['ART_COLLECTIONS_NAME'], ret)
    return ret


def get_login_orchestration_url():
    ret = "http://localhost:8085"
    if 'INSIDE_DOCKER_CONTAINER' in os.environ:
        ret = os.environ['LOGIN_ORCHESTRATION_URL']
    ret = get_healthy_service_host_url(os.environ['LOGIN_ORCHESTRATION_NAME'], ret)
    return ret


def get_username(req, assert_admin=False):
    # Retrieve the JWT token from the request headers
    jwt_token = req.META.get('HTTP_X_JWT_TOKEN')

    # Send the token to the login orchestration service
    url = urllib.parse.urljoin(get_login_orchestration_url(), 'login/validate-login')
    data = {
        os.environ['JWT_TOKEN_HEADER_NAME']: jwt_token
    }
    print(url, data)
    resp = requests.post(url, json=data)
    if resp.status_code != 200:
        print("Received from login orchestration: ", resp.content)
        raise ResponseAsException(resp.content, resp.status_code)

    data = resp.json()
    username = data['username']
    if assert_admin and not data['admin']:
        raise NotAnAdminException(username)
    return username


def get_collection_images_as_dict_with_collections_name(request, collection_id):
    collection_name, collection_response = get_collection_name_and_its_images(request, collection_id)
    init = {}
    for i in range(len(collection_response)):
        init[f"img-{i}"] = collection_response[i]
    return collection_name, init


def get_collection_name_and_its_images(request, collection_id):
    # Retrieve the JWT token from the request headers
    jwt_token = request.META.get('HTTP_X_JWT_TOKEN')

    # Get collection by ID
    response = requests.get(
        url=get_collection_url() + '/collections/' + str(collection_id),
        headers={'x-jwt-token': jwt_token}
    )
    data = response.json()
    print("info from art-service: ", data)
    collection_name = data['name']
    images = data['images']
    image_data = []
    for i in images :
        response_image = requests.get(
            url=get_collection_url() + '/collections/image/' + str(i),
            headers={'x-jwt-token': jwt_token}
        )
        data_image = response_image.content
        image_data.append(data_image)
    return collection_name, image_data



def extract_export_collection_request_data(request):
    data = parse_json_request(request)
    per_image_duration = InvalidFieldTypeException.assert_correct_type('per_image_duration', data, (int, float))
    transition_duration = InvalidFieldTypeException.assert_correct_type('transition_duration', data, (int, float))
    fps = InvalidFieldTypeException.assert_correct_type('fps', data, int)
    return per_image_duration, transition_duration, fps


def prepare_list_of_bytes_to_be_sent_in_http_request(images: list[bytes]):
    files = []
    for image_index, image_data in images.items():
        image_data = any_format_to_png(image_data)
        image_file = io.BytesIO(image_data)
        image_file.name = f"{image_index}.png"
        files.append((image_index, image_file))
        print('ini nama file', image_file.name)
    return files


def call_video_processing_service(per_image_duration: Union[int, float],
                                  transition_duration: Union[int, float],
                                  fps: int, images: list[bytes]):
    files = prepare_list_of_bytes_to_be_sent_in_http_request(images)

    video_processing_url = get_video_processing_url()
    response = requests.post(
        url=video_processing_url + '/submit-video',
        data={
            "per_image_duration": str(per_image_duration),
            "transition_duration": str(transition_duration),
            "fps": str(fps)
        },
        files=files
    )
    if response.status_code != 200:
        print("Received from video-processing-service: ", response.content)
        raise ResponseAsException(response.content, response.status_code)
    return video_processing_url, response


def any_format_to_png(webp_bytes: bytes) -> bytes:
    webp_image = Image.open(io.BytesIO(webp_bytes))
    png_buffer = io.BytesIO()
    webp_image.save(png_buffer, format='PNG')
    return png_buffer.getvalue()


def parse_json_request(req):
    if req.body is None:
        raise NotJsonRequestException()
    decoded = req.body.decode('utf-8')
    if len(decoded) == 0:
        raise NotJsonRequestException()
    try:
        ret = json.loads(decoded)
        return ret
    except:
        raise NotJsonRequestException()
    
def download_get_token(video_processing_url, token):
    response = requests.get(
        url=video_processing_url + '/download/' + token,
        headers={'Content-Type': 'video/mp4'}
    )
    return response


def get_token_status_and_additional_info(video_processing_url, token: ExportToken):
    ret = status_get_token(video_processing_url, token.token)
    ret['username'] = token.username
    ret['collection_name'] = token.collection_name
    return ret


def status_get_token(video_processing_url, token: str):
    response = requests.get(
        url=video_processing_url + '/check-status/' + token,
        headers={'Content-Type': 'application/json'}
    )
    if response.status_code != 200:
        raise ResponseAsException(response.content, status_code=response.status_code)

    data = response.json()
    return data
    # percentageTotal = data['percentageTotal']
    # percentagePhase = data['percentagePhase']
    # phase = data['phase']
    # tokenName = data['tokenName']
    # totalFrames = data['totalFrames']
    
    # return percentageTotal,percentagePhase, phase, \
    #     tokenName, totalFrames