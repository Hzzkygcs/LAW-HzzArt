from http import HTTPStatus

from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException


class FieldRequiredException(AutomaticallyHandledException):
    def __init__(self, field_name):
        super().__init__(
            HTTPStatus.BAD_REQUEST,
            f"Field {field_name} is required",
            {'field_name': field_name,}
        )

    @classmethod
    def assert_has_field(cls, field_name, dictionary):
        if field_name not in dictionary:
            raise cls(field_name)
        return dictionary[field_name]