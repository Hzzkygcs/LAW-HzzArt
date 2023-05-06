from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse, request
from .models import *
import json, requests
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

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

@csrf_exempt
def export(request, collection_id):
    collection = Collection.objects.get(collection_id=collection_id)
    deserialize = json.loads(request.body)
    post = Post(post_desc=deserialize['desc'],post_image_link=deserialize['image'], post_user_name=user)
    post.save()
    return JsonResponse({"message": "Post created successfully"}, status=status.HTTP_201_CREATED)