import models, schemas

STORAGE = {}

def store(token, value, db):
    obj_token = models.Token(token=token, value=value)
    db.add(obj_token)
    db.commit()
    db.refresh(obj_token)
    
def get(token, db):
    db_token = db.query(models.Token).filter(models.Token.token == token).first()
    
    if db_token is None:
        return 404
    
    return db_token.value