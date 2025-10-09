from sqlalchemy.orm import Session
from ..repositories import FacultyRepository
from ..models import Faculty
from ..schemas.faculty import FacultyIn
from .base import BaseService


class FacultyService(BaseService[Faculty, FacultyIn]):
    """
    Service layer for Faculty domain logic.

    Responsibilities:
    - Provide listing with free-text name search.
    - Delegate CRUD to FacultyRepository via BaseService.
    """

    def __init__(self, db: Session):
        """
        Initialize the Faculty service.

        Args:
            db (Session): Active SQLAlchemy session.
        """
        super().__init__(db, Faculty, FacultyRepository(db))

    def apply_filters(self, query, params):
        """
        Apply free-text filtering by faculty name.

        Args:
            query: SQLAlchemy query object for Faculty.
            params: Query/filter params carrying a 'q' search string.

        Returns:
            The filtered SQLAlchemy query.
        """
        # Case-insensitive substring search on faculty name
        if params.q:
            query_string = params.q.strip()
            query = query.filter(Faculty.name.ilike(f"%{query_string}%"))

        return query
