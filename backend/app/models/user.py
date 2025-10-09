from __future__ import annotations
from ..database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum
from ..utils.enums import UserRoleEnum, UserTypeEnum

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .student_profile import StudentProfile
    from .professor_profile import ProfessorProfile
    from .schedule import Schedule


class User(Base):
    """
    Represents an application user. Responsible for authentication (email/password)
    and authorization (role, user_type). Serves as the root entity for per-role
    profile data via one-to-one relationships to StudentProfile and ProfessorProfile.
    A user may also be associated with created schedules (if/when that relation is enabled).

    Fields overview:
    - id: numeric primary key.
    - email: unique login identifier.
    - name/surname: personal identification fields.
    - role: authorization role controlling permissions.
    - user_type: high-level classification (e.g., Student/Professor), may be null until onboarding.
    - password_hash: hashed password; plaintext is never stored.
    - relations: one-to-one profiles for students and professors; cascades ensure cleanup on user deletion.
    """

    __tablename__ = "user"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )  # Unique numeric identifier (primary key)
    email: Mapped[str] = mapped_column(
        String(100), unique=True, index=True
    )  # Login email; unique and indexed
    name: Mapped[str] = mapped_column(String(100))  # First name (given name)
    surname: Mapped[str] = mapped_column(String(100))  # Last name (family name)
    role: Mapped[UserRoleEnum] = mapped_column(
        Enum(UserRoleEnum, create_constraint=True, name="user_role_enum"),
        default=UserRoleEnum.user,
    )  # Authorization role that governs permissions and access scope
    user_type: Mapped[UserTypeEnum] = mapped_column(
        Enum(UserTypeEnum, create_constraint=True, name="user_type_enum"), nullable=True
    )  # High-level user classification; can be null before profile completion
    password_hash: Mapped[str] = mapped_column(
        String(256)
    )  # Secure password hash (never store plaintext)

    # relations
    student_profile: Mapped["StudentProfile"] = relationship(
        "StudentProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )  # One-to-one student-specific profile; deleted with the user
    professor_profile: Mapped["ProfessorProfile"] = relationship(
        "ProfessorProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )  # One-to-one professor-specific profile; deleted with the user
    # schedules: Mapped[list["Schedule"]] = relationship("Schedule", back_populates="created_by")  # Potential one-to-many link to schedules created by this user
