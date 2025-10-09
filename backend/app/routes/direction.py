from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Annotated

from ..dependencies import get_db, RoleChecker
from ..schemas.direction import (
    DirectionIn,
    DirectionOut,
    DirectionUpdate,
    DirectionQueryParams,
)
from ..schemas.shared import PaginatedResponse
from ..services import DirectionService
from ..utils.enums import UserRoleEnum

# Router: Academic directions/programs CRUD and listing
direction_router = APIRouter(prefix="/api/direction", tags=["Directions"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@direction_router.get(
    "/",
    response_model=PaginatedResponse[DirectionOut],
    summary="List directions",
    description="Return a paginated list of directions. Supports pagination, sorting, and filters (faculty, study_forms, q).",
)
async def get_directions(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[DirectionQueryParams, Query()],
):
    return DirectionService(db).get_paginated(query_params)


@direction_router.get(
    "/{direction_id}",
    response_model=DirectionOut,
    summary="Get direction by ID",
    description="Retrieve a single academic direction by its unique identifier.",
)
async def get_direction_by_id(*, direction_id: int, db: Session = Depends(get_db)):
    return DirectionService(db).get_by_id(direction_id)


@direction_router.post(
    "/",
    response_model=DirectionOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a direction",
    description="Create a new academic direction. Depending on flags, associated study forms (FULL_TIME/PART_TIME) are provisioned. Only Admin/Coordinator roles are allowed.",
)
async def create_direction(direction: DirectionIn, db: Session = Depends(get_db)):
    return DirectionService(db).create(direction)


@direction_router.patch(
    "/{direction_id}",
    response_model=DirectionOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a direction",
    description="Apply a partial update to an academic direction by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_direction(
    direction_id: int, direction: DirectionUpdate, db: Session = Depends(get_db)
):
    return DirectionService(db).update(direction_id, direction)


@direction_router.put(
    "/{direction_id}",
    response_model=DirectionOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a direction",
    description="Replace all fields of an academic direction by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_direction(
    direction_id: int, direction: DirectionIn, db: Session = Depends(get_db)
):
    return DirectionService(db).update(direction_id, direction)


@direction_router.delete(
    "/{direction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a direction",
    description="Delete an academic direction by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_direction(direction_id: int, db: Session = Depends(get_db)):
    return DirectionService(db).delete(direction_id)
