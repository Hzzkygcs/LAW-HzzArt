import json
import mimetypes

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from rest_framework import status

from .models import ExportToken
from .services import extract_export_collection_request_data, get_collection_as_dict, call_video_processing_service, \
    download_get_token, \
    status_get_token, get_username


@csrf_exempt
@require_POST
def export(request, collection_id):
    username = get_username(request)

    per_image_duration, transition_duration, fps = extract_export_collection_request_data(request)
    images = get_collection_as_dict(request, collection_id)
    url, resp = call_video_processing_service(per_image_duration, transition_duration, fps, images)
    token = resp.json()
    ExportToken.create_with_expired_date(username, url, token['token'])
    return JsonResponse({"response": token}, status=status.HTTP_200_OK)



@csrf_exempt
@require_GET
def download(request, token):
    video_processing_url = ExportToken.get_url_of_a_token(token)
    video_content = download_get_token(video_processing_url, token)
    if video_content.status_code == 200 :
        response = HttpResponse(video_content, content_type=mimetypes.guess_type('video.mp4')[0])
        response['Content-Disposition'] = 'attachment; filename="video.mp4"'
        return response
    return JsonResponse(json.loads(video_content.content), status=video_content.status_code)


@csrf_exempt
@require_GET
def cek_status(request, token):
    video_processing_url = ExportToken.get_url_of_a_token(token)
    response = status_get_token(video_processing_url, token)
    percentageTotal, percentagePhase, phase, tokenName, totalFrames = response
    data = {
        "percentageTotal": percentageTotal,
        "percentagePhase": percentagePhase,
        "phase": phase,
        "tokenName": tokenName,
        "totalFrames": totalFrames
    }
 
    return JsonResponse(data, status=status.HTTP_200_OK)
