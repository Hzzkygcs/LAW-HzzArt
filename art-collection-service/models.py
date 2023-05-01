from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Art(Base):
    __tablename__ = "arts"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    
    collection_id = Column(Integer, ForeignKey("art_collections.id"))
    collection = relationship("ArtCollection", back_populates="arts")

class ArtCollection(Base):
    __tablename__ = "art_collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    arts = relationship("Art", back_populates="collection")