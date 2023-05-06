from django.db import models

# Create your models here.
class Collection(models.Model) :
    collection_id = models.AutoField(primary_key=True)
    collection_name = models.CharField(max_length=500)
    collection_owner = models.CharField(max_length=500)
    collection_images = models.DateTimeField(auto_now_add=True)