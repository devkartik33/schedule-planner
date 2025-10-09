from fastapi import Depends, status, APIRouter, Query
from sqlalchemy.orm import Session
from typing import Annotated

from ..dependencies import get_db, RoleChecker
from ..schemas.group import (
    GroupIn,
    GroupOut,
    GroupUpdate,
    GroupQueryParams,
)
from ..schemas.shared import PaginatedResponse
from ..services import GroupService
from ..utils.enums import UserRoleEnum

# Router: Student groups CRUD and listing
group_router = APIRouter(prefix="/api/group", tags=["Groups"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@group_router.get(
    "/",
    response_model=PaginatedResponse[GroupOut],
    summary="List groups",
    description="Return a paginated list of groups. Supports pagination, sorting, and filters (faculty, direction, study form, academic year, period, semester, q).",
)
async def get_groups(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[GroupQueryParams, Query()],
):
    return GroupService(db).get_paginated(query_params)


@group_router.get(
    "/{group_id}",
    response_model=GroupOut,
    summary="Get group by ID",
    description="Retrieve a single group by its unique identifier with related mini resources.",
)
async def get_group_by_id(*, group_id: int, db: Session = Depends(get_db)):
    return GroupService(db).get_by_id(group_id)


@group_router.post(
    "/",
    response_model=GroupOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a group",
    description="Create a new group under a specific semester and study form. Only Admin/Coordinator roles are allowed.",
)
async def create_group(group: GroupIn, db: Session = Depends(get_db)):
    return GroupService(db).create(group)


@group_router.patch(
    "/{group_id}",
    response_model=GroupOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a group",
    description="Apply a partial update to a group by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_group(group_id: int, group: GroupUpdate, db: Session = Depends(get_db)):
    return GroupService(db).update(group_id, group)


@group_router.put(
    "/{group_id}",
    response_model=GroupOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a group",
    description="Replace all fields of a group by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_group(group_id: int, group: GroupIn, db: Session = Depends(get_db)):
    return GroupService(db).update(group_id, group)


@group_router.delete(
    "/{group_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a group",
    description="Delete a group by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_group(group_id: int, db: Session = Depends(get_db)):
    return GroupService(db).delete(group_id)
