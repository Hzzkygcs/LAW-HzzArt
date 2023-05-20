from django.core.exceptions import FieldDoesNotExist
from django.db.models import Count
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET

from .exceptions.FieldRequiredException import FieldRequiredException
from .exceptions.InvalidFieldTypeException import InvalidFieldTypeException
from .models import *
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

from .services import get_collection_information, parse_json_request, get_username


# Create your views here.
@csrf_exempt
@require_GET
def get_collection_information_view(_req, collection_id):
    data = get_collection_information(collection_id)
    return JsonResponse(data, status=status.HTTP_200_OK)

@csrf_exempt
@require_POST
def get_multiple_collection_information_view(req):
    json_data = parse_json_request(req)
    InvalidFieldTypeException.assert_correct_type('collection_ids', json_data, list)

    collection_ids = json_data['collection_ids']

    ret = []
    for collection_id in collection_ids:
        ret.append(
            get_collection_information(collection_id)
        )
    return JsonResponse(ret, safe=False, status=status.HTTP_200_OK)



@csrf_exempt
@require_POST
def like_or_dislike(req, post_id):
    username = get_username(req)
    collection = Collections.get_or_create(post_id)
    like_obj = Like.objects.filter(username=username, collection=collection).first()
    collection = Collections.get_or_create(post_id)

    if like_obj is None:  # like
        Like.objects.create(username=username, collection=collection)
        return JsonResponse({'message': 'Post Liked', 'liked': True}, status=status.HTTP_200_OK)

    # dislike
    like_obj.delete()
    return JsonResponse({'message': 'Post Unliked', 'liked': False}, status=status.HTTP_200_OK)


@csrf_exempt
@require_POST
def comment(req, post_id):
    json_data = parse_json_request(req)
    FieldRequiredException.assert_has_field('comment', json_data)

    collection = Collections.get_or_create(post_id)
    username = get_username(req)

    created_comment = Comment(collection=collection, username=username,
                              comment_text=json_data['comment'])
    created_comment.save()
    return JsonResponse({'message': 'Comment added successfully'}, status=status.HTTP_200_OK)


@csrf_exempt
@require_GET
def get_comments_of_a_collection(_req, post_id):
    post = Collections.get_or_create(post_id)
    comment_list = post.comment_set.all().order_by('comment_id').values()[::1]

    return JsonResponse({"response": list(comment_list)}, status=status.HTTP_200_OK)


@require_GET
def get_popular_collections(_req):
    popular_collections = (
        Collections.objects.all()
        .annotate(likes_count=Count('like'), comment_count=Count('comment'), )
        .order_by('-likes_count', 'comment_count')
    )
    ret = []
    for collection in popular_collections:
        ret.append(
            get_collection_information(collection.post_id)
        )
    return JsonResponse(ret, safe=False, status=status.HTTP_200_OK)

