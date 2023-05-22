from django.urls import path

from health.views import health
from like_comment import views
from like_comment.views import *

urlpatterns = [
    path('health', health, name='get_post'),
]