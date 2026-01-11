from schemas import (
    BookInfoRespModel,
    BookCreateModel
)
from models import Book
from common.security import jwt_auth_depend
from common.constants import (
    DEFAULT_ENDPOINT_RESPONSES,
    MAX_PAGINATION
)
from common.dependencies import (
    get_async_db,
    AsyncSession
)
from fastapi import (
    APIRouter,
    Depends,
    Body,
    Query,
    Path,
    HTTPException,
    status
)
from sqlmodel import (
    select,
    delete
)

router = APIRouter(prefix="/books")


@router.get("/",
            summary="Search Books",
            status_code=status.HTTP_200_OK,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                200: {"model": list[BookInfoRespModel], "description": "OK"}
            })
async def get_book(
    limit: int = Query(50, ge=0, lt=MAX_PAGINATION, description="Pagination limit"),
    offset: int = Query(0, ge=0, lt=MAX_PAGINATION, description="Pagination offset"),
    db: AsyncSession = Depends(get_async_db)
) -> list[BookInfoRespModel]:

    stmt = select(Book)\
        .offset(offset)\
        .limit(limit)

    result = await db.exec(stmt)
    return result.all()


@router.get("/{book_id}",
            summary="Search Book by ID",
            status_code=status.HTTP_200_OK,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                200: {"model": BookInfoRespModel, "description": "OK"}
            })
async def get_book_by_id(
    book_id: int = Path(..., description="Book ID in the app database"),
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.get(Book, book_id)
    if result is None:
        raise HTTPException(status_code=404)
    
    return result


@router.post("/",
            summary="Search User",
            status_code=status.HTTP_201_CREATED,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                201: {"model": Book, "description": "OK"}
            })
async def add_book(
    book_data: BookCreateModel  = Body(..., description="Book creation data"),
    session: AsyncSession = Depends(get_async_db),
    _ = Depends(jwt_auth_depend)
):
    orm_book = Book(**book_data.model_dump())
    session.add(
        orm_book
    )
    
    await session.commit()
    return orm_book


@router.delete("/{book_id}",
            summary="Delete Book by ID",
            status_code=status.HTTP_200_OK,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                200: {"model": BookInfoRespModel, "description": "OK"}
            })
async def delete_book_by_id(
    book_id: int = Path(..., description="Book ID in the app database"),
    session: AsyncSession = Depends(get_async_db),
    _ = Depends(jwt_auth_depend)
):
    stmt = delete(Book).where(Book.id == book_id) 
    result = await session.exec(stmt)

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="The indicated order not found.")

    await session.commit()
    
    return {
        "detail": f"Book: '{book_id}' deleted successfully."
    } 



# @router.post("/init_db/",
#             summary="Delete Book by ID",
#             status_code=status.HTTP_200_OK,
#             responses=DEFAULT_ENDPOINT_RESPONSES | {
#                 200: {"model": BookInfoRespModel, "description": "OK"}
#             })
# async def init_db(
# ):
#     from core.db import init_db
#     await init_db()