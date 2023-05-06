from django.urls import path

from . import views
from .views import *

urlpatterns = [
    
    path('get-login-url', get_login_url, name='get_login_url'),
    path('get-user', get_user, name='get_user'),
    path('get-post/<int:post_id>', get_post, name='get_post'),
    path('like/<int:post_id>', like, name='like'),
    path('liked', liked, name='liked'),
    path('comment/<int:post_id>', comment, name='comment'),
    path('get-comment/<int:post_id>', get_comment, name='get_comment'),
]