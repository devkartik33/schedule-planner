from __future__ import annotations
from ..database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, UniqueConstraint

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .study_form import StudyForm
    from .professor_contract import ProfessorContract
    from .subject_assignment import SubjectAssignment


class ProfessorWorkload(Base):
    """
    Represents a professor’s workload allocation within a specific contract (semester)
    and study form. Tracks the total budgeted hours and how they are consumed by
    subject assignments. Ensures uniqueness per (contract, study_form).

    Fields overview:
    - id: numeric primary key.
    - study_form_id: FK to StudyForm this workload applies to.
    - contract_id: FK to ProfessorContract (semester-specific).
    - assigned_hours: total hours allocated under this contract/study form.
    - unique constraint: one workload per (contract, study_form).
    - relationships: study_form, contract, subject_assignments.
    - properties: totals and convenience accessors (professor, faculty, direction, year, semester).
    """

    __tablename__ = "professor_workload"

    id: Mapped[int] = mapped_column(primary_key=True)  # Unique identifier (primary key)
    study_form_id: Mapped[int] = mapped_column(
        ForeignKey("study_form.id")
    )  # FK to the target study form
    contract_id: Mapped[int] = mapped_column(
        ForeignKey("professor_contract.id")
    )  # FK to the parent professor contract (semester)

    # Total hours allocated for this study form under the given contract
    assigned_hours: Mapped[int] = mapped_column(Integer)

    # Ensure a single workload per (contract, study_form) combination
    __table_args__ = (
        UniqueConstraint(
            "contract_id",
            "study_form_id",
            name="uq_contract_study_form",
        ),
    )

    # relations
    study_form: Mapped["StudyForm"] = relationship(
        "StudyForm", back_populates="workloads"
    )  # Many-to-one: workload is defined for one study form
    contract: Mapped["ProfessorContract"] = relationship(
        "ProfessorContract", back_populates="workloads"
    )  # Many-to-one: parent professor contract (semester)
    subject_assignments: Mapped[list["SubjectAssignment"]] = relationship(
        "SubjectAssignment", back_populates="workload", cascade="all, delete-orphan"
    )  # One-to-many: assignments consuming the allocated hours

    @property
    def total_assignment_hours(self) -> int:
        """Calculate total assignment hours for this workload."""
        return sum(
            assignment.hours_per_subject for assignment in self.subject_assignments
        )

    @property
    def remaining_hours(self) -> int:
        """Calculate remaining hours for this workload."""
        return self.assigned_hours - self.total_assignment_hours

    @property
    def professor(self):
        # Convenience: User associated via the contract’s professor profile.
        return self.contract.professor_profile.user

    @property
    def faculty(self):
        # Convenience: Faculty derived from the direction of the study form.
        return self.study_form.direction.faculty

    @property
    def direction(self):
        # Convenience: Direction for this workload (via study form).
        return self.study_form.direction

    @property
    def academic_year(self):
        # Convenience: Academic year via the contract’s semester.
        return self.contract.semester.academic_year

    @property
    def semester(self):
        # Convenience: Semester associated with the parent contract.
        return self.contract.semester
