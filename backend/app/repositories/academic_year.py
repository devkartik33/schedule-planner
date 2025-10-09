from .base import BaseRepository
from ..models.academic_year import AcademicYear


class AcademicYearRepository(BaseRepository):
    model = AcademicYear
