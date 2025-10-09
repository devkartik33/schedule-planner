from .base import BaseRepository
from ..models.professor_contract import ProfessorContract


class ProfessorContractRepository(BaseRepository):
    model = ProfessorContract
