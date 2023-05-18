from ArtGenerator import ArtGenerator
import token_storage
import string, random
import models

def generate_sync(prompt, token, db) -> None:
    generator = ArtGenerator()
    generator.generate_image(prompt)
    
    print("Udah Selesai Generate")
    token_storage.store(token, generator.get_images(), db)

def generate_token(db) -> str:
    letters = string.ascii_letters + string.digits
    token = ''.join(random.choice(letters) for _ in range(25))
    
    while token_chekcer(token, db) is not None:
        token = ''.join(random.choice(letters) for _ in range(25))
        
    return token

def token_chekcer(token, db):
    db_token = db.query(models.Token).filter(models.Token.token == token).first()
    if db_token is not None:
        return db_token
    
    return None