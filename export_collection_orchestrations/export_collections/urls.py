from django.urls import path

from . import views
from .views import *

urlpatterns = [
    path('export', export, name='export'),
    path('create_user', create_user, name='create_user'),
    path('create_post/<str:username>', create_post, name='create_post'),
]