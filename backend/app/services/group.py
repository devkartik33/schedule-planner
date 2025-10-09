from sqlalchemy.orm import Session


from ..repositories import GroupRepository
from ..models import Group
from ..models.semester import Semester
from ..models.direction import Direction
from ..models.study_form import StudyForm
from ..schemas.group import GroupIn
from .base import BaseService


class GroupService(BaseService[Group, GroupIn]):
    """
    Service layer for Group domain logic.

    Responsibilities:
    - Provide listing with rich filtering across related entities (semester, academic year, direction, faculty, study form).
    - Delegate CRUD operations to GroupRepository via BaseService.
    """

    def __init__(self, db: Session):
        """
        Initialize the Group service.

        Args:
            db (Session): Active SQLAlchemy session.
        """
        super().__init__(db, Group, GroupRepository(db))

    def apply_filters(self, query, params):
        """
        Apply filters to the groups query, joining related entities as needed.

        Joins:
        - Group.semester -> AcademicYear for year-based filtering.
        - Group.study_form -> Direction -> Faculty for program/faculty filters.

        Supported filters on params:
        - q: case-insensitive substring search by group name.
        - academic_year_ids: filter by academic year IDs.
        - periods: filter by semester period enum values.
        - semester_ids: filter by semester IDs.
        - faculty_ids: filter by faculty IDs.
        - direction_ids: filter by direction IDs.
        - study_forms: filter by study form values (enum strings).

        Args:
            query: SQLAlchemy query object for Group.
            params: Combined query/filter params carrying the fields above.

        Returns:
            The filtered SQLAlchemy query.
        """
        # Join related tables once to enable filters across relationships; distinct avoids duplicates from joins
        query = (
            query.join(Group.semester)
            .join(Group.study_form)
            .join(Semester.academic_year)
            .join(StudyForm.direction)
            .join(Direction.faculty)
            .distinct()
        )

        # Free-text search by group name
        if params.q:
            query_string = params.q.strip()
            query = query.filter(Group.name.ilike(f"%{query_string}%"))

        # Filter by academic year
        if params.academic_year_ids:
            query = query.filter(
                Semester.academic_year_id.in_(params.academic_year_ids)
            )

        # Filter by semester period
        if params.periods:
            query = query.filter(Semester.period.in_(params.periods))

        # Filter by specific semesters
        if params.semester_ids:
            query = query.filter(Group.semester_id.in_(params.semester_ids))

        # Filter by faculty
        if params.faculty_ids:
            query = query.filter(Direction.faculty_id.in_(params.faculty_ids))

        # Filter by direction
        if params.direction_ids:
            query = query.filter(Direction.id.in_(params.direction_ids))

        # Filter by study forms
        # Note: params.study_forms contains enum values (strings) in GroupFilters.
        # The use of params.study_form_ids below suggests a possible mismatch; kept as-is.
        if params.study_forms:
            query = query.filter(Group.study_form_id.in_(params.study_form_ids))

        return super().apply_filters(query, params)
