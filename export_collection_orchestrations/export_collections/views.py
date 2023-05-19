from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse, request
from .models import *
import json, requests
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
import io

# Create your views here.

# @csrf_exempt
# def get_nuel_url(request):
#     return "http://video-processor:8083"

@csrf_exempt
def get_nuel_url(request):
    return "http://localhost:8083"

# @csrf_exempt
# def get_collection_url(request):
#     return "http://art-collection-service:8086"

@csrf_exempt
def get_collection_url(request):
    return "http://localhost:8086"


def get_collection(request, collection_id):
    # Retrieve the JWT token from the request headers
    jwt_token = request.META.get('HTTP_X_JWT_TOKEN')

    # Get collection by ID
    response = requests.get(
        url=get_collection_url(request) + '/collections/' + str(collection_id),
        headers={'x-jwt-token': jwt_token}
    )   
    data = response.json()
    collection_id = data['id']
    images = data['images']
    image_data = []
    for i in images :
        response_image = requests.get(
        url=get_collection_url(request) + '/collections/image/' + str(i),
        headers={'x-jwt-token': jwt_token}
        )
        data_image = response_image.content
        image_data.append(data_image)
    return image_data

def get_collection_as_dict(request, collection_id):
    collection_response = get_collection(request, collection_id)
    init = {}
    for i in range(len(collection_response)):
        init[f"img-{i}"] = collection_response[i]
    return init

@csrf_exempt
@require_POST
def export(request, collection_id):
    collection_response = get_collection_as_dict(request, collection_id)

    data = json.loads(request.body)
    per_image_duration = data.get('per_image_duration')
    transition_duration = data.get('transition_duration')
    fps = data.get('fps')
    images = collection_response

    if per_image_duration is None or transition_duration is None or fps is None:
        return JsonResponse({"error": "Invalid input data"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    files = []
    for image_index, image_data in images.items():
        image_file = io.BytesIO(image_data)
        image_file.name = f"{image_index}"
        files.append(('img', image_file))
        print('ini nama file', image_file.name)

    response = requests.post(
    url=get_nuel_url(request) + '/submit-video',
    data={"per_image_duration": str(per_image_duration),
            "transition_duration": str(transition_duration),
            "fps": str(fps)},
    files=files
    )
    token = response.json()
    print("ini token", token)
    return JsonResponse({"response": token}, 
                    status=status.HTTP_200_OK)


@csrf_exempt
def download(request, token):
    return ""

@csrf_exempt
def cek_status(request, token):
    # Send the token to the login orchestration service
    response = requests.post(
        url=get_nuel_url(request) + '/cek-status' + token,
        data=json.dumps({'token': token}),
        headers={'Content-Type': 'application/json'}
    )
    if response.status_code == 200:
        data = json.loads(request.body)
        percentageTotal = data.get('percentageTotal')
        percentagePhase = data.get('percentagePhase')
        phase = data.get('phase')
        tokenName = data.get('tokenName')
        totalFrames = data.get('totalFrames')
        
        if percentageTotal is None or percentagePhase is None or phase is None or tokenName is None or totalFrames is None:
            return JsonResponse({"error": "Invalid input data"}, 
                                status=status.HTTP_400_BAD_REQUEST)
        
        return JsonResponse({"percentageTotal": percentageTotal, 
                            "percentagePhase": percentagePhase, "phase": phase, 
                            "tokenName": tokenName, "totalFrames": totalFrames}, 
                            status=status.HTTP_200_OK)

    else:
        # Handle the HTTP error response
        return JsonResponse({"error": f"HTTP {response.status_code} error: {response.reason}"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)