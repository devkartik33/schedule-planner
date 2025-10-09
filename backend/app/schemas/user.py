from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
    field_serializer,
)
from typing import Annotated
from typing_extensions import Self
from ..utils.enums import UserRoleEnum, UserTypeEnum
from .minis import GroupMiniOut, SemesterMiniOut, AcademicYearMiniOut
from .shared import BaseQueryParams, BaseFilterParams


class UserBase(BaseModel):
    """
    Base schema for User data shared by input/output models.
    Captures identity, role, and optional user type classification.
    """

    model_config = ConfigDict(from_attributes=True)

    email: Annotated[
        str,
        Field(
            max_length=100,
            description="Unique email address used for login.",
            examples=["user@example.com"],
        ),
    ]
    name: Annotated[
        str,
        Field(
            max_length=100,
            description="First (given) name of the user.",
            examples=["Ada"],
        ),
    ]
    surname: Annotated[
        str,
        Field(
            max_length=100,
            description="Last (family) name of the user.",
            examples=["Lovelace"],
        ),
    ]
    role: Annotated[
        UserRoleEnum,
        Field(
            default=UserRoleEnum.user,
            description="Authorization role determining permissions (e.g., admin, user).",
            examples=["user"],
        ),
    ]
    user_type: UserTypeEnum | None = Field(
        default=None,
        description="Optional classification for base users (e.g., STUDENT, PROFESSOR).",
        examples=["STUDENT"],
    )


class UserIn(UserBase):
    """
    Input schema for creating a User.
    Includes password and optional group association for students.
    """

    password: Annotated[
        str,
        Field(
            min_length=3,
            description="Plaintext password for account creation (will be hashed).",
            examples=["s3cr3tPwd"],
        ),
    ]
    group_id: Annotated[
        int | None,
        Field(
            default=None,
            gt=0,
            description="Optional group ID (typically for students).",
            examples=[10],
        ),
    ]

    @model_validator(mode="after")
    def check_user_specific_fields(self) -> Self:
        """
        Validate consistency between role and user_type.

        Ensures:
        - If role == user, user_type must be provided (STUDENT or PROFESSOR).
        - If role != user, user_type must be None.
        """
        if self.role == UserRoleEnum.user:
            if not self.user_type:
                raise ValueError(
                    f"User with a role {self.role} must have a type {UserTypeEnum.student} or {UserTypeEnum.professor}"
                )
        elif self.user_type is not None:
            raise ValueError(f"User with a role {self.role} must not have a type")
        return self


class UserUpdate(BaseModel):
    """
    Partial update schema for User; all fields are optional.
    """

    model_config = ConfigDict(from_attributes=True)

    email: Annotated[
        str | None,
        Field(
            None,
            max_length=100,
            description="Optional new email address.",
            examples=["new.user@example.com"],
        ),
    ]
    password: Annotated[
        str | None,
        Field(
            None,
            min_length=3,
            description="Optional new plaintext password (will be hashed).",
            examples=["n3wS3cr3t"],
        ),
    ]
    name: Annotated[
        str | None,
        Field(
            None,
            max_length=100,
            description="Optional new first name.",
            examples=["Grace"],
        ),
    ]
    surname: Annotated[
        str | None,
        Field(
            None,
            max_length=100,
            description="Optional new last name.",
            examples=["Hopper"],
        ),
    ]
    role: Annotated[
        UserRoleEnum | None,
        Field(
            None,
            description="Optional new authorization role.",
            examples=["admin"],
        ),
    ]
    user_type: Annotated[
        UserTypeEnum | None,
        Field(
            None,
            description="Optional new user type (for base users).",
            examples=["PROFESSOR"],
        ),
    ]
    group_id: Annotated[
        int | None,
        Field(
            None,
            gt=0,
            description="Optional new group ID.",
            examples=[12],
        ),
    ]


class StudentProfileOut(BaseModel):
    """
    Student profile projection nested inside UserOut.
    Provides group and derived academic period info.
    """

    group: GroupMiniOut | None = Field(
        default=None,
        description="Mini representation of the student's group.",
        examples=[{"id": 10, "name": "CS-101"}],
    )
    academic_year: AcademicYearMiniOut | None = Field(
        default=None,
        description="Mini representation of the academic year (derived via group).",
        examples=[{"id": 1, "name": "2024-2025"}],
    )
    semester: SemesterMiniOut | None = Field(
        default=None,
        description="Mini representation of the semester (derived via group).",
        examples=[{"id": 2, "name": "Fall 2024"}],
    )


class ProfessorProfileOut(BaseModel):
    """
    Professor profile projection nested inside UserOut.
    Reserved for future professor-specific fields.
    """

    pass


class UserOut(UserBase):
    """
    Output schema for User including identifiers and optional role-specific profiles.
    """

    id: int = Field(
        ...,
        description="Unique identifier of the user.",
        examples=[5],
    )
    student_profile: StudentProfileOut | None = Field(
        default=None,
        description="Student profile details when the user is a student.",
        examples=[{"group": {"id": 10, "name": "CS-101"}}],
    )
    professor_profile: ProfessorProfileOut | None = Field(
        default=None,
        description="Professor profile details when the user is a professor.",
        examples=[{}],
    )


class UserFilterParams(BaseFilterParams):
    """
    Filtering parameters for listing users.
    """

    user_roles: list[UserRoleEnum] = Field(
        default=[],
        description="Filter by one or more user roles (e.g., admin, user).",
        examples=[["admin", "user"]],
    )
    user_types: list[UserTypeEnum] = Field(
        default=[],
        description="Filter by one or more user types (e.g., STUDENT, PROFESSOR).",
        examples=[["STUDENT"]],
    )


class UserQueryParams(BaseQueryParams, UserFilterParams):
    """
    Query parameters combining pagination/sorting with user filters.
    """

    pass


class Token(BaseModel):
    """
    Authentication token pair returned after successful login or refresh.
    """

    access_token: str = Field(
        ...,
        description="JWT access token for authenticated requests.",
        examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
    )
    refresh_token: str = Field(
        ...,
        description="JWT refresh token used to obtain a new access token.",
        examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh..."],
    )
    token_type: str = Field(
        ...,
        description='Token type hint for clients (typically "bearer").',
        examples=["bearer"],
    )


class TokenData(BaseModel):
    """
    Decoded token payload used internally for authorization.
    """

    sub: str = Field(
        ...,
        description="Subject (user identifier) embedded in the token.",
        examples=["5"],
    )
    role: str = Field(
        ...,
        description="User role embedded in the token.",
        examples=["user"],
    )
    exp: int = Field(
        ...,
        description="Expiration time as a UNIX timestamp (seconds).",
        examples=[1732051200],
    )


class RefreshTokenIn(BaseModel):
    """
    Input schema for refreshing an access token using a refresh token.
    """

    refresh_token: str = Field(
        ...,
        description="JWT refresh token issued during authentication.",
        examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh..."],
    )
