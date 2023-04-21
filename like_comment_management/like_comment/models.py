from django.db import models

# Create your models here.
class Post(models.Model) :
    post_id = models.AutoField(primary_key=True)
    post_desc = models.TextField(max_length=2000)
    post_image_link = models.CharField(max_length=500)
    post_date = models.DateTimeField(auto_now_add=True)
    post_likes = models.IntegerField(default=0)
    post_user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_user_name = models.CharField(max_length=100, null=True)