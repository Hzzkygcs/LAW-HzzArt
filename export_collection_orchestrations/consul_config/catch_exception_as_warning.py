import functools
import logging


def catch_all_exceptions_as_log(identifier_name=None, default_value=None, catch_func=None):
    def decorator(func):
        nonlocal identifier_name
        if identifier_name is None:
            identifier_name = func.__name__

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                logging.exception(f"unhandled exception {identifier_name}")
                if catch_func is not None:
                    return catch_func(e)
                return default_value
        return wrapper
    return decorator
