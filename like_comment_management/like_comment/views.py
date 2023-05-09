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
            if not (Cust.objects.filter(username=username).exists()) :
                customer = Cust(username=username)
                customer.save()
                return username
            else :
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
def get_post(request, collection_id):
    collection = Collection.objects.filter(collection_id=collection_id).values()[0]
    return JsonResponse({"response":collection}, status=status.HTTP_200_OK)

@csrf_exempt
def like(request, collection_id):
    user = get_user(request)
    filter_collection = Collection.objects.filter(collection_id = collection_id).exists() 
    if not filter_collection:
        create_collection = Collection(collection_id = collection_id)
        create_collection.save()
        
    collection = Collection.objects.get(collection_id=collection_id)
    like = Like.objects.filter(like_collection=collection, like_user=user)
    
    if not like.exists():
        add_like = Like(like_collection=collection, like_user=user)
        add_like.save()
        collection.collection_likes += 1
        collection.save()
        return JsonResponse({'message': 'Post Liked'}, status=status.HTTP_200_OK)
        
    like.delete()
    collection.collection_likes -= 1
    collection.save()
    return JsonResponse({'message': 'Post Unliked'}, status=status.HTTP_200_OK)
        
@csrf_exempt
def comment(request, collection_id):
    user = get_user(request)
    filter_collection = Collection.objects.filter(collection_id = collection_id).exists() 
    if filter_collection == True :
        collection = Collection.objects.get(collection_id = collection_id)
        deserialize = json.loads(request.body)
        comment = Comment(comment_collection=collection, comment_user=user, comment_text=deserialize['comment'])
        comment.save()
        return JsonResponse({'message': 'Comment added successfully'}, status=status.HTTP_200_OK)
    else :
        create_collection = Collection(collection_id = collection_id)
        create_collection.save()
        return JsonResponse({'message' : 'Collection Created Successfully'}, status=status.HTTP_200_OK)

@csrf_exempt
def get_comment(request, collection_id):
    collection = Collection.objects.get(collection_id = collection_id)
    comment_list = Comment.objects.filter(comment_collection=collection).order_by('-comment_id').values()[::1]

    return JsonResponse({"response":comment_list}, status=status.HTTP_200_OK)

@csrf_exempt
def liked_by_user(request):
    user = get_user(request)
    result = Like.objects.filter(like_user = user).order_by('-like_collection').values()[::1]
    return JsonResponse({"response":result}, status=status.HTTP_200_OK)
   