import threading

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.params import Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import asyncio
import json
import requests
import utils
import token_storage
import models, schemas
import base64

app = FastAPI()

# Dependency to get a database session
def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
        
def get_login_url():
    return "http://login-orchestration:8085"

def validate_jwt(jwt_token):
    if jwt_token is not None:
        response = requests.post(
            url = get_login_url() + '/login/validate-login',
            data = json.dumps({'x-jwt-token': jwt_token}),
            headers = {'Content-Type': 'application/json'}
        )
        
        if response.status_code == 200:
            return response
    
    raise HTTPException(status_code=401, detail="Unauthorized access")

def get_username(response):
    try:
        data = response.json()
        username = data['username']
        
        return username
    except json.decoder.JSONDecoderError as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/collections/generate", status_code = 200)
def generate_art(request: Request, generator_promt: schemas.GeneratorRequestPrompt, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    validate_jwt(jwt_token)
    
    token = utils.generate_token(db)
    token_storage.store(token, None, db)

    run_in_new_thread(utils.generate_sync, args=(generator_promt.prompt, token, db))
    return {"token": token}




@app.get("/collections/generated-images/{token}", status_code = 200)
def get_generated_image(request: Request, token: str, db: Session = Depends(get_db)):
    print("MASUK")
    
    jwt_token = request.headers.get('x-jwt-token')
    validate_jwt(jwt_token)
    
    images = token_storage.get(token, db)
    if images == None:
        return {"token": token, "status": "In Progress"}
    elif images == 404:
        raise HTTPException(status_code=404, detail="Token does not exist")
    
    return {"value": images}


@app.post("/collections", status_code = 201)
def create_collection(request: Request, collection: schemas.CreateArtCollectionRequest, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    response = validate_jwt(jwt_token)
    
    username = get_username(response)
    
    db_collection = models.ArtCollection(name=collection.name, owner=username)
    
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return {"id": db_collection.id, "message": "Successfully created"}

@app.get("/collections")
def get_owned_collection(request: Request, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    response = validate_jwt(jwt_token)
    
    username = get_username(response)
    
    db_collection = db.query(models.ArtCollection).filter(models.ArtCollection.owner == username).all()
    owned_collection = []
    
    if db_collection is not None:
        for collection in db_collection:
            images = []
            db_images = db.query(models.Image).filter(models.Image.collection_id == collection.id).all()
            
            if db_images is not None:
                for image in db_images:
                    images.append(image.id)
            
            response_data = {
                'id': collection.id,
                'name': collection.name,
                'owner': collection.owner,
                'images': images
            }
            
            owned_collection.append(response_data)
    
    return {'collections' : owned_collection}

@app.get("/collections/{collection_id}")
def get_collection(request: Request, collection_id: int, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    validate_jwt(jwt_token)
    
    db_collection = db.query(models.ArtCollection).filter(models.ArtCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection does not exist")
    
    images = []
    db_images = db.query(models.Image).filter(models.Image.collection_id == collection_id).all()
    if db_images is not None:
        for image in db_images:
            images.append(image.id)
    
    response_data = {
        'id': db_collection.id,
        'name': db_collection.name,
        'owner': db_collection.owner,
        'images': images
    }
    
    return response_data


@app.put("/collections/{collection_id}", status_code = 200)
def edit_collection(request: Request, collection_id: int, collection: schemas.CreateArtCollectionRequest, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    response = validate_jwt(jwt_token)
    
    username = get_username(response)
    
    db_collection = db.query(models.ArtCollection).filter(models.ArtCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection does not exist")
    
    if db_collection.owner != username:
        raise HTTPException(status_code=403, detail="This collection does not belong to you")
    
    db_collection.name = collection.name
    db.commit()
    
    return {"id": db_collection.id, "message": "Successfully edited"}


@app.post("/collections/{collection_id}/add", status_code = 200)
def add_image_to_collection(request: Request, collection_id: int, arts: schemas.AddImageToCollectionRequest, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    validate_jwt(jwt_token)
    
    db_collection = db.query(models.ArtCollection).filter(models.ArtCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection does not exist")
    
    for image in arts.images:
        art = models.Image(url=image, collection_id=db_collection.id)
        db.add(art)
    db.commit()
    
    return {"id": db_collection.id, "message": "Successfully added"}


@app.delete("/collections/delete-image/{image_id}", status_code = 200)
def delete_image(request: Request, image_id: int, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    validate_jwt(jwt_token)
    
    db_image = db.query(models.Image).filter(models.Image.id == image_id).first()
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image does not exist")
    
    db.delete(db_image)
    db.commit()
    
    return {"message": "Successfully deleted"}


@app.get("/collections/image/{image_id}", status_code = 200)
def get_image(request: Request, image_id: int, db: Session = Depends(get_db)):
    
    jwt_token = request.headers.get('x-jwt-token')
    validate_jwt(jwt_token)
    
    db_image = db.query(models.Image).filter(models.Image.id == image_id).first()
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image does not exist")
    
    image_decode_bytes = base64.b64decode(db_image.url)
    return Response(content=image_decode_bytes, media_type="image/png")


def run_in_new_thread(func, args: tuple):
    thread = threading.Thread(target=func, args=args, daemon=True)
    thread.start()
    return thread


