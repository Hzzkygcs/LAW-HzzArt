from django.db import models
from rest_framework import serializers


class Collections(models.Model) :
    post_id = models.IntegerField(primary_key=True)
    # post_desc = models.TextField(max_length=2000)
    # post_image_link = models.CharField(max_length=500)
    # post_date = models.DateTimeField(auto_now_add=True)
    # post_likes = models.IntegerField(default=0)
    # post_user = models.ForeignKey(Cust, on_delete=models.CASCADE)
    # post_user_name = models.CharField(max_length=100, null=True)

    @classmethod
    def get_or_create(cls, id):
        ret = cls.objects.filter(post_id=id).first()
        if ret is None:
            ret = cls.objects.create(post_id=id)
        return ret





# Create your models here.
class Like(models.Model):
    like_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    collection = models.ForeignKey(to=Collections, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['username', 'collection'], name='unique_migration_host_combination'
            )
        ]



class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    # comment_post = models.ForeignKey(Collections, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collections, on_delete=models.CASCADE)
    # comment_user = models.ForeignKey(Likes, on_delete=models.CASCADE)
    username = models.TextField(max_length=100)

    comment_text = models.CharField(max_length=1000)