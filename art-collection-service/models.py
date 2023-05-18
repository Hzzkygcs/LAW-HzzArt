from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Image(Base):
    __tablename__ = "image"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    
    collection_id = Column(Integer, ForeignKey("art_collections.id"))

class ArtCollection(Base):
    __tablename__ = "art_collection"

    id = Column(Integer, primary_key=True, index=True)
    owner = Column(String, index=True)
    name = Column(String, index=True)
    
class Token(Base):
    __tablename__ = "token"
    
    token = Column(String, primary_key=True, index=True)
    value = Column(String, default=None)