import models, schemas

STORAGE = {}


def store(token, value, db):
    check_token = db.query(models.Token).filter(models.Token.token == token).one_or_none()
    if check_token is not None:
        check_token.value = value
    else:
        check_token = models.Token(token=token, value=value)
    db.add(check_token)
    db.commit()
    db.refresh(check_token)


def get(token, db):
    db_token = db.query(models.Token).filter(models.Token.token == token).first()

    if db_token is None:
        return 404

    return db_token.value
