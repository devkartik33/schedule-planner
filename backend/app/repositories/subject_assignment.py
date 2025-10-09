from .base import BaseRepository
from ..models.subject_assignment import SubjectAssignment


class SubjectAssignmentRepository(BaseRepository):
    model = SubjectAssignment
