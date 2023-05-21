import traceback
from threading import Thread

from global_exception.exceptions.ResponseAsException import ResponseAsException


#
# class ThreadWithReturnValue(Thread):
#     def __init__(self, group=None, target=None, name=None,
#                  *args, **kwargs):
#         Thread.__init__(self, group, target, name, *args, **kwargs)
#         self._return = None
#     def run(self):
#         if self._Thread__target is not None:
#             self._return = self._Thread__target(*self._Thread__args,
#                                                 **self._Thread__kwargs)
#     def join(self):
#         Thread.join(self)
#         return self._return


def do_concurrently(function, list_of_args: list[tuple]):
    threads = []
    results = []

    def get_return_value_func(index, args):
        nonlocal results
        returned = function(*args)
        results[index] = returned

    for i, args in enumerate(list_of_args):
        def wrapper_function(index, curr_args):
            def func():
                try:
                    get_return_value_func(index, curr_args)
                except ResponseAsException as e:
                    print("Error ResponseAsException: ", e.status_code, e.response_body)
                except Exception as e:
                    traceback.print_exception(e)
                    raise e
            return func

        thread = Thread(target=wrapper_function(i, args))
        threads.append(thread)
        thread.start()
        results.append(None)

    for thread in threads:
        thread.join()
    return results