import models, schemas
import json

STORAGE = {}


def store(token, value, db):
    check_token = db.query(models.Token).filter(models.Token.token == token).one_or_none()
    if check_token is not None:
        for i in range(len(value)):
            value[i] = value[i].decode('UTF-8')
        json_value = json.dumps(value)
        check_token.value = json_value
        db.commit()
    else:
        check_token = models.Token(token=token, value=value)
        db.add(check_token)
        db.commit()
        db.refresh(check_token)


def get(token, db):
    db_token = db.query(models.Token).filter(models.Token.token == token).first()

    if db_token is None:
        return 404

    if db_token.value is None:
        return db_token.value
    
    return json.loads(db_token.value)
