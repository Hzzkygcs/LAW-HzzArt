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

def get_collection(request):
    # Retrieve the JWT token from the request headers
    jwt_token = request.META.get('x-jwt-token')

    # Send the token to the login orchestration service
    response = requests.post('<BASE_URL>/login',body={'Authorization': f'Bearer {jwt_token}'})
    data = response.json()
    username = data['username']

    #save user
    user = Cust(username=username)
    user.save()
    return JsonResponse({"message": "User successfully saved"}, status=status.HTTP_200_OK)

@csrf_exempt
def get_export_form(request, post_id):
    #create form
    form = Post.objects.filter(post_id=post_id).values()[0]
    return JsonResponse({"response":post}, status=status.HTTP_200_OK)

def get_nuel(request):
    # Retrieve the JWT token from the request headers
    jwt_token = request.META.get('x-jwt-token')

    # Send the token to the login orchestration service
    response = requests.post(
        url=get_nuel_url(request) + '/submit-video',
        data=json.dumps({'x-jwt-token': jwt_token}),
        headers={'Content-Type': 'application/json'}
    )
    data = response.json()
    username = data['username']

    #save user
    user = Cust(username=username)
    user.save()
    return JsonResponse({"message": "User successfully saved"}, status=status.HTTP_200_OK)

@csrf_exempt
def export(request, collection_id):
    data = json.loads(request.body)
    per_image_duration = data.get('per_image_duration')
    transition_duration = data.get('transition_duration')
    fps = data.get('fps')

    if per_image_duration is None or transition_duration is None or fps is None:
        return JsonResponse({"error": "Invalid input data"}, 
                            status=status.HTTP_400_BAD_REQUEST)
    
    response = requests.post(
        url=get_nuel_url(request) + '/submit-video',
        data=json.dumps({"per_image_duration": per_image_duration, 
                         "transition_duration": transition_duration, "fps": fps}),
        headers={'Content-Type': 'application/json'}
    )
    token = response.json()
    return JsonResponse({"response", token}, 
                        status=status.HTTP_200_OK)

@csrf_exempt
def download(request, token):
    return ""

@csrf_exempt
def cek_status(request, token):
    data = json.loads(request.body)
    percentageTotal = data.get('percentageTotal')
    percentagePhase = data.get('percentagePhase')
    phase = data.get('phase')
    tokenName = data.get('tokenName')
    totalFrames = data.get('totalFrames')
    if percentageTotal is None or percentagePhase is None or phase is None or tokenName is None or totalFrames is None:
        return JsonResponse({"error": "Invalid input data"}, status=status.HTTP_400_BAD_REQUEST)
    return JsonResponse({"percentageTotal": percentageTotal, "percentagePhase": percentagePhase, "phase": phase, 
                         "tokenName": tokenName, "totalFrames": totalFrames}, status=status.HTTP_200_OK)