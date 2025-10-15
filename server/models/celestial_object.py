from sqlalchemy import Column, Integer, String, Float

from db.base import Base

class CelestialObject(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    type = Column(String)
    distance_from_earth = Column(Float) # in light-years
    diameter = Column(Float) # in km
    mass = Column(Float) # in 10^24 kg
