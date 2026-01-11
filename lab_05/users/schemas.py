import re
from utils import email_aliases_cleaner
from uuid import UUID
from enum import Enum
from typing import (
    Final,
    Annotated
)
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    SecretStr,
    ValidationInfo,
    EmailStr,
    AfterValidator,
    field_validator
)


PASSWORD_MIN_LEN: Final[int] = 8
PASSWORD_MAX_LEN: Final[int] = 20
PASS_MIN_CHAR_NB: Final[int] = 1
PASS_MIN_NUMBERS_NB: Final[int] = 1
PASS_MIN_SPECIAL_CHAR_NB: Final[int] = 1 
EMAIL_MIN_LEN: Final[int] = 3
EMAIL_MAX_LEN: Final[int] = 100

class UserPasswordModel(BaseModel):
    """
        User Password Checker Model 
    """
    password: SecretStr = Field(..., description="plain password",
                                min_length=PASSWORD_MIN_LEN, max_length=PASSWORD_MAX_LEN, example="Secure123!", exclude=True)
    repeat_password: SecretStr = Field(..., description="repeated plain password",
                                       min_length=PASSWORD_MIN_LEN, max_length=PASSWORD_MAX_LEN, example="Secure123!", exclude=True)

    @field_validator("password", mode="after")
    @classmethod
    def validate_password(cls, password:SecretStr):
        password_value = password.get_secret_value()

        # TODO: Adding uppercase validator

        if len(re.findall(r"[A-Za-z]", password_value)) < PASS_MIN_CHAR_NB:
            raise ValueError(f"Password must contain at least {PASS_MIN_CHAR_NB} letter.")

        if len(re.findall(r"\d", password_value)) < PASS_MIN_NUMBERS_NB:
            raise ValueError(f"Password must contain at least {PASS_MIN_NUMBERS_NB} number.")

        if len(re.findall(r"[!@#$%^&*(),.?\":{}|<>]", password_value)) < PASS_MIN_SPECIAL_CHAR_NB:
            raise ValueError(f"Password must contain at least {PASS_MIN_SPECIAL_CHAR_NB} special character.")

        return password

    @field_validator("repeat_password", mode="after")
    @classmethod
    def passwords_match(cls, repeat_password:SecretStr, info:ValidationInfo):
        if "password" in info.data:
            if repeat_password.get_secret_value() != info.data['password'].get_secret_value():
                raise ValueError("Passwords do not match.")
        return repeat_password

class UserCreateModel(UserPasswordModel):
    email: Annotated[EmailStr, AfterValidator(email_aliases_cleaner)] = Field(
        ..., description="user primary email", min_length=EMAIL_MIN_LEN, max_length=EMAIL_MAX_LEN)    
    


class UserInfoRespModel(BaseModel):
    id: int
    email: str


class TokenType(str, Enum):
    BEARER = "BEARER"
    BASIC = "BASIC"
    TOKEN = "TOKEN"


class AuthJWTTokenResp(BaseModel):
    token: str
    token_type: TokenType = Field(TokenType.BEARER)
    expires_in: int 


class AuthJWTPayload(BaseModel):
    sub: str
    user_id: int
    refresh: bool = Field(False)
    jti: str|UUID