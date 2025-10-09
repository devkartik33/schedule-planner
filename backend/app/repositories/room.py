from .base import BaseRepository
from ..models.room import Room


class RoomRepository(BaseRepository):
    model = Room
