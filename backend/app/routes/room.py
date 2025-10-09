from fastapi import Depends, status, APIRouter, Query
from sqlalchemy.orm import Session
from typing import Annotated

from ..dependencies import get_db, RoleChecker
from ..schemas.room import (
    RoomIn,
    RoomOut,
    RoomUpdate,
    RoomQueryParams,
)
from ..schemas.shared import PaginatedResponse
from ..services import RoomService
from ..utils.enums import UserRoleEnum

# Router: Room resources and availability checks
room_router = APIRouter(prefix="/api/room", tags=["Rooms"])

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@room_router.get(
    "/",
    response_model=PaginatedResponse[RoomOut],
    summary="List rooms",
    description=(
        "Return a paginated list of rooms. Supports pagination, sorting, and filters: "
        "q (search by number), min_capacity, availability (available_date, available_start_time, "
        "available_end_time, exclude_lesson_id)."
    ),
)
async def get_rooms(
    *, db: Session = Depends(get_db), query_params: Annotated[RoomQueryParams, Query()]
):
    return RoomService(db).get_paginated(query_params)


@room_router.get(
    "/{room_id}",
    response_model=RoomOut,
    summary="Get room by ID",
    description="Retrieve a single room by its unique identifier.",
)
async def get_room_by_id(*, room_id: int, db: Session = Depends(get_db)):
    return RoomService(db).get_by_id(room_id)


@room_router.post(
    "/",
    response_model=RoomOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a room",
    description="Create a new room with number and capacity. Only Admin/Coordinator roles are allowed.",
)
async def create_room(room: RoomIn, db: Session = Depends(get_db)):
    return RoomService(db).create(room)


@room_router.put(
    "/{room_id}",
    response_model=RoomOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a room",
    description="Replace all fields of an existing room by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_room(room_id: int, room: RoomIn, db: Session = Depends(get_db)):
    return RoomService(db).update(room_id, room)


@room_router.patch(
    "/{room_id}",
    response_model=RoomOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a room",
    description="Apply a partial update to a room by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_room(room_id: int, room: RoomUpdate, db: Session = Depends(get_db)):
    return RoomService(db).update(room_id, room)


@room_router.delete(
    "/{room_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a room",
    description="Delete a room by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_room(room_id: int, db: Session = Depends(get_db)):
    return RoomService(db).delete(room_id)
