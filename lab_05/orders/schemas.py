from common.constants import MAX_INT_VALUE
from pydantic import (
    BaseModel,
    Field
)


class OrderCreateModel(BaseModel):
    book_id: int = Field(ge=0, lt=MAX_INT_VALUE)
    quantity: int = Field(ge=0, lt=MAX_INT_VALUE) 


class OrdersInfoRespModel(BaseModel):
    id: int
    user_id: int
    book_id: int
    quantity: int 



