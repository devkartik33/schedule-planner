from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from ..repositories import SubjectAssignmentRepository
from ..models import SubjectAssignment, ProfessorWorkload
from ..schemas.subject_assignment import SubjectAssignmentIn, SubjectAssignmentUpdate
from .base import BaseService


class SubjectAssignmentService(BaseService[SubjectAssignment, SubjectAssignmentIn]):
    """
    Service layer for SubjectAssignment domain logic.

    Responsibilities:
    - Create/update subject assignments while enforcing uniqueness and hour limits.
    - Provide list filtering capabilities.
    - Delegate persistence to SubjectAssignmentRepository via BaseService.
    """

    def __init__(self, db: Session):
        """
        Initialize the SubjectAssignment service.

        Args:
            db (Session): Active SQLAlchemy session.
        """
        super().__init__(db, SubjectAssignment, SubjectAssignmentRepository(db))

    def check_assigned_hours(
        self,
        subject_assignment: SubjectAssignmentIn | SubjectAssignmentUpdate,
        subject_assignment_id: int | None = None,
    ) -> None:
        """
        Validate that hours_per_subject will not exceed the workload's allocated hours.

        For updates, the remaining capacity is computed as:
        workload.assigned_hours - (workload.total_assignment_hours - current_assignment.hours_per_subject)

        Args:
            subject_assignment (SubjectAssignmentIn | SubjectAssignmentUpdate): Payload with hours_per_subject.
            subject_assignment_id (int | None): Existing assignment ID to adjust remaining capacity (for updates).

        Raises:
            HTTPException: 400 if hours_per_subject would exceed workload.assigned_hours.
        """

        workload = None
        total_assigned_hours = None

        if subject_assignment_id:
            found_subject_assignment = self.repo.get(subject_assignment_id)
            workload = found_subject_assignment.workload
            total_assigned_hours = (
                workload.total_assignment_hours
                - found_subject_assignment.hours_per_subject
            )
        else:
            workload = (
                self.db.query(ProfessorWorkload)
                .filter(ProfessorWorkload.id == subject_assignment.workload_id)
                .first()
            )
            total_assigned_hours = workload.total_assignment_hours

        if (
            workload
            and workload.assigned_hours
            < total_assigned_hours + subject_assignment.hours_per_subject
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned hours exceed the total hours allowed by the workload.",
            )

    def create(self, subject_assignment: SubjectAssignmentIn) -> SubjectAssignment:
        """
        Create a new subject assignment after validation.

        Validations:
        - Enforce uniqueness per (subject_id, workload_id).
        - Ensure hours_per_subject fits within the parent workload's assigned_hours.

        Args:
            subject_assignment (SubjectAssignmentIn): Input data for the new assignment.

        Returns:
            SubjectAssignment: The newly created assignment.

        Raises:
            HTTPException: 400 if a duplicate exists or hours exceed workload capacity.
        """

        found_assignment = (
            self.db.query(SubjectAssignment)
            .filter(
                SubjectAssignment.subject_id == subject_assignment.subject_id,
                SubjectAssignment.workload_id == subject_assignment.workload_id,
            )
            .first()
        )

        if found_assignment:
            # If an assignment already exists, raise an exception
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assignment for this subject and workload already exists.",
            )

        self.check_assigned_hours(subject_assignment)

        return super().create(subject_assignment)

    def update(
        self, subject_assignment_id: int, subject_assignment: SubjectAssignmentUpdate
    ) -> SubjectAssignment:
        """
        Update an existing subject assignment after validation.

        Args:
            subject_assignment_id (int): Identifier of the assignment to update.
            subject_assignment (SubjectAssignmentUpdate): Partial update payload.

        Returns:
            SubjectAssignment: The updated assignment instance.

        Raises:
            HTTPException: 400 if hours would exceed workload capacity.
        """

        self.check_assigned_hours(subject_assignment, subject_assignment_id)

        return super().update(subject_assignment_id, subject_assignment)

    def apply_filters(self, query, params):
        """
        Apply filters to the subject assignments query.

        Supported filters:
        - workload_id: filter by parent workload.
        - schedule_id: currently filters by workload.contract.semester_id; adjust as needed
          if the intent is to filter by lessons bound to a specific schedule.

        Args:
            query: SQLAlchemy query for SubjectAssignment.
            params: Combined query/filter params.

        Returns:
            The filtered SQLAlchemy query.
        """

        if params.workload_id is not None:
            query = query.filter(SubjectAssignment.workload_id == params.workload_id)

        if params.schedule_id is not None:
            # Note: This uses schedule_id param to filter on semester_id via contract.
            # If the intent is to filter by a real schedule, consider joining lessons/schedule instead.
            query = (
                query.join(SubjectAssignment.workload)
                .join(ProfessorWorkload.contract)
                .filter(ProfessorWorkload.contract.has(semester_id=params.schedule_id))
            )
        return query
