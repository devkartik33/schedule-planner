from .base import BaseRepository
from ..models.professor_workload import ProfessorWorkload


class ProfessorWorkloadRepository(BaseRepository):
    model = ProfessorWorkload
