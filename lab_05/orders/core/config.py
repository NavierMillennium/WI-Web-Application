from enum import Enum
from pydantic import computed_field
from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)


class AppEnvironment(str, Enum):
    LOCAL = "LOCAL"
    TEST = "TEST"
    DEV = "DEV"
    STG = "STG"
    PROD = "PROD"


class Settings(BaseSettings):
    APPLICATION_TITLE: str
    APP_NAME: str
    APPLICATION_IP: str
    APPLICATION_PORT: int
    API_PREFIX: str
    APP_ENV: AppEnvironment
    WEBDRIVER_PATH: str
    API_ALLOWED_ORIGINS: str
    DATABASE_URL: str
    BOOK_SERVICE_URL: str
    USER_SERVICE_URL: str

    @computed_field
    def DEVELOPER_MODE(self) -> bool:
        return self.APP_ENV == AppEnvironment.LOCAL

    model_config = SettingsConfigDict(
        # https://docs.pydantic.dev/latest/concepts/pydantic_settings/#dotenv-env-support
        env_file=".env",
        env_file_encoding="utf-8",
        extra="allow",
    )

settings = Settings()