import os


def get_this_service_port():
    return os.environ['EXPORT_COLLECTION_ORCHESTRATIONS_PORT']


def get_this_service_name():
    return os.environ['EXPORT_COLLECTION_ORCHESTRATIONS_NAME']
