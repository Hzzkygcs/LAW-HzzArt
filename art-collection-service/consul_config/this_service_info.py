import os


def get_this_service_port():
    return os.environ['ART_COLLECTIONS_PORT']


def get_this_service_name():
    return os.environ['ART_COLLECTIONS_NAME']
