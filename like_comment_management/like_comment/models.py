from django.db import models

# Create your models here.
class Cust(models.Model):
    username = models.CharField(max_length=100, primary_key=True)

class Post(models.Model) :
    post_id = models.CharField(primary_key=True)
    post_desc = models.CharField(max_length=500)
    post_image_link = models.CharField(max_length=500)
    post_date = models.DateTimeField(auto_now_add=True)
    post_likes = models.IntegerField(default=0)
    # post_likes_user = models.ManyToManyField(Cust)
    # post_user = models.ForeignKey(Cust, on_delete=models.CASCADE)
    post_user_name = models.CharField(max_length=100, null=True)

class Like(models.Model):
    like_id = models.AutoField(primary_key=True)
    like_post = models.ForeignKey(Post, on_delete=models.CASCADE)
    like_user = models.ForeignKey(Cust, on_delete=models.CASCADE)

class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    comment_post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment_user = models.ForeignKey(Cust, on_delete=models.CASCADE)
    comment_text = models.CharField(max_length=1000)