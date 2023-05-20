from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse, request

from .exceptions.InvalidFieldTypeException import InvalidFieldTypeException
from .models import *
import json, requests
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
import io

from .services import extract_export_collection_request_data, get_collection_as_dict, get_nuel_url, \
    prepare_list_of_bytes_to_be_sent_in_http_request, call_video_processing_service


# Create your views here.

# @csrf_exempt
# def get_nuel_url(request):
#     return "http://video-processor:8083"


# @csrf_exempt
# def get_collection_url(request):
#     return "http://art-collection-service:8086"




@csrf_exempt
@require_POST
def export(request, collection_id):
    per_image_duration, transition_duration, fps = extract_export_collection_request_data(request)
    images = get_collection_as_dict(request, collection_id)
    resp = call_video_processing_service(per_image_duration, transition_duration, fps, images)
    token = resp.json()
    print("ini token", token)
    return JsonResponse({"response": token}, status=status.HTTP_200_OK)



@csrf_exempt
def download(request, token):
    return ""


@csrf_exempt
def cek_status(request, token):
    # Send the token to the login orchestration service
    response = requests.post(
        url=get_nuel_url() + '/cek-status' + token,
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