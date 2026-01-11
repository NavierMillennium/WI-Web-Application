from sqlmodel import (
    SQLModel,
    Field,
    NVARCHAR
)


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: int =  Field(
        nullable=False,
        primary_key=True,
        unique=True,
        index=True,
        sa_column_kwargs={"autoincrement": True},
        description="entity id"
    )
    user_id: int = Field(
        description="user ID"
    )
    book_id: int = Field(
        description="book ID"
    )
    quantity: int = Field(
        description="book quantity"
    )