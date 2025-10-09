from .base import BaseRepository
from ..models.direction import Direction


class DirectionRepository(BaseRepository):
    model = Direction
