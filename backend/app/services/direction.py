from sqlalchemy.orm import Session

from ..repositories import DirectionRepository, StudyFormRepository
from ..models import Direction
from ..models.study_form import StudyForm
from ..schemas.direction import DirectionIn
from ..schemas.study_form import StudyFormIn
from ..utils.enums import StudyFormEnum
from .base import BaseService


class DirectionService(BaseService[Direction, DirectionIn]):
    """
    Service layer for Direction domain logic.

    Responsibilities:
    - Create directions and, based on flags, provision default study forms.
    - Apply common list filters (search, faculty, study form).
    - Delegate persistence to DirectionRepository and related repositories.
    """

    def __init__(self, db: Session):
        """
        Initialize the Direction service.

        Args:
            db (Session): Active SQLAlchemy session.

        Returns:
            None
        """
        super().__init__(db, Direction, DirectionRepository(db))

    def create(self, direction: DirectionIn) -> Direction:
        """
        Create a new direction and provision its study forms.

        Behavior:
        - Excludes study-form flags from the payload used to persist the direction.
        - Creates FULL_TIME and/or PART_TIME study forms according to flags.

        Args:
            direction (DirectionIn): Input payload including has_full_time/has_part_time flags.

        Returns:
            Direction: Newly created direction entity.
        """
        # Exclude study-form flags from the model payload used to insert Direction
        direction_data = direction.model_dump(
            exclude=[StudyFormEnum.full_time.value, StudyFormEnum.part_time.value]
        )

        new_direction = DirectionIn(**direction_data)
        created_direction = super().create(new_direction)

        # Create study forms according to the provided flags
        study_form_repo = StudyFormRepository(self.db)
        new_study_form = StudyFormIn(
            direction_id=created_direction.id, form=StudyFormEnum.full_time.value
        )

        if direction.has_full_time:
            study_form_repo.create(new_study_form.model_dump())

        if direction.has_part_time:
            new_study_form.form = StudyFormEnum.part_time.value
            study_form_repo.create(new_study_form.model_dump())

        return created_direction

    def apply_filters(self, query, params):
        """
        Apply filters to the directions query.

        Supported filters:
        - q: case-insensitive substring search by direction name.
        - faculty_ids: filter by owning faculty IDs.
        - study_forms: filter directions that have any of the given study forms.

        Args:
            query: SQLAlchemy query object for Direction.
            params: Combined query/filter params (DirectionQueryParams).

        Returns:
            The filtered SQLAlchemy query.
        """
        if params.q:
            query_string = params.q.strip()
            query = query.filter(Direction.name.ilike(f"%{query_string}%"))
        if params.faculty_ids:
            query = query.filter(Direction.faculty_id.in_(params.faculty_ids))
        if params.study_forms:
            query = query.filter(
                Direction.study_forms.any(StudyForm.form.in_(params.study_forms))
            )
        return super().apply_filters(query, params)
