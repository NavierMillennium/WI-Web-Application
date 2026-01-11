from uuid import UUID
from pydantic import (
    BaseModel,
    Field
)


class MessageModel(BaseModel):
    """
        Standart response message model 
    """
    detail: str | None = Field(None, description="response details")


class AuthJWTPayload(BaseModel):
    sub: str
    user_id: int
    refresh: bool = Field(False)
    jti: str|UUID