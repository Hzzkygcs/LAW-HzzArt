from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse, request
from .models import *
import json, requests
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

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
    print("INI DATA", data)
    collection_id = data['id']
    name = data['name']
    owner = data['owner']
    images = data['images']

    return JsonResponse({"collection_id": collection_id, 
                        "name": name, "owner": owner, "images":images}, 
                        status=status.HTTP_200_OK)

@csrf_exempt
def export(request, collection_id):
    collection_response = get_collection(request, collection_id)
    if collection_response.status_code == 200:
        collection_data = collection_response.json()
        images = collection_data['images']

        data = json.loads(request.body)
        per_image_duration = data.get('per_image_duration')
        transition_duration = data.get('transition_duration')
        fps = data.get('fps')

        if per_image_duration is None or transition_duration is None or fps is None:
            return JsonResponse({"error": "Invalid input data"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        files = []
        for image_path in images:
            with open(image_path, 'rb') as file:
                files.append(('images', file))

        response = requests.post(
        url=get_nuel_url(request) + '/submit-video',
        data={"per_image_duration": str(per_image_duration),
              "transition_duration": str(transition_duration),
              "fps": str(fps)},
        files=files
        )
        token = response.json()
        return JsonResponse({"response", token}, 
                            status=status.HTTP_200_OK)
    else:
        return JsonResponse({"error": "Failed to retrieve images"}, 
                            status=collection_response.status_code)


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