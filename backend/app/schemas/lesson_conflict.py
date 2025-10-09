from pydantic import BaseModel, Field
from datetime import date as date_type
from typing import Optional, List, Dict
from .shared import BasePaginationParams
from .lesson import LessonOut


class ConflictOut(BaseModel):
    """
    Represents a single detected scheduling conflict instance.
    Contains conflict metadata and the list of involved lessons.
    """

    type: str = Field(
        ...,
        description='Conflict type. One of: "room", "professor", "group".',
        examples=["room"],
    )
    message: str = Field(
        ...,
        description="Human-readable description of the conflict.",
        examples=["Room 101 is double-booked between 10:00 and 11:30."],
    )
    severity: str = Field(
        ...,
        description='Severity level of the conflict. One of: "error", "warning".',
        examples=["error"],
    )
    lessons: List[LessonOut] = Field(
        ...,
        description="Lessons involved in this conflict.",
        examples=[
            [
                {
                    "id": 1,
                    "date": "2024-10-01",
                    "start_time": "10:00:00",
                    "end_time": "11:30:00",
                },
                {
                    "id": 2,
                    "date": "2024-10-01",
                    "start_time": "10:00:00",
                    "end_time": "11:30:00",
                },
            ]
        ],
    )


class ConflictGroupOut(BaseModel):
    """
    Group of conflicts of the same type and scope.
    Scope indicates whether the conflict is isolated to an entity (single) or shared.
    """

    type: str = Field(
        ...,
        description='Conflict type for this group. One of: "room", "professor", "group".',
        examples=["professor"],
    )
    conflict_scope: str = Field(
        ...,
        description='Scope of the conflict. One of: "single" or "shared".',
        examples=["single"],
    )
    conflicts: List[ConflictOut] = Field(
        ...,
        description="List of conflict items in this group.",
        examples=[
            [
                {
                    "type": "professor",
                    "message": "Professor is scheduled for two lessons at the same time.",
                    "severity": "error",
                    "lessons": [{"id": 12}, {"id": 18}],
                }
            ]
        ],
    )
    count: int = Field(
        ...,
        description="Total number of conflicts in this group.",
        examples=[3],
    )


class ConflictsSummaryOut(BaseModel):
    """
    Summary of conflicts grouped by scope and overall counters.
    Provides quick totals for single and shared conflicts.
    """

    single: List[ConflictGroupOut] = Field(
        default_factory=list,
        description='List of conflict groups with scope "single".',
        examples=[
            [{"type": "room", "conflict_scope": "single", "conflicts": [], "count": 2}]
        ],
    )
    shared: List[ConflictGroupOut] = Field(
        default_factory=list,
        description='List of conflict groups with scope "shared".',
        examples=[
            [{"type": "group", "conflict_scope": "shared", "conflicts": [], "count": 1}]
        ],
    )
    total_single: int = Field(
        default=0,
        description="Total number of single-scope conflicts.",
        examples=[2],
    )
    total_shared: int = Field(
        default=0,
        description="Total number of shared-scope conflicts.",
        examples=[1],
    )
    total_conflicts: int = Field(
        default=0,
        description="Total number of detected conflicts across all scopes.",
        examples=[3],
    )


class ConflictFilterParams(BaseModel):
    """
    Filtering parameters for retrieving conflicts.
    Combine different filters to narrow down conflict results.
    """

    schedule_id: Optional[int] = Field(
        default=None,
        description="Filter conflicts for a specific schedule ID.",
        examples=[5],
    )
    date: Optional[date_type] = Field(
        default=None,
        description="Filter conflicts for a specific date (YYYY-MM-DD).",
        examples=["2024-10-01"],
    )
    date_from: Optional[date_type] = Field(
        default=None,
        description="Inclusive start date for conflict filtering (YYYY-MM-DD).",
        examples=["2024-10-01"],
    )
    date_to: Optional[date_type] = Field(
        default=None,
        description="Inclusive end date for conflict filtering (YYYY-MM-DD).",
        examples=["2024-10-31"],
    )
    conflict_types: Optional[List[str]] = Field(
        default=None,
        description='Filter by conflict types (e.g., ["room", "professor", "group"]).',
        examples=[["room", "group"]],
    )
    severity: Optional[str] = Field(
        default=None,
        description='Filter by severity. One of: "error", "warning".',
        examples=["error"],
    )


class ConflictQueryParams(ConflictFilterParams):
    """
    Query parameters for conflict listing (alias of ConflictFilterParams).
    """

    pass
