from pydantic import BaseModel, ConfigDict, Field
from .shared import BaseQueryParams, BaseFilterParams
from .group import GroupOut
from .subject import SubjectOut


class FacultyBase(BaseModel):
    """
    Base schema for Faculty data shared across input/output models.
    Captures the core identity of a faculty (e.g., school/department).
    """

    model_config = ConfigDict(from_attributes=True)

    name: str = Field(
        max_length=100,
        description="Unique faculty name.",
        examples=["Faculty of Engineering"],
    )


class FacultyIn(FacultyBase):
    """Input schema for creating a Faculty."""

    pass


class FacultyUpdate(BaseModel):
    """Partial update schema for Faculty; all fields are optional."""

    name: str | None = Field(
        None,
        max_length=100,
        description="Optional new faculty name.",
        examples=["School of Computer Science"],
    )


class FacultyOut(FacultyBase):
    """Output schema for Faculty with identifier and aggregate counters."""

    id: int = Field(
        ...,
        description="Unique identifier of the faculty.",
        examples=[5],
    )
    directions_count: int = Field(
        ...,
        description="Number of academic directions/programs under this faculty.",
        examples=[7],
    )


class FacultyFilters(BaseFilterParams):
    """Filtering parameters for Faculty listings (reserved for future filters)."""

    pass


class FacultyQueryParams(BaseQueryParams, FacultyFilters):
    """Query parameters combining pagination/sorting with Faculty filters."""

    pass
