from .base import BaseRepository
from ..models import User, StudentProfile, ProfessorProfile
from ..utils.enums import UserRoleEnum


class UserRepository(BaseRepository):
    """Repository for User entities, providing common queries on top of BaseRepository."""

    model = User  # Underlying SQLAlchemy model for this repository

    def get_by_email(self, user_email: str) -> User | None:
        """
        Retrieve a single user by email.

        Args:
            user_email (str): Email address to match (unique).

        Returns:
            User | None: The matching user, or None if not found.
        """
        return self.db.query(User).filter(User.email == user_email).first()

    def get_by_role(self, user_role: str) -> list[User]:
        """
        Retrieve users by role.

        Args:
            user_role (str): Role to match (e.g., value of UserRoleEnum).

        Returns:
            list[User]: Users that have the specified role.
        """
        return self.db.query(User).filter(User.role == user_role).all()

    def get_by_user_type(self, user_type: str) -> list[User]:
        """
        Retrieve base users by user_type.

        Notes:
            This filters by role == UserRoleEnum.user and the provided user_type.

        Args:
            user_type (str): User type to match (e.g., Student/Professor enum value).

        Returns:
            list[User]: Users with base role and the given user_type.
        """
        return (
            self.db.query(User)
            .filter(User.role == UserRoleEnum.user, User.user_type == user_type)
            .all()
        )


class StudentProfileRepository(BaseRepository):
    """Repository for StudentProfile entities (CRUD via BaseRepository)."""

    model = StudentProfile


class ProfessorProfileRepository(BaseRepository):
    """Repository for ProfessorProfile entities (CRUD via BaseRepository)."""

    model = ProfessorProfile
