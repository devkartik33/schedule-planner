from .base import BaseRepository
from ..models.lesson import Lesson


class LessonRepository(BaseRepository):
    model = Lesson
