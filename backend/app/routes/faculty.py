from fastapi import Depends, status, APIRouter, Query
from sqlalchemy.orm import Session

from ..dependencies import get_db, RoleChecker
from ..schemas.faculty import (
    FacultyIn,
    FacultyUpdate,
    FacultyOut,
    FacultyQueryParams,
)
from ..schemas.shared import PaginatedResponse
from ..services import FacultyService
from ..utils.enums import UserRoleEnum

from typing import Annotated

# Router: Faculty resources (schools/departments)
faculty_router = APIRouter(prefix="/api/faculty", tags=["Faculties"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@faculty_router.get(
    "/",
    response_model=PaginatedResponse[FacultyOut],
    summary="List faculties",
    description="Return a paginated list of faculties. Supports pagination, sorting, and free-text search via query params.",
)
async def get_faculties(
    *, db: Session = Depends(get_db), params: Annotated[FacultyQueryParams, Query()]
):
    return FacultyService(db).get_paginated(params)


@faculty_router.get(
    "/{faculty_id}",
    response_model=FacultyOut,
    summary="Get faculty by ID",
    description="Retrieve a single faculty by its unique identifier.",
)
async def get_faculty_by_id(*, faculty_id: int, db: Session = Depends(get_db)):
    return FacultyService(db).get_by_id(faculty_id)


@faculty_router.post(
    "/",
    response_model=FacultyOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a faculty",
    description="Create a new faculty. Only Admin/Coordinator roles are allowed.",
)
async def create_faculty(faculty: FacultyIn, db: Session = Depends(get_db)):
    return FacultyService(db).create(faculty)


@faculty_router.put(
    "/{faculty_id}",
    response_model=FacultyOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a faculty",
    description="Replace all fields of an existing faculty by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_faculty(
    faculty_id: int, faculty: FacultyIn, db: Session = Depends(get_db)
):
    return FacultyService(db).update(faculty_id, faculty)


@faculty_router.patch(
    "/{faculty_id}",
    response_model=FacultyOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a faculty",
    description="Apply a partial update to a faculty by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_faculty(
    faculty_id: int, faculty: FacultyUpdate, db: Session = Depends(get_db)
):
    return FacultyService(db).update(faculty_id, faculty)


@faculty_router.delete(
    "/{faculty_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a faculty",
    description="Delete a faculty by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_faculty(faculty_id: int, db: Session = Depends(get_db)):
    return FacultyService(db).delete(faculty_id)
