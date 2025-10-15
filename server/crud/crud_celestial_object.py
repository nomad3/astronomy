from sqlalchemy.orm import Session

from models.celestial_object import CelestialObject
from schemas.celestial_object import CelestialObjectCreate


def get(db: Session, id: int):
    return db.query(CelestialObject).filter(CelestialObject.id == id).first()

def get_by_name(db: Session, name: str):
    return db.query(CelestialObject).filter(CelestialObject.name == name).first()

def get_multi(db: Session, skip: int = 0, limit: int = 100):
    return db.query(CelestialObject).offset(skip).limit(limit).all()

def create(db: Session, obj_in: CelestialObjectCreate):
    db_obj = CelestialObject(
        name=obj_in.name,
        type=obj_in.type,
        distance_from_earth=obj_in.distance_from_earth,
        diameter=obj_in.diameter,
        mass=obj_in.mass,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
