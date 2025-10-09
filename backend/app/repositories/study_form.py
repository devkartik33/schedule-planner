from sqlalchemy.orm import selectinload
from .base import BaseRepository
from ..models.study_form import StudyForm


class StudyFormRepository(BaseRepository):
    model = StudyForm

    def query(self):
        return self.db.query(self.model).options(selectinload(self.model.direction))
