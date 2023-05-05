from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse, request
from .models import *
import json, requests
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def save_user(request):
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

# @csrf_exempt 
# def create_user(request):
#     deserialize = json.loads(request.body)
#     user = Cust(username=deserialize['username'])
#     user.save()
#     return JsonResponse({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

@csrf_exempt
def create_post(request, username):
    user = Cust.objects.get(username=username)
    deserialize = json.loads(request.body)
    post = Post(post_desc=deserialize['desc'],post_image_link=deserialize['image'], post_user_name=user)
    post.save()
    return JsonResponse({"message": "Post created successfully"}, status=status.HTTP_201_CREATED)

@csrf_exempt
def get_post(request, post_id):
    post = Post.objects.filter(post_id=post_id).values()[0]
    return JsonResponse({"response":post}, status=status.HTTP_200_OK)

@csrf_exempt
def like(request, post_id, username):
    user = Cust.objects.get(username=username)
    post = Post.objects.get(post_id = post_id)
    if not (post.post_likes_user.filter(username=user.username).exists()):
        post.post_likes_user.add(user)
        post.post_likes+=1
        post.save()
        return JsonResponse({'message': 'Post Liked'}, status=status.HTTP_200_OK)

    else :
        return JsonResponse({'message': 'Post Already Liked'}, status=status.HTTP_400_BAD_REQUEST)
    
@csrf_exempt
def comment(request, post_id, username):
    user = Cust.objects.get(username=username)
    post = Post.objects.get(post_id = post_id)
    deserialize = json.loads(request.body)
    comment = Comment(comment_post=post, comment_user=user, comment_text=deserialize['comment'])
    comment.save()
    return JsonResponse({'message': 'Comment added successfully'}, status=status.HTTP_200_OK)

@csrf_exempt
def get_comment(request, post_id):
    post = Post.objects.get(post_id = post_id)
    comment_list = Comment.objects.filter(comment_post=post).order_by('-comment_id').values()[::1]

    return JsonResponse({"response":comment_list}, status=status.HTTP_200_OK)

def liked(request, post_id):
    result = Post.object.filter(post_id=post_id, post_likes_user=request.user.email)
    if len(result) == 0:
        is_liked = False
    else :
        is_liked = True
    return JsonResponse({"isLiked":is_liked}, safe=False, status=status.HTTP_200_OK)
   