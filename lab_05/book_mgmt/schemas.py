from pydantic import (
    BaseModel,
    Field
)


class BookCreateModel(BaseModel):
    title: str = Field(max_length=500)
    author: str = Field(max_length=500)
    year: int = Field(gt=1970, lt=3000) 


class BookInfoRespModel(BaseModel):
    id: int
    title: str
    author: str
    year: int 


