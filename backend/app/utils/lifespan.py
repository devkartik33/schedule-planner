from fastapi import FastAPI
from contextlib import asynccontextmanager

from ..database import SessionLocal
import app.utils.seeder as seed
from ..config import setting


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Server started!!!")
    db = SessionLocal()

    if setting.RESET_DB_ON_START:
        seed.drop_and_create_db()
        seed.seed_test_data(db)

    seed.seed_first_admin(db)

    yield
    print("Server closed!!!")
