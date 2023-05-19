from http import HTTPStatus

from export_collections.exceptions.FieldRequiredException import FieldRequiredException
from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException



class InvalidFieldTypeException(AutomaticallyHandledException):
    def __init__(self, field_name, given_type, required_type):
        super().__init__(
            HTTPStatus.BAD_REQUEST,
            f"Field {field_name} is required",
            {
                'field_name': field_name,
                'given_type': given_type,
                'required_type': required_type,
            }
        )

    @classmethod
    def assert_correct_type(cls, field_name, dictionary, types):
        print(types)
        if field_name not in dictionary:
            raise FieldRequiredException(field_name)
        if not isinstance(dictionary[field_name], types):
            raise cls(field_name, str(type(dictionary[field_name])), str(types))
        return dictionary[field_name]