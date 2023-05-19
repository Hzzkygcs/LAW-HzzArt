import json
from copy import copy
from typing import Union

from django.http import HttpResponseBase, HttpResponse


class ResponseAsException(Exception):
    def __init__(self, body: Union[str, bytes], status_code: int, content_type="application/json"):
        super(Exception, self).__init__()
        self.response_body = body
        self.status_code = status_code
        self.content_type = content_type
