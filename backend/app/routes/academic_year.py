from fastapi import Depends, status, APIRouter, Query
from sqlalchemy.orm import Session

from ..dependencies import get_db, RoleChecker
from ..schemas.shared import PaginatedResponse
from ..schemas.academic_year import (
    AcademicYearIn,
    AcademicYearUpdate,
    AcademicYearOut,
    AcademicYearQueryParams,
)
from ..services import AcademicYearService
from ..utils.enums import UserRoleEnum
from typing import Annotated

# Router: Academic Years CRUD and listing
# Group of endpoints to manage academic year resources and the "current" flag.
academic_year_router = APIRouter(prefix="/api/academic_year", tags=["Academic Years"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@academic_year_router.get(
    "/",
    response_model=PaginatedResponse[AcademicYearOut],
    summary="List academic years",
    description="Return a paginated list of academic years. Supports pagination, sorting, and filtering via AcademicYearQueryParams.",
)
async def get_academic_years(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[AcademicYearQueryParams, Query()],
):
    """Retrieve a paginated list of academic years."""
    return AcademicYearService(db).get_paginated(query_params)


@academic_year_router.get(
    "/{academic_year_id}",
    response_model=AcademicYearOut,
    summary="Get academic year by ID",
    description="Retrieve a single academic year by its unique identifier.",
)
async def get_academic_year_by_id(
    *, academic_year_id: int, db: Session = Depends(get_db)
):
    """Retrieve an academic year by its ID."""
    return AcademicYearService(db).get_by_id(academic_year_id)


@academic_year_router.post(
    "/",
    response_model=AcademicYearOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create an academic year",
    description="Create a new academic year. Only Admin/Coordinator roles are allowed. If is_current is set, it becomes the sole current year.",
)
async def create_academic_year(
    academic_year: AcademicYearIn, db: Session = Depends(get_db)
):
    """Create a new academic year."""
    return AcademicYearService(db).create(academic_year)


@academic_year_router.put(
    "/{academic_year_id}",
    response_model=AcademicYearOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace an academic year",
    description="Replace all fields of an existing academic year by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_academic_year(
    academic_year_id: int, academic_year: AcademicYearIn, db: Session = Depends(get_db)
):
    """Replace an academic year by its ID."""
    return AcademicYearService(db).update(academic_year_id, academic_year)


@academic_year_router.patch(
    "/{academic_year_id}",
    response_model=AcademicYearOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update an academic year",
    description="Apply a partial update to an academic year by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_academic_year(
    academic_year_id: int,
    academic_year: AcademicYearUpdate,
    db: Session = Depends(get_db),
):
    """Partially update an academic year by its ID."""
    return AcademicYearService(db).update(academic_year_id, academic_year)


@academic_year_router.delete(
    "/{academic_year_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete an academic year",
    description="Delete an academic year by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_academic_year(academic_year_id: int, db: Session = Depends(get_db)):
    """Delete an academic year by its ID."""
    return AcademicYearService(db).delete(academic_year_id)
