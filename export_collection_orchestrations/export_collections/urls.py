from django.urls import path

from . import views
from .views import *

urlpatterns = [
    path('export/<int:collection_id>', export, name='export'),
    path('get-collection/<int:collection_id>', get_collection, name='get_collection'),
    path('check-status/<str:token>', cek_status, name='cek_status'),
    path('download', download, name='download'),

]