from django.urls import path

from . import views
from .views import *

urlpatterns = [
    
    path('get-login-url', get_login_url, name='get_login_url'),
    path('save-user', save_user, name='save_user'),
    # path('create_user', create_user, name='create_user'),
    path('create-post/<str:username>', create_post, name='create_post'),
    path('get-post/<int:post_id>', get_post, name='get_post'),
    path('like/<int:post_id>/<str:username>', like, name='like'),
    path('liked', liked, name='liked'),
    path('comment/<int:post_id>/<str:username>', comment, name='comment'),
    path('get-comment/<int:post_id>', get_comment, name='get_comment'),
]