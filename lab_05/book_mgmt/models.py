from sqlmodel import (
    SQLModel,
    Field,
    NVARCHAR
)


class Book(SQLModel, table=True):
    __tablename__ = "books"

    id: int =  Field(
        nullable=False,
        primary_key=True,
        unique=True,
        index=True,
        sa_column_kwargs={"autoincrement": True},
        description="entity id"
    )
    title: str = Field(
        sa_type=NVARCHAR(512),
        description="book title"
    )
    author: str = Field(
        sa_type=NVARCHAR(512),
        description="book author"
    )
    year: int = Field(
        description="book release year"
    )