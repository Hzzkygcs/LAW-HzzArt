from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException
from global_exception.exceptions.ResponseAsException import ResponseAsException
from django.http import HttpResponseBase, HttpResponse

class AutomaticExceptionHandler(ResponseAsException):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, req):
        return self.get_response(req)

    def process_exception(self, req, exception: Exception):
        if not isinstance(exception, ResponseAsException):
            return None
        auto_exception: ResponseAsException = exception
        content = auto_exception.response_body
        if isinstance(content, str):
            content = content.encode('utf-8')
        return HttpResponse(content=content, content_type=auto_exception.content_type,
                            status=auto_exception.status_code)

