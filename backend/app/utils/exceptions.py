from fastapi import HTTPException, status


class AlreadyExistsException(HTTPException):
    def __init__(self, entity: str, field: str, value: str):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{entity} with {field} '{value}' already exists.",
        )


class UserNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


class LastAdminException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the last admin user",
        )


class InvalidCredentialsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
