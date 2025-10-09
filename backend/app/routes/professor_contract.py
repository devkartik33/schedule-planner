from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Annotated

from ..dependencies import get_db, RoleChecker
from ..schemas.professor_contract import (
    ProfessorContractIn,
    ProfessorContractOut,
    ProfessorContractUpdate,
    ProfessorContractQueryParams,
)
from ..schemas.shared import PaginatedResponse
from ..services import ProfessorContractService
from ..utils.enums import UserRoleEnum

# Router: Professor contracts CRUD and listing
professor_contract_router = APIRouter(
    prefix="/api/professor_contract", tags=["Professor Contracts"]
)

admin_coordinator_only = RoleChecker([UserRoleEnum.admin, UserRoleEnum.coordinator])


@professor_contract_router.get(
    "/",
    response_model=PaginatedResponse[ProfessorContractOut],
    summary="List professor contracts",
    description="Return a paginated list of professor contracts. Supports pagination, sorting, and filters (academic year, period, semester, q).",
)
async def get_professor_contracts(
    *,
    db: Session = Depends(get_db),
    query_params: Annotated[ProfessorContractQueryParams, Query()],
):
    return ProfessorContractService(db).get_paginated(query_params)


@professor_contract_router.get(
    "/{professor_contract_id}",
    response_model=ProfessorContractOut,
    summary="Get professor contract by ID",
    description="Retrieve a single professor contract by its unique identifier.",
)
async def get_professor_contract_by_id(
    *, professor_contract_id: int, db: Session = Depends(get_db)
):
    return ProfessorContractService(db).get_by_id(professor_contract_id)


@professor_contract_router.post(
    "/",
    response_model=ProfessorContractOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Create a professor contract",
    description="Create a new professor contract for a semester. Only Admin/Coordinator roles are allowed.",
)
async def create_professor_contract(
    professor_contract: ProfessorContractIn, db: Session = Depends(get_db)
):
    return ProfessorContractService(db).create(professor_contract)


@professor_contract_router.patch(
    "/{professor_contract_id}",
    response_model=ProfessorContractOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Partially update a professor contract",
    description="Apply a partial update to an existing professor contract by ID. Only Admin/Coordinator roles are allowed.",
)
async def patch_professor_contract(
    professor_contract_id: int,
    professor_contract: ProfessorContractUpdate,
    db: Session = Depends(get_db),
):
    return ProfessorContractService(db).update(
        professor_contract_id, professor_contract
    )


@professor_contract_router.put(
    "/{professor_contract_id}",
    response_model=ProfessorContractOut,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Replace a professor contract",
    description="Replace all fields of an existing professor contract by ID. Only Admin/Coordinator roles are allowed.",
)
async def update_professor_contract(
    professor_contract_id: int,
    professor_contract: ProfessorContractIn,
    db: Session = Depends(get_db),
):
    return ProfessorContractService(db).update(
        professor_contract_id, professor_contract
    )


@professor_contract_router.delete(
    "/{professor_contract_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_coordinator_only)],
    summary="Delete a professor contract",
    description="Delete a professor contract by ID. Only Admin/Coordinator roles are allowed. Returns 204 No Content on success.",
)
async def delete_professor_contract(
    professor_contract_id: int, db: Session = Depends(get_db)
):
    return ProfessorContractService(db).delete(professor_contract_id)
