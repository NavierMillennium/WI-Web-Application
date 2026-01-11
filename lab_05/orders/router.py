import httpx
from core.config import settings
from schemas import (
    OrdersInfoRespModel,
    OrderCreateModel
)
from models import Order
from common.security import jwt_auth_depend
from common.schemas import AuthJWTPayload
from common.constants import DEFAULT_ENDPOINT_RESPONSES
from common.dependencies import (
    get_async_db,
    get_async_http,
    AsyncSession,
    AsyncClient,
)
from fastapi import (
    APIRouter,
    Depends,
    Body,
    Path,
    HTTPException,
    status
)
from sqlmodel import (
    select,
    delete
)

router = APIRouter(prefix="/orders")

@router.get("/{user_id}",
            summary="Get User Orders",
            status_code=status.HTTP_200_OK,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                200: {"model": list[OrdersInfoRespModel], "description": "OK"}
            })
async def get_user_orders(
    user_id: int = Path(..., description="User ID in the app database"),
    db: AsyncSession = Depends(get_async_db)
) -> list[OrdersInfoRespModel]:

    stmt = select(Order)\
        .where(Order.user_id == user_id)

    result = await db.exec(stmt)
    return result.all()


@router.post("",
            summary="Add Order",
            status_code=status.HTTP_201_CREATED,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                201: {"model": Order, "description": "OK"}
            })
async def add_order(
    book_data: OrderCreateModel  = Body(..., description="Book creation data"),
    session: AsyncSession = Depends(get_async_db),
    http: AsyncClient = Depends(get_async_http),
    jwt_payload: AuthJWTPayload = Depends(jwt_auth_depend)
):
    # Book service check 
    try:
        result = await http.get(
            url=settings.BOOK_SERVICE_URL + f"books/{book_data.book_id}"
        )
        result.raise_for_status()
    except httpx.HTTPStatusError as ex:
        if result.status_code == 404:
            raise HTTPException(status_code=404, detail="The indicated book not found in the app database")
        else: raise ex

    orm_book = Order(
        **book_data.model_dump(),
        user_id=jwt_payload.user_id
    )
    session.add(
        orm_book
    )
    
    await session.commit()
    return orm_book


@router.delete("/{order_id}",
            summary="Delete Order by ID",
            status_code=status.HTTP_200_OK,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                200: {"model": OrdersInfoRespModel, "description": "OK"}
            })
async def delete_order_by_id(
    order_id: int = Path(..., description="Book ID in the app database"),
    session: AsyncSession = Depends(get_async_db),
    _ = Depends(jwt_auth_depend)
):
    result = await session.exec(delete(Order).where(Order.id == order_id))

    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="The indicated order not found.")

    await session.commit()
    
    return {
        "detail": f"Order: '{order_id}' deleted successfully."
    } 


# @router.post("/init_db/",
#             summary="Delete Book by ID",
#             status_code=status.HTTP_200_OK,
#             responses=DEFAULT_ENDPOINT_RESPONSES | {
#                 200: {"model": Order, "description": "OK"}
#             })
# async def init_db(
# ):
#     from core.db import init_db
#     await init_db()