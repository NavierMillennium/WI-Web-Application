from typing import Final
from .schemas import MessageModel


DEFAULT_ENDPOINT_RESPONSES: Final= {
    400: {"model": MessageModel, "description": "Bad Request"},
    401: {"model": MessageModel, "description": "Unauthorized"},
    403: {"model": MessageModel, "description": "Forbidden"},
    422: {"model": MessageModel, "description": "Input invalid values"}
}

MAX_PAGINATION: Final[int] = 10_000