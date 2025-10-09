from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..repositories import ProfessorContractRepository
from ..models import ProfessorContract, ProfessorProfile, User, Semester
from ..schemas.professor_contract import ProfessorContractIn
from ..schemas.minis import ProfessorMiniOut
from .base import BaseService


class ProfessorContractService(BaseService[ProfessorContract, ProfessorContractIn]):
    """
    Service layer for ProfessorContract domain logic.

    Responsibilities:
    - List and filter professor contracts by professor identity and semester context.
    - Delegate CRUD operations to ProfessorContractRepository via BaseService.
    """

    def __init__(self, db: Session):
        """
        Initialize the ProfessorContract service.

        Args:
            db (Session): Active SQLAlchemy session.
        """
        super().__init__(db, ProfessorContract, ProfessorContractRepository(db))

    def apply_filters(self, query, params):
        """
        Apply filters to the professor contracts query.

        Supported filters:
        - q: free-text search by professor email, name, or surname (case-insensitive).
        - academic_year_ids: filter by academic year IDs (via semester).
        - periods: filter by semester periods (enum values).
        - semester_ids: filter by specific semester IDs.

        Args:
            query: SQLAlchemy query object for ProfessorContract.
            params: Combined query/filter params carrying fields above.

        Returns:
            The filtered SQLAlchemy query.
        """
        # Add JOINs to access related data for filtering
        query = (
            query.join(ProfessorContract.professor_profile)
            .join(ProfessorProfile.user)
            .join(ProfessorContract.semester)
        )

        if params.q:
            query_string = params.q.strip()
            query = query.filter(
                or_(
                    User.email.ilike(f"%{query_string}%"),
                    User.name.ilike(f"%{query_string}%"),
                    User.surname.ilike(f"%{query_string}%"),
                )
            )

        if params.academic_year_ids:
            query = query.filter(
                Semester.academic_year_id.in_(params.academic_year_ids)
            )
        if params.periods:
            query = query.filter(Semester.period.in_(params.periods))

        if params.semester_ids:
            query = query.filter(Semester.id.in_(params.semester_ids))
        return super().apply_filters(query, params)
