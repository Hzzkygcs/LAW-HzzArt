from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse, request, StreamingHttpResponse
import mimetypes
from .exceptions.InvalidFieldTypeException import InvalidFieldTypeException
from .models import *
import json, requests
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
import io

from .services import extract_export_collection_request_data, get_collection_as_dict, get_nuel_url, \
    prepare_list_of_bytes_to_be_sent_in_http_request, call_video_processing_service, download_get_token, \
    status_get_token


@csrf_exempt
@require_POST
def export(request, collection_id):
    per_image_duration, transition_duration, fps = extract_export_collection_request_data(request)
    images = get_collection_as_dict(request, collection_id)
    resp = call_video_processing_service(per_image_duration, transition_duration, fps, images)
    token = resp.json()
    return JsonResponse({"response": token}, status=status.HTTP_200_OK)



@csrf_exempt
@require_GET
def download(request, token):
    video_content = download_get_token(request, token)
    if video_content.status_code == 200 :
        response = HttpResponse(video_content, content_type=mimetypes.guess_type('video.mp4')[0])
        response['Content-Disposition'] = 'attachment; filename="video.mp4"'
        return response
    return JsonResponse(json.loads(video_content.content), status=video_content.status_code)


@csrf_exempt
@require_GET
def cek_status(request, token):
    response = status_get_token(request, token)
    percentageTotal, percentagePhase, phase, tokenName, totalFrames = response
    data = {
        "percentageTotal": percentageTotal,
        "percentagePhase": percentagePhase,
        "phase": phase,
        "tokenName": tokenName,
        "totalFrames": totalFrames
    }
 
    return JsonResponse(data, status=status.HTTP_200_OK)