import json
from http import HTTPStatus
from unittest import TestCase, mock

from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException


class TestAutomaticallyHandledException(TestCase):
    def setUp(self) -> None:
        self.status_code = HTTPStatus.BAD_REQUEST
        self.err_msg = 'msg'

    @mock.patch('django.http.response.HttpResponse')
    def test_get_response(self, mock_http_response):
        exc = AutomaticallyHandledException(self.status_code, self.err_msg)
        exc.HttpResponse = mock_http_response
        req = mock.Mock()
        exc.get_response(req)

        return_data = json.loads(mock_http_response.call_args.args[0])
        self.assertEqual(self.status_code, return_data["status_code"])
        self.assertEqual(self.err_msg, return_data["err_msg"])

