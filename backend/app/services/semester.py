from sqlalchemy.orm import Session
from ..repositories import SemesterRepository
from ..models import Semester
from ..schemas.semester import SemesterIn
from .base import BaseService


class SemesterService(BaseService[Semester, SemesterIn]):
    """
    Service layer for Semester domain logic.

    Responsibilities:
    - Provide listing with filtering by academic year, period, and number.
    - Delegate CRUD operations to SemesterRepository via BaseService.
    """

    def __init__(self, db: Session):
        """
        Initialize the Semester service.

        Args:
            db (Session): Active SQLAlchemy session.
        """
        super().__init__(db, Semester, SemesterRepository(db))

    def apply_filters(self, query, params):
        """
        Apply filters to the semesters query.

        Supported filters:
        - academic_year_ids: filter by one or more academic year IDs.
        - periods: filter by semester period enum values.
        - numbers: filter by sequential semester numbers.

        Args:
            query: SQLAlchemy query object for Semester.
            params: Combined query/filter params carrying the fields above.

        Returns:
            The filtered SQLAlchemy query.
        """
        # Filter by academic year IDs
        if params.academic_year_ids:
            query = query.filter(
                Semester.academic_year_id.in_(params.academic_year_ids)
            )

        # Filter by semester periods
        if params.periods:
            query = query.filter(Semester.period.in_(params.periods))

        # Filter by semester numbers
        if params.numbers:
            query = query.filter(Semester.number.in_(params.numbers))

        return super().apply_filters(query, params)
