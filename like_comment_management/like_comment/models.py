from django.db import models

# Create your models here.
class Cust(models.Model):
    username = models.CharField(max_length=100, primary_key=True)

class Collection(models.Model) :
    collection_id = models.IntegerField(primary_key=True)
    collection_likes = models.IntegerField(default=0)

class Like(models.Model):
    like_id = models.AutoField(primary_key=True)
    like_collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    like_user = models.ForeignKey(Cust, on_delete=models.CASCADE)

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    comment_collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    comment_user = models.ForeignKey(Cust, on_delete=models.CASCADE)
    comment_text = models.CharField(max_length=1000)