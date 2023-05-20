import json
import os
import urllib
from os.path import join

import requests

from global_exception.exceptions.ResponseAsException import ResponseAsException
from like_comment.exceptions.NotJsonRequestException import NotJsonRequestException
from like_comment.models import Collections



def get_login_orchestration_url():
    return os.environ['LOGIN_ORCHESTRATION_URL']


def get_username(req):
    # Retrieve the JWT token from the request headers
    jwt_token = req.META.get('HTTP_X_JWT_TOKEN')

    # Send the token to the login orchestration service
    url = urllib.parse.urljoin(get_login_orchestration_url(), 'login/validate-login')
    data = {
        os.environ['JWT_TOKEN_HEADER_NAME']: jwt_token
    }
    print(url, data)
    resp = requests.post(url, json=data)
    if resp.status_code != 200:
        print("Received from login orchestration: ", resp.content)
        raise ResponseAsException(resp.content, resp.status_code)

    data = resp.json()
    username = data['username']
    return username


def parse_json_request(req):
    if req.body is None:
        raise NotJsonRequestException()
    decoded = req.body.decode('utf-8')
    if len(decoded) == 0:
        raise NotJsonRequestException()
    try:
        ret = json.loads(decoded)
        return ret
    except:
        raise NotJsonRequestException()


def get_collection_information(collection_id):
    post = Collections.objects.filter(post_id=collection_id).first()

    post_id = collection_id
    post_likes = 0
    post_comments = 0
    if post is not None:
        post_likes = post.like_set.count()
        post_comments = post.comment_set.count()

    return {
        "post_id": post_id,
        "post_likes": post_likes,
        "post_comments": post_comments,
    }