from pydantic import BaseModel, ConfigDict, Field
from .shared import BaseQueryParams
from .minis import ProfessorMiniOut, SubjectMiniOut, DirectionMiniOut


class SubjectAssignmentBase(BaseModel):
    """
    Base schema for SubjectAssignment shared by input/output models.
    Links a subject to a professor workload and defines allocated hours.
    """

    model_config = ConfigDict(from_attributes=True)
    subject_id: int = Field(
        ...,
        description="Identifier of the subject being assigned.",
        examples=[7],
    )
    workload_id: int = Field(
        ...,
        description="Identifier of the professor workload under which this subject is assigned.",
        examples=[11],
    )
    hours_per_subject: int = Field(
        gt=0,
        description="Allocated hours for the subject within the workload.",
        examples=[36],
    )


class SubjectAssignmentIn(SubjectAssignmentBase):
    """Input schema for creating a SubjectAssignment."""

    pass


class SubjectAssignmentUpdate(BaseModel):
    """Partial update schema for SubjectAssignment; all fields are optional."""

    subject_id: int | None = Field(
        None,
        gt=0,
        description="Optional new subject identifier.",
        examples=[8],
    )
    workload_id: int | None = Field(
        None,
        gt=0,
        description="Optional new workload identifier.",
        examples=[12],
    )
    hours_per_subject: int | None = Field(
        None,
        gt=0,
        description="Optional new allocated hours.",
        examples=[40],
    )


class SubjectAssignmentOut(SubjectAssignmentBase):
    """Output schema for SubjectAssignment including identifiers and related mini resources."""

    id: int = Field(
        ...,
        description="Unique identifier of the subject assignment.",
        examples=[42],
    )
    hours_per_subject: int = Field(
        ...,
        gt=0,
        description="Allocated hours for the subject within the workload.",
        examples=[36],
    )
    direction: DirectionMiniOut = Field(
        ...,
        description="Mini representation of the direction (derived from subject).",
        examples=[{"id": 3, "name": "Computer Science", "code": "CS-01"}],
    )
    subject: SubjectMiniOut = Field(
        ...,
        description="Mini representation of the subject.",
        examples=[{"id": 7, "name": "Algebra", "code": "MATH101", "color": "#0000FF"}],
    )
    professor: ProfessorMiniOut = Field(
        ...,
        description="Mini representation of the professor (user) teaching this subject.",
        examples=[
            {"id": 55, "email": "ada@example.com", "name": "Ada", "surname": "Lovelace"}
        ],
    )


class SubjectAssignmentFilters(BaseModel):
    """Filtering parameters for listing subject assignments."""

    workload_id: int | None = Field(
        default=None,
        description="Filter by workload identifier.",
        examples=[11],
    )
    schedule_id: int | None = Field(
        default=None,
        description="Filter by schedule identifier (for lessons under this assignment).",
        examples=[5],
    )


class SubjectAssignmentQueryParams(BaseQueryParams, SubjectAssignmentFilters):
    """Query parameters combining pagination/sorting with subject assignment filters."""

    pass
