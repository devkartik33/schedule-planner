from sqlalchemy.orm import Session
from ..repositories import SubjectRepository
from ..models import Subject, Direction, Semester
from ..schemas.subject import SubjectIn
from .base import BaseService


class SubjectService(BaseService[Subject, SubjectIn]):
    """
    Service layer for Subject domain logic.

    Responsibilities:
    - Provide listing with rich filtering across semester, academic year, faculty, and direction.
    - Delegate CRUD operations to SubjectRepository via BaseService.
    """

    def __init__(self, db: Session):
        """
        Initialize the Subject service.

        Args:
            db (Session): Active SQLAlchemy session.
        """
        super().__init__(db, Subject, SubjectRepository(db))

    def apply_filters(self, query, params):
        """
        Apply filters to the subjects query.

        Joins:
        - Subject.direction (for faculty/direction filters)
        - Subject.semester (for academic year/period filters)

        Supported filters:
        - q: case-insensitive substring search by subject name.
        - academic_year_ids: filter by one or more academic years (via Semester).
        - periods: filter by semester periods (enum).
        - semester_ids: filter by specific semester IDs.
        - faculty_ids: filter by owning faculty IDs (via Direction).
        - direction_ids: filter by specific direction IDs.

        Args:
            query: SQLAlchemy query object for Subject.
            params: Combined query/filter params.

        Returns:
            The filtered SQLAlchemy query.
        """
        # Join related tables to enable filters across relationships
        query = query.join(Subject.direction).join(Subject.semester)

        # Free-text search by subject name
        if params.q:
            query_string = params.q.strip()
            query = query.filter(Subject.name.ilike(f"%{query_string}%"))

        # Filter by academic year (via semester)
        if params.academic_year_ids:
            query = query.filter(
                Semester.academic_year_id.in_(params.academic_year_ids)
            )
        # Filter by semester period
        if params.periods:
            query = query.filter(Semester.period.in_(params.periods))
        # Filter by semester IDs
        if params.semester_ids:
            query = query.filter(Subject.semester_id.in_(params.semester_ids))
        # Filter by faculty (via direction)
        if params.faculty_ids:
            query = query.filter(
                Subject.direction.has(Direction.faculty_id.in_(params.faculty_ids))
            )
        # Filter by direction IDs
        if params.direction_ids:
            query = query.filter(Subject.direction_id.in_(params.direction_ids))
        return super().apply_filters(query, params)
