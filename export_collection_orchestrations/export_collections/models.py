from datetime import timedelta
from random import randint

from django.db import models
from django.db.models.functions import Now
from django.utils import timezone

from export_collections.exceptions.TokenNotFoundException import TokenNotFoundException


# Create your models here.
class Collection(models.Model) :
    collection_id = models.AutoField(primary_key=True)
    collection_name = models.CharField(max_length=500)
    collection_owner = models.CharField(max_length=500)
    collection_images = models.DateTimeField(auto_now_add=True)


EXPORT_COLLECTION_INSTANCE_ID = randint(0, 10**5)
def get_export_collection_instance_id():
    return EXPORT_COLLECTION_INSTANCE_ID


class ExportToken(models.Model):
    token = models.CharField(max_length=200)
    video_processing_url = models.CharField(max_length=200)
    username = models.CharField(max_length=200)
    collection_name = models.CharField(max_length=200)
    exp_date = models.DateTimeField(auto_now_add=False, db_index=True)
    export_instance_id = models.IntegerField(default=get_export_collection_instance_id)

    @classmethod
    def create_with_expired_date(cls, username, url, token, collection_name):
        exp_date = timezone.now() + timedelta(hours=2)
        return cls.objects.create(token=token, video_processing_url=url,
                                  username=username, exp_date=exp_date,
                                  collection_name=collection_name)

    @classmethod
    def get_url_of_a_token(cls, token):
        obj = cls.objects.filter(exp_date__gt=Now(), token=token).first()
        if obj is None:
            raise TokenNotFoundException(token)
        return obj.video_processing_url

    @classmethod
    def get_all_not_expired_tokens(cls):
        return cls.objects.filter(exp_date__gt=Now()).order_by('-exp_date')

    @classmethod
    def get_all_tokens_of_a_user_thats_not_expired(cls, username):
        return cls.objects.filter(exp_date__gt=Now(), username=username).order_by('-exp_date')




