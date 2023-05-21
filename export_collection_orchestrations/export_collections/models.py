from datetime import timedelta

from django.db import models
from django.db.models.functions import Now
from django.utils import timezone


# Create your models here.
class Collection(models.Model) :
    collection_id = models.AutoField(primary_key=True)
    collection_name = models.CharField(max_length=500)
    collection_owner = models.CharField(max_length=500)
    collection_images = models.DateTimeField(auto_now_add=True)


class ExportToken(models.Model):
    token = models.CharField(max_length=200)
    video_processing_url = models.CharField(max_length=200)
    username = models.CharField(max_length=200)
    exp_date = models.DateTimeField(auto_now_add=False, db_index=True)

    def create_with_expired_date(self, token, url, username):
        exp_date = timezone.now() + timedelta(hours=2)
        return ExportToken.objects.create(token=token, video_processing_url=url, username=username, exp_date=exp_date)

    def get_all_not_expired(self):
        return ExportToken.objects.filter(exp_date__gt=Now())

    def get_all_tokens_of_a_user_thats_not_expired(self, username):
        return ExportToken.objects.filter(exp_date__gt=Now(), username=username)


