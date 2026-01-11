from typing import Annotated
from core.config import settings
from common.security import pem_to_jwk
from schemas import (
    UserCreateModel,
    UserInfoRespModel,
    AuthJWTTokenResp,
    AuthJWTPayload,
)
from utils import (
    hash_password,
    verify_password,
    create_jwt_token,
    gen_jti
)
from models import User
from common.schemas import MessageModel
from common.constants import (
    DEFAULT_ENDPOINT_RESPONSES,
    MAX_PAGINATION
)
from common.dependencies import (
    get_async_db,
    AsyncSession
)
from fastapi.security import OAuth2PasswordRequestForm
from cryptography.hazmat.primitives import serialization
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

router = APIRouter()



@router.post("/",
            summary="Search User",
            status_code=status.HTTP_201_CREATED,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                409: {"model": MessageModel, "description": "Confict"},
                201: {"model": User, "description": "OK"}
            })
async def add_book(
    user_data: UserCreateModel  = Body(..., description="Book creation data"),
    session: AsyncSession = Depends(get_async_db)
) -> UserInfoRespModel:
    stmt = select(User)\
            .where(User.email == user_data.email)
    
    result = (await session.exec(stmt)).all()
    if len(result) > 0:
        raise HTTPException(status_code=409, detail="User with the same email address already exist in the app database.")

    hash = hash_password(user_data.password.get_secret_value())

    orm_book = User(
        **user_data.model_dump(),
        password=hash
    )

    session.add(
        orm_book
    )
    
    await session.commit()
    return orm_book


@router.post("/login",
             summary="Login to app",
             status_code=status.HTTP_200_OK,
             responses=DEFAULT_ENDPOINT_RESPONSES | {
                 200: {"model": MessageModel, "description": "OK"}
             }
             )
async def local_login(
    
    login_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: AsyncSession = Depends(get_async_db),
):
    """
        #  Login to APP account 
        ## Description:
        > Allows you tologin to app nnd get access to resources.

        ## Required fields:
        - **login_data**

        ## Return values:
        > Data structure consistent with the response model."
    """
    stmt = select(User)\
        .where(User.email == login_data.username)
    
    user_data: User = (await session.exec(stmt)).first()

    if user_data is None or not verify_password(login_data.password, user_data.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Generating JWT jti
    jti = gen_jti()
    expires_in = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES*60

    access_token = AuthJWTTokenResp(
        token=create_jwt_token(
            payload=AuthJWTPayload(
                sub=user_data.email,
                user_id=user_data.id,
                refresh=False,
                jti=jti,
            ),
            expires_in=expires_in
        ),
        expires_in=expires_in
    )

    return access_token


@router.get("/.well-known/jwks.json",
            summary="JWKS",
            status_code=status.HTTP_200_OK,
            responses=DEFAULT_ENDPOINT_RESPONSES | {
                200: {"model": MessageModel, "description": "OK"}
            }
            )
async def jwks():
    return {
        "keys": [pem_to_jwk(serialization.load_pem_public_key(settings.JWT_PUBLIC_KEY_PEM.encode()))]
    }


# @router.post("/init_db/",
#             summary="Delete Book by ID",
#             status_code=status.HTTP_200_OK,
#             responses=DEFAULT_ENDPOINT_RESPONSES | {
#                 200: {"model": User, "description": "OK"}
#             })
# async def init_db(
# ):
#     from core.db import init_db
#     await init_db()