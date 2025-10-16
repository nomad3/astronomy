from pydantic import BaseModel

# Shared properties
class CelestialObjectBase(BaseModel):
    name: str
    type: str
    distance_from_earth: float
    diameter: float
    mass: float

# Properties to receive on item creation
class CelestialObjectCreate(CelestialObjectBase):
    pass

# Properties to receive on item update
class CelestialObjectUpdate(CelestialObjectBase):
    pass

# Properties shared by models stored in DB
class CelestialObjectInDBBase(CelestialObjectBase):
    id: int

    class Config:
        from_attributes = True

# Properties to return to client
class CelestialObject(CelestialObjectInDBBase):
    pass

# Properties stored in DB
class CelestialObjectInDB(CelestialObjectInDBBase):
    pass
