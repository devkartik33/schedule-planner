from fastapi import Depends, status, APIRouter, Query
from sqlalchemy.orm import Session

from ..dependencies import get_db, RoleChecker
from ..schemas.shared import PaginatedResponse
from ..schemas.subject import SubjectIn, SubjectUpdate, SubjectOut, SubjectQueryParams
from ..services import SubjectService
from ..utils.enums import UserRoleEnum
from typing import Annotated

# Router: Subjects CRUD and listing
subject_router = APIRouter(prefix="/api/subject", tags=["Subjects"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@subject_router.get(
    "/",
    response_model=PaginatedResponse[SubjectOut],
    summary="List subjects",
    description="Return a paginated list of subjects. Supports pagination, sorting, and filters (academic year, period, semester, faculty, direction, q).",
)
async def get_subjects(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[SubjectQueryParams, Query()],
):
    return SubjectService(db).get_paginated(query_params)


@subject_router.get(
    "/{subject_id}",
    response_model=SubjectOut,
    summary="Get subject by ID",
    description="Retrieve a single subject by its unique identifier, including related mini resources.",
)
async def get_subject_by_id(*, subject_id: int, db: Session = Depends(get_db)):
    return SubjectService(db).get_by_id(subject_id)


@subject_router.post(
    "/",
    response_model=SubjectOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a subject",
    description="Create a new subject under a specific direction and semester. Only Admin/Coordinator roles are allowed.",
)
async def create_subject(subject: SubjectIn, db: Session = Depends(get_db)):
    return SubjectService(db).create(subject)


@subject_router.put(
    "/{subject_id}",
    response_model=SubjectOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a subject",
    description="Replace all fields of an existing subject by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_subject(
    subject_id: int, subject: SubjectIn, db: Session = Depends(get_db)
):
    return SubjectService(db).update(subject_id, subject)


@subject_router.patch(
    "/{subject_id}",
    response_model=SubjectOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a subject",
    description="Apply a partial update to an existing subject by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_subject(
    subject_id: int, subject: SubjectUpdate, db: Session = Depends(get_db)
):
    return SubjectService(db).update(subject_id, subject)


@subject_router.delete(
    "/{subject_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a subject",
    description="Delete a subject by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_subject(subject_id: int, db: Session = Depends(get_db)):
    return SubjectService(db).delete(subject_id)
