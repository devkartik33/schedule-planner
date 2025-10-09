from __future__ import annotations
from ..database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User
    from .group import Group


class StudentProfile(Base):
    """
    Represents student-specific data linked one-to-one with a User.
    Optionally associates the student with a Group to infer semester and academic year.

    Fields overview:
    - user_id: primary key and FK to User (enforces one-to-one).
    - group_id: optional FK to Group; set to NULL if the group is deleted.
    - relationships: user (one-to-one), group (many-to-one).
    - properties: academic_year, semester (derived via the group).
    """

    __tablename__ = "student_profile"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), primary_key=True
    )  # One-to-one PK/FK to the owning User
    group_id: Mapped[int] = mapped_column(
        ForeignKey("group.id", ondelete="SET NULL"), nullable=True
    )  # Optional FK to Group; becomes NULL if the group is deleted

    # relations
    user: Mapped["User"] = relationship(
        "User", back_populates="student_profile", lazy="selectin"
    )  # One-to-one: reverse link from User.student_profile
    group: Mapped["Group"] = relationship(
        "Group", passive_deletes=True, back_populates="students", lazy="selectin"
    )  # Many-to-one: the group this student belongs to (if any)

    @property
    def academic_year(self):
        # AcademicYear via the group's semester; None if no group is assigned.
        if not self.group:
            return None
        return self.group.semester.academic_year

    @property
    def semester(self):
        # Semester via the assigned group; None if no group is assigned.
        if not self.group:
            return None
        return self.group.semester
