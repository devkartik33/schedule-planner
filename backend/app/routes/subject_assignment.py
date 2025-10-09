from typing import Annotated
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.dependencies import get_db, RoleChecker
from app.services.subject_assignment import SubjectAssignmentService
from app.schemas.subject_assignment import (
    SubjectAssignmentOut,
    SubjectAssignmentIn,
    SubjectAssignmentUpdate,
    SubjectAssignmentQueryParams,
)
from app.schemas.shared import PaginatedResponse
from app.utils.enums import UserRoleEnum

# Router: Subject assignments CRUD and listing
subject_assignment_router = APIRouter(
    prefix="/api/subject_assignment", tags=["Subject Assignments"]
)

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@subject_assignment_router.get(
    "/",
    response_model=PaginatedResponse[SubjectAssignmentOut],
    summary="List subject assignments",
    description=(
        "Return a paginated list of subject assignments. Supports pagination, sorting, and filters "
        "(workload_id and schedule_id). Note: schedule_id filtering is implemented in the service via "
        "workload.contract.semester."
    ),
)
async def get_subject_assignments(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[SubjectAssignmentQueryParams, Query()],
):
    """Retrieve subject assignments with pagination and filtering."""
    return SubjectAssignmentService(db).get_paginated(query_params)


@subject_assignment_router.post(
    "/",
    response_model=SubjectAssignmentOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a subject assignment",
    description=(
        "Create a new subject assignment linking a subject to a professor workload. "
        "Enforces uniqueness per (subject_id, workload_id) and validates allocated hours. "
        "Only Admin/Coordinator roles are allowed."
    ),
)
async def create_subject_assignment(
    *, subject_assignment: SubjectAssignmentIn, db: Session = Depends(get_db)
):
    """Create a subject assignment."""
    return SubjectAssignmentService(db).create(subject_assignment)


@subject_assignment_router.get(
    "/{subject_assignment_id}",
    response_model=SubjectAssignmentOut,
    summary="Get subject assignment by ID",
    description="Retrieve a single subject assignment by its unique identifier.",
)
async def get_subject_assignment(
    *, subject_assignment_id: int, db: Session = Depends(get_db)
):
    """Get a subject assignment by its ID."""
    return SubjectAssignmentService(db).get_by_id(subject_assignment_id)


@subject_assignment_router.put(
    "/{subject_assignment_id}",
    response_model=SubjectAssignmentOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a subject assignment",
    description=(
        "Replace all fields of an existing subject assignment by ID. "
        "Validates hour limits and uniqueness. Only Admin/Coordinator roles are allowed."
    ),
)
async def update_subject_assignment(
    subject_assignment_id: int,
    subject_assignment: SubjectAssignmentUpdate,
    db: Session = Depends(get_db),
):
    """Replace a subject assignment."""
    return SubjectAssignmentService(db).update(
        subject_assignment_id, subject_assignment
    )


@subject_assignment_router.patch(
    "/{subject_assignment_id}",
    response_model=SubjectAssignmentOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a subject assignment",
    description=(
        "Apply a partial update to an existing subject assignment by ID. "
        "Validates hour limits and uniqueness. Only Admin/Coordinator roles are allowed."
    ),
)
async def patch_subject_assignment(
    subject_assignment_id: int,
    subject_assignment: SubjectAssignmentUpdate,
    db: Session = Depends(get_db),
):
    """Partially update a subject assignment."""
    return SubjectAssignmentService(db).update(
        subject_assignment_id, subject_assignment
    )


@subject_assignment_router.delete(
    "/{subject_assignment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a subject assignment",
    description="Delete a subject assignment by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_subject_assignment(
    subject_assignment_id: int, db: Session = Depends(get_db)
):
    """Delete a subject assignment."""
    return SubjectAssignmentService(db).delete(subject_assignment_id)
