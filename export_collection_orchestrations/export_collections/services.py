import io
import json
from typing import Union

import requests
from PIL import Image

from export_collections.exceptions.InvalidFieldTypeException import InvalidFieldTypeException
from export_collections.exceptions.NotJsonRequestException import NotJsonRequestException
from global_exception.exceptions.ResponseAsException import ResponseAsException


def get_nuel_url():
    return "http://localhost:8083"


def get_collection_url():
    return "http://localhost:8086"



def get_collection_as_dict(request, collection_id):
    collection_response = get_collection(request, collection_id)
    init = {}
    for i in range(len(collection_response)):
        init[f"img-{i}"] = collection_response[i]
    return init


def get_collection(request, collection_id):
    # Retrieve the JWT token from the request headers
    jwt_token = request.META.get('HTTP_X_JWT_TOKEN')

    # Get collection by ID
    response = requests.get(
        url=get_collection_url() + '/collections/' + str(collection_id),
        headers={'x-jwt-token': jwt_token}
    )
    data = response.json()
    collection_id = data['id']
    images = data['images']
    image_data = []
    for i in images :
        response_image = requests.get(
            url=get_collection_url() + '/collections/image/' + str(i),
            headers={'x-jwt-token': jwt_token}
        )
        data_image = response_image.content
        image_data.append(data_image)
    return image_data



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

    response = requests.post(
        url=get_nuel_url() + '/submit-video',
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
    return response


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