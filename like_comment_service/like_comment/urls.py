from django.urls import path

from . import views
from .views import *

urlpatterns = [
    # path('get_user', get_user, name='get_user'),
    # path('create_user', create_user, name='create_user'),

    # path('create_post/<str:username>', create_post, name='create_post'),
    path('get-post/<int:collection_id>', get_collection_information_view, name='get_post'),
    path('get-posts/', get_multiple_collection_information_view, name='get_posts'),


    path('like/<int:post_id>', like_or_dislike, name='like'),
    path('sort-collection/', get_popular_collections, name='liked'),
    path('comment/<int:post_id>', comment, name='comment'),
    path('get-comment/<int:post_id>', get_comments_of_a_collection, name='get_comment'),
]