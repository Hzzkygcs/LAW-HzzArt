from http import HTTPStatus

from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException


class TokenNotFoundException(AutomaticallyHandledException):
    def __init__(self, token):
        super().__init__(
            HTTPStatus.BAD_REQUEST,
            f"Token {token} is not found",
            {'token': token, }
        )
