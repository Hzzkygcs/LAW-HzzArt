from django.urls import path


from .views import *

urlpatterns = [
    path('export/<int:collection_id>', export, name='export'),
    path('check-status/<str:token>', cek_status, name='cek_status'),
    path('check/user', cek_user_donwloads, name='cek_status'),
    path('check', cek_entire_downloads, name='cek_status'),
    path('download/<str:token>', download, name='download'),

]