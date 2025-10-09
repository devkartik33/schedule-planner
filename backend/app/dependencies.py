from typing import Annotated
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import User

from .services import UserService
from .utils.enums import UserRoleEnum
from .utils import security, exceptions

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def get_db():
    """
    Provide a SQLAlchemy Session for the request lifecycle.

    Yields:
        Session: An active SQLAlchemy session.

    Notes:
        The session is closed automatically after the request via the finally block.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    *, db: Session = Depends(get_db), token: Annotated[str, Depends(oauth2_scheme)]
):
    """
    Resolve and return the current authenticated user from a Bearer token.

    Args:
        db (Session): SQLAlchemy session injected via dependency.
        token (str): OAuth2 Bearer token obtained from the Authorization header.

    Returns:
        User: The authenticated user.

    Raises:
        InvalidCredentialsException: If the token is invalid/expired or the user does not exist.
    """
    payload = security.decode_token(token=token)

    user = UserService(db).get_by_id(int(payload.get("sub")))

    if user is None:
        raise exceptions.InvalidCredentialsException()
    return user


class RoleChecker:
    """
    Dependency that checks whether the current user has one of the allowed roles.

    Usage:
        Depends(RoleChecker([UserRoleEnum.admin, UserRoleEnum.user]))
    """

    def __init__(self, allowed_roles: list[UserRoleEnum]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)):
        """
        Validate access for the current user against the allowed roles.

        Args:
            current_user (User): Authenticated user injected via get_current_user.

        Raises:
            HTTPException: 403 Forbidden when the user's role is not permitted.
        """
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permissions to access the resource",
            )
