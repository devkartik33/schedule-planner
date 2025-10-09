from .base import BaseRepository
from ..models.subject import Subject


class SubjectRepository(BaseRepository):
    model = Subject
