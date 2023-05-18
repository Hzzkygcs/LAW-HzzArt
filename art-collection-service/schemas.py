from typing import List
from pydantic import BaseModel

class Image(BaseModel):
    url: str

class ImageCollection(BaseModel):
    name: str
    images: List[Image]
    
class CreateArtCollectionRequest(BaseModel):
    name: str
    
class GeneratorRequestPrompt(BaseModel):
    prompt: str
    
class AddImageToCollectionRequest(BaseModel):
    images: List[str]