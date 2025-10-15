from db.session import engine
from db.base import Base
from models.celestial_object import CelestialObject

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
