import json
from copy import copy

from django.http import HttpResponseBase, HttpResponse

from global_exception.exceptions.ResponseAsException import ResponseAsException


class AutomaticallyHandledException(ResponseAsException):
    def __init__(self, status_code: int, message, additional_data=None):
        super().__init__(message, status_code)
        if additional_data is None:
            additional_data = {}
        self.status_code = status_code
        self.err_msg = message
        self.additional_data = additional_data

        additional_data = copy(additional_data)
        base_data = {
            'status_code': status_code,
            'message': message,
            'error_code': self.__class__.__qualname__
        }
        additional_data.update(base_data)
        content = json.dumps({"reason": additional_data})
        super().__init__(content, status_code)
