from http import HTTPStatus

from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException


class NotAnAdminException(AutomaticallyHandledException):
    def __init__(self, username):
        super().__init__(
            HTTPStatus.BAD_REQUEST,
            f"User {username} is not an Admin",
            {'username': username, }
        )
