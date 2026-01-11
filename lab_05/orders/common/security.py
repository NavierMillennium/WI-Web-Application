import jwt 
import asyncio
from common.schemas import AuthJWTPayload
from common.dependencies import get_async_http
from functools import lru_cache
from jwt import PyJWKSet
from core.config import settings
from fastapi import (
    Security,
    Depends,
    Request,
    status,
    HTTPException
)
from fastapi.security import APIKeyHeader
from httpx import (
    AsyncClient,
    Response
)
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization 


async def get_public_key(
    ahttp_client: AsyncClient
):
    response: Response = await ahttp_client.get(
        url=settings.USER_SERVICE_URL + ".well-known/jwks.json"
    )
    response.raise_for_status()
    return response.json()


async def decode_jwt_token(
    token: str,
    ahttp_client: AsyncClient,
    raise_for_error: bool = True
) -> dict:
    """
        JWT token decoder 
        
        :param token: input JWT token as String
        :param raiser_for_status: if func should raise after InvalidTokenError 
    """
    jwks = await get_public_key(
        ahttp_client=ahttp_client
    )
    jwks_set = PyJWKSet.from_dict(jwks)
    key = jwks_set["core-key"]
    try:
        return jwt.decode(token, key, algorithms=["RS256"])
    except jwt.InvalidTokenError as ex:
        if raise_for_error:
            raise ex
        else:
            return None
        


class BearerToken(APIKeyHeader):
    async def __call__(self, request: Request) -> str|None:
        api_key:str = await super().__call__(request=request)
        headers_values = api_key.split(" ")
        if len(headers_values) < 2:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "APIKey"},
        )
        return api_key.split(" ")[1]


async def jwt_auth_depend(
    token: str | None = Security(BearerToken(name="Authorization", scheme_name="Bearer", auto_error=True)),
    ahttp_client: AsyncClient = Depends(get_async_http)
):
    try:
        jwt_dict = await decode_jwt_token(
            token=token,
            ahttp_client=ahttp_client
        )
        return AuthJWTPayload(**jwt_dict)
    except (jwt.ExpiredSignatureError, jwt.InvalidSignatureError) as ex:
        raise HTTPException(status_code=401, detail="Invalid auth token")