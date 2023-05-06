from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse, request
from .models import *
import json, requests
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

# @csrf_exempt
# def get_login_url(request):
#     return "http://login-orchestration:8085"

@csrf_exempt
def get_login_url(request):
    return "http://localhost:8085"

@csrf_exempt
def get_user(request):
    # Retrieve the JWT token from the request headers
    jwt_token = request.META.get('HTTP_X_JWT_TOKEN')

    # Send the token to the login orchestration service
    response = requests.post(
        url=get_login_url(request) + '/login/validate-login',
        data=json.dumps({'x-jwt-token': jwt_token}),
        headers={'Content-Type': 'application/json'}
    )

    if response.status_code == 200:
        try:
            data = response.json()
            username = data['username']
            customer = Cust(username=username)
            customer.save()
            return username
        except json.decoder.JSONDecodeError as e:
            # Handle the JSONDecodeError
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    else:
        # Handle the HTTP error response
        return JsonResponse({"error": f"HTTP {response.status_code} error: {response.reason}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def get_collection_id(request):
    return "http://localhost:8084"

@csrf_exempt
def get_post(request, post_id):
    post = Collection.objects.filter(post_id=post_id).values()[0]
    return JsonResponse({"response":post}, status=status.HTTP_200_OK)

@csrf_exempt
def like(request, post_id):
    user = get_user(request)
    post = Collection.objects.get_or_create(post_id=post_id)
    like = Like.objects.filter(like_post=post, like_user=user)
    if not like.exists():
        add_like = Like(like_post=post, like_user=user)
        add_like.save()
        post.post_likes += 1
        post.save()
        return JsonResponse({'message': 'Post Liked'}, status=status.HTTP_200_OK)
    else:
        like.delete()
        post.post_likes -= 1
        post.save()
        return JsonResponse({'message': 'Post Unliked'}, status=status.HTTP_200_OK)
    
@csrf_exempt
def comment(request, post_id):
    user = get_user(request)
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
   