from http import HTTPStatus

from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException


class NotJsonRequestException(AutomaticallyHandledException):
    def __init__(self):
        super().__init__(HTTPStatus.BAD_REQUEST, "Not a json request")