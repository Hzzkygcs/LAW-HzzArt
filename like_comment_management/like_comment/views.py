from django.shortcuts import render
from django.http import response, HttpResponse, JsonResponse

# Create your views here.

# @api_view(['POST'])
# @jwt_authenticated 
# def create_post(request):
#     user = User.objects.get(email=request.user.email)
#     deserialize = json.loads(request.body)
#     group = Group.objects.get(group_id=deserialize['group'])
#     post = Post(post_desc=deserialize['desc'],post_image_link=deserialize['image'], post_group_origin=group, post_user=user)
#     post.save()
#     return JsonResponse({"message": "Post created successfully"}, status=status.HTTP_201_CREATED)