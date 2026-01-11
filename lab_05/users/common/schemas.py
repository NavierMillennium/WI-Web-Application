from pydantic import (
    BaseModel,
    Field
)


class MessageModel(BaseModel):
    """
        Standart response message model 
    """
    detail: str | None = Field(None, description="response details")