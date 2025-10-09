from .base import BaseRepository
from ..models.semester import Semester


class SemesterRepository(BaseRepository):
    model = Semester
