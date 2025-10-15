from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api import deps
from crud import crud_celestial_object
from schemas.celestial_object import CelestialObject, CelestialObjectCreate

router = APIRouter()

@router.get("/celestial-objects", response_model=List[CelestialObject])
def read_celestial_objects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> List[CelestialObject]:
    """
    Retrieve celestial objects.
    """
    objects = crud_celestial_object.get_multi(db, skip=skip, limit=limit)
    return objects

@router.post("/celestial-objects", response_model=CelestialObject)
def create_celestial_object(
    *, # force keyword-only arguments
    db: Session = Depends(deps.get_db),
    obj_in: CelestialObjectCreate,
) -> CelestialObject:
    """
    Create new celestial object.
    """
    db_obj = crud_celestial_object.get_by_name(db, name=obj_in.name)
    if db_obj:
        raise HTTPException(
            status_code=400,
            detail="A celestial object with this name already exists in the system.",
        )
    new_obj = crud_celestial_object.create(db=db, obj_in=obj_in)
    return new_obj
