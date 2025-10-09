from .base import BaseRepository
from ..models.group import Group


class GroupRepository(BaseRepository):
    model = Group
