from fastapi import FastAPI, HTTPException
from fastapi.params import Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from ArtGenerator import ArtGenerator
import models, schemas

app = FastAPI()

# Dependency to get a database session
def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@app.post("/generate", status_code = 200)
def generate_art(request: schemas.GeneratorRequestPrompt, db: Session = Depends(get_db)):
    # TODO: Masih binggung mau gimana
    generator = ArtGenerator()
    generator.generate_image(request.prompt)
    return generator.get_images()

@app.post("/collections", status_code = 201)
def create_collection(collection: schemas.CreateArtCollectionRequest, db: Session = Depends(get_db)):
    db_collection = models.ArtCollection(name=collection.name)
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return {"message": "Collection created successfully!"}

@app.get("/collections/{collection_id}")
def get_collection(collection_id: int, db: Session = Depends(get_db)):
    db_collection = db.query(models.ArtCollection).filter(models.ArtCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    return db_collection

@app.post("/collections/{collection_id}/add", status_code = 200)
def add_image_to_collection(collection_id: int, arts: schemas.AddImageToCollectionRequest, db: Session = Depends(get_db)):
    db_collection = db.query(models.ArtCollection).filter(models.ArtCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    for image in arts.images:
        art = models.Art(url=image)
        db.add(art)
        db_collection.images.append(art)
    db.commit()
    
    return {"message": "Art added to collection"}