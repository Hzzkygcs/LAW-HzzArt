from unittest import mock, TestCase

import mockito

from global_exception.exceptions.AutomaticallyHandledException import AutomaticallyHandledException
from global_exception.middleware.AutomaticExceptionHandler import AutomaticExceptionHandler


class TestAutomaticExceptionHandler(TestCase):
    def setUp(self) -> None:
        self.get_response = mock.Mock()
        self.automatic_exception_handler = AutomaticExceptionHandler(self.get_response)
        self.req = mockito.mock()

    def test_call(self):
        self.get_response.return_value = 1
        ret = self.automatic_exception_handler(self.req)
        self.assertEqual(1, ret)

    def test_process_exception__should_return_none_for_general_exception(self):
        exc = Exception()
        ret = self.automatic_exception_handler.process_exception(self.req, exc)
        self.assertIsNone(ret)

    def test_process_exception__should_call_get_response_for_AutomaticallyHandledException(self):
        exception = mock.Mock(AutomaticallyHandledException)
        exception.get_response.return_value = 1

        ret = self.automatic_exception_handler.process_exception(self.req, exception)
        self.assertEqual(1, ret)
        exception.get_response.assert_called_with(self.req)
