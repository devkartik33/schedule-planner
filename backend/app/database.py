from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import DeclarativeBase

engine = create_engine("sqlite:///data.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    def __init__(self, **entries):
        # ignore extra keywords when creating an instance
        self.__dict__.update(entries)
