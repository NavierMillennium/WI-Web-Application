import bcrypt 
import jwt 
from uuid import uuid4
from core.config import settings
from datetime import (
    datetime,
    timezone
) 
from cryptography.hazmat.primitives import serialization
from pydantic import BaseModel

def hash_password(
    plain_password: str,
) -> str:
    """
        Password hash encryptor

        :param plain_password: plain password text
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def email_aliases_cleaner(
    email: str
) -> str:
    """
        Return input mail addres without aliases ('+' sign)

        :parama email: email address string 
    """
    if email is not None:
        return email.split("+")[0] + "@" + email.split("@")[1] if "+" in email else email


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    """
        Password checker 

        :param plain_password: plain password text to validate 
        :param hashed_password: hashed password structure to validate
    """
    if hashed_password is not None:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    else:
        return False
    
def now_utc() -> datetime:
    """
        UTC now func
    """
    return datetime.now(timezone.utc)


def create_jwt_token(
        payload: dict|BaseModel,
        expires_in: int | None = None,
        exp: int|datetime|None = None 
) -> str:
    """
        JWT token creator. If param expire_delta has not been set

        :param payload: JWT payload
        :param expires_delta: (Optional - default: None) token expires delta
    """
    # TODO: use method from utils   
    if isinstance(payload, BaseModel):
        to_encode = payload.model_dump(mode='json')
    else:
        to_encode = payload.copy()

    iat = int(now_utc().timestamp())
    
    to_encode['iat'] = iat
    if expires_in is not None:
        to_encode.update({"exp": iat + expires_in})

    if exp is not None:
        to_encode.update({"exp": exp})

    encoded_jwt = jwt.encode(
        payload=to_encode, key=serialization.load_pem_private_key(settings.JWT_PRIVATE_KEY_PEM.encode(), password=None), algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def gen_jti() -> str:
    return str(uuid4())
