from sqlmodel import (
    SQLModel,
    Field,
    NVARCHAR
)


class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: int =  Field(
        nullable=False,
        primary_key=True,
        unique=True,
        index=True,
        sa_column_kwargs={"autoincrement": True},
        description="entity id"
    )
    email: str = Field(
        sa_type=NVARCHAR(512),
        description="user email address"
    )
    password: str = Field(
        exclude=True,
        description="password hash"
    )