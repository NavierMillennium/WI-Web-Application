from core.config import settings
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlmodel import SQLModel, create_engine


engine = create_engine(
    url=settings.DATABASE_URL,
    echo=True if settings.DEVELOPER_MODE else False,
    hide_parameters=False if settings.DEVELOPER_MODE else True
)
async_engine = AsyncEngine(engine)

async def init_db() -> None:
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
