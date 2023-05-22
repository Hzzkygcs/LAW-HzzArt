import os


def get_this_service_port():
    return os.environ['LIKE_COMMENT_SERVICE_PORT']


def get_this_service_name():
    return os.environ['LIKE_COMMENT_SERVICE_NAME']
