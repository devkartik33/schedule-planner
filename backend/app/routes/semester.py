from fastapi import Depends, status, APIRouter, Query
from sqlalchemy.orm import Session

from ..dependencies import get_db, RoleChecker
from ..schemas.shared import PaginatedResponse
from ..schemas.semester import (
    SemesterIn,
    SemesterUpdate,
    SemesterOut,
    SemesterQueryParams,
)
from ..services import SemesterService
from ..utils.enums import UserRoleEnum
from typing import Annotated

# Router: Semesters CRUD and listing
semester_router = APIRouter(prefix="/api/semester", tags=["Semesters"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@semester_router.get(
    "/",
    response_model=PaginatedResponse[SemesterOut],
    summary="List semesters",
    description="Return a paginated list of semesters. Supports pagination, sorting, and filters (academic_year_ids, periods, numbers, is_current).",
)
async def get_semesters(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[SemesterQueryParams, Query()],
):
    return SemesterService(db).get_paginated(query_params)


@semester_router.get(
    "/{semester_id}",
    response_model=SemesterOut,
    summary="Get semester by ID",
    description="Retrieve a single semester by its unique identifier.",
)
async def get_semester_by_id(*, semester_id: int, db: Session = Depends(get_db)):
    return SemesterService(db).get_by_id(semester_id)


@semester_router.post(
    "/",
    response_model=SemesterOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a semester",
    description="Create a new semester under a specific academic year and period. Only Admin/Coordinator roles are allowed.",
)
async def create_semester(semester: SemesterIn, db: Session = Depends(get_db)):
    return SemesterService(db).create(semester)


@semester_router.put(
    "/{semester_id}",
    response_model=SemesterOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a semester",
    description="Replace all fields of an existing semester by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_semester(
    semester_id: int, semester: SemesterIn, db: Session = Depends(get_db)
):
    return SemesterService(db).update(semester_id, semester)


@semester_router.patch(
    "/{semester_id}",
    response_model=SemesterOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a semester",
    description="Apply a partial update to a semester by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_semester(
    semester_id: int, semester: SemesterUpdate, db: Session = Depends(get_db)
):
    return SemesterService(db).update(semester_id, semester)


@semester_router.delete(
    "/{semester_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a semester",
    description="Delete a semester by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_semester(semester_id: int, db: Session = Depends(get_db)):
    return SemesterService(db).delete(semester_id)
