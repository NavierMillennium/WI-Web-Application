from typing import AsyncGenerator
from sqlmodel.ext.asyncio.session import AsyncSession
from httpx import AsyncClient
from sqlalchemy.orm import sessionmaker
from core.db import async_engine

async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    Session = sessionmaker(
        bind=async_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with Session() as session:
        yield session
        
        # Transation commit 
        await session.commit()


async def get_async_http() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient() as client: 
        yield client
