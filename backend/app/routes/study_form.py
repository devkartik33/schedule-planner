from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Annotated

from ..dependencies import get_db, RoleChecker
from ..schemas.study_form import (
    StudyFormIn,
    StudyFormOut,
    StudyFormUpdate,
    StudyFormQueryParams,
)
from ..schemas.shared import PaginatedResponse
from ..services import StudyFormService
from ..utils.enums import UserRoleEnum

# Router: Study forms (e.g., FULL_TIME, PART_TIME) CRUD and listing
study_form_router = APIRouter(prefix="/api/study_form", tags=["Study Forms"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@study_form_router.get(
    "/",
    response_model=PaginatedResponse[StudyFormOut],
    summary="List study forms",
    description=(
        "Return a paginated list of study forms. Supports pagination, sorting, and a custom sort field "
        "direction_name (sorts by related Direction name)."
    ),
)
async def get_study_forms(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[StudyFormQueryParams, Query()],
):
    """Retrieve paginated study forms."""
    return StudyFormService(db).get_paginated(query_params)


@study_form_router.get(
    "/{study_form_id}",
    response_model=StudyFormOut,
    summary="Get study form by ID",
    description="Retrieve a single study form by its unique identifier.",
)
async def get_study_form_by_id(*, study_form_id: int, db: Session = Depends(get_db)):
    """Get a study form by its ID."""
    return StudyFormService(db).get_by_id(study_form_id)


@study_form_router.post(
    "/",
    response_model=StudyFormOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a study form",
    description="Create a new study form under a specific direction. Only Admin/Coordinator roles are allowed.",
)
async def create_study_form(study_form: StudyFormIn, db: Session = Depends(get_db)):
    """Create a new study form."""
    return StudyFormService(db).create(study_form)


@study_form_router.patch(
    "/{study_form_id}",
    response_model=StudyFormOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a study form",
    description="Apply a partial update to a study form by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_study_form(
    study_form_id: int, study_form: StudyFormUpdate, db: Session = Depends(get_db)
):
    """Partially update a study form."""
    return StudyFormService(db).update(study_form_id, study_form)


@study_form_router.put(
    "/{study_form_id}",
    response_model=StudyFormOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a study form",
    description="Replace all fields of an existing study form by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_study_form(
    study_form_id: int, study_form: StudyFormIn, db: Session = Depends(get_db)
):
    """Replace a study form by its ID."""
    return StudyFormService(db).update(study_form_id, study_form)


@study_form_router.delete(
    "/{study_form_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a study form",
    description="Delete a study form by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_study_form(study_form_id: int, db: Session = Depends(get_db)):
    """Delete a study form by its ID."""
    return StudyFormService(db).delete(study_form_id)
