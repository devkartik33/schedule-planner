from sqlalchemy.orm import Session
from ..repositories import AcademicYearRepository
from ..models import AcademicYear
from ..schemas.academic_year import AcademicYearIn, AcademicYearUpdate
from .base import BaseService


class AcademicYearService(BaseService[AcademicYear, AcademicYearIn]):
    """
    Service layer for AcademicYear domain logic.

    Responsibilities:
    - Create/update academic years.
    - Enforce exclusivity of the is_current flag (at most one current year).
    - Delegate persistence to AcademicYearRepository.
    """

    def __init__(self, db: Session):
        """
        Initialize the AcademicYear service.

        Args:
            db (Session): Active SQLAlchemy session.

        Returns:
            None
        """
        super().__init__(db, AcademicYear, AcademicYearRepository(db))

    def create(self, academic_year: AcademicYearIn) -> AcademicYear:
        """
        Create a new academic year and ensure only one current year exists.

        If the incoming payload sets is_current=True and another current year exists,
        the existing current year is reset to False before creating the new one.

        Args:
            academic_year (AcademicYearIn): Input payload for the new academic year.

        Returns:
            AcademicYear: The newly created academic year.
        """
        # Ensure exclusivity of the current academic year flag
        curr_year = self.db.query(AcademicYear).filter(AcademicYear.is_current).first()

        if academic_year.is_current and curr_year:
            curr_year.is_current = False
            self.db.commit()

        return super().create(academic_year)

    def update(
        self, id: int, academic_year: AcademicYearIn | AcademicYearUpdate
    ) -> AcademicYear:
        """
        Update an academic year and maintain is_current exclusivity.

        If the update sets is_current=True for a different record while another
        current year exists, the other current year is reset to False first.

        Args:
            id (int): Identifier of the academic year to update.
            academic_year (AcademicYearIn | AcademicYearUpdate): Update payload.

        Returns:
            AcademicYear: The updated academic year.
        """
        # Ensure that only this updated record is marked as current
        curr_year = self.db.query(AcademicYear).filter(AcademicYear.is_current).first()

        if academic_year.is_current and curr_year and curr_year.id != id:
            curr_year.is_current = False
            self.db.commit()

        return super().update(id, academic_year)
