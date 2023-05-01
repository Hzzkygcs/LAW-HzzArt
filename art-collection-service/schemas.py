from typing import List
from pydantic import BaseModel

class Art(BaseModel):
    url: str

class ArtCollection(BaseModel):
    name: str
    arts: List[Art]
    
class CreateArtCollectionRequest(BaseModel):
    name: str
    
class GeneratorRequestPrompt(BaseModel):
    prompt: str
    
class AddImageToCollectionRequest(BaseModel):
    images: List[str]