from .base import BaseRepository
from ..models.faculty import Faculty


class FacultyRepository(BaseRepository):
    model = Faculty
