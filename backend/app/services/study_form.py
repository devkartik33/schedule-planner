from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..repositories import StudyFormRepository
from ..models import StudyForm
from ..models.direction import Direction
from ..schemas.study_form import StudyFormIn
from .base import BaseService


class StudyFormService(BaseService[StudyForm, StudyFormIn]):
    """
    Service layer for StudyForm domain logic.

    Responsibilities:
    - Delegate CRUD to StudyFormRepository via BaseService.
    - Provide custom sorting (e.g., by related Direction name).
    """

    def __init__(self, db: Session):
        """
        Initialize the StudyForm service.

        Args:
            db (Session): Active SQLAlchemy session.
        """
        super().__init__(db, StudyForm, StudyFormRepository(db))

    def apply_sorting(self, query, params):
        """
        Apply sorting to the study forms query.

        Supports:
        - sort_by == "direction_name": sorts by the related Direction.name
          (joins Direction to access the column).
        - Otherwise: falls back to BaseService.apply_sorting.

        Args:
            query: SQLAlchemy query object for StudyForm.
            params: Query params providing sort_by and desc flags.

        Returns:
            The SQLAlchemy query with ordering applied.
        """
        if params.sort_by == "direction_name":
            # Join Direction to enable sorting by direction name
            query = query.join(StudyForm.direction)
            # Sort by Direction.name in the requested order
            if params.desc:
                query = query.order_by(Direction.name.desc())
            else:
                query = query.order_by(Direction.name.asc())
        else:
            # Delegate to the base class for all other sort fields
            query = super().apply_sorting(query, params)

        return query
