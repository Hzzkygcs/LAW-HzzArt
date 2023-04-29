STORAGE = {}

def store(token, value):
    STORAGE[token] = value
    
def get(token):
    try:
        value = STORAGE[token]
        return value
    except KeyError:
        return 404