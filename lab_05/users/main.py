import uvicorn 
from fastapi import FastAPI
from core.config import settings
from router import router

app = FastAPI(
    title=settings.APPLICATION_TITLE,
    root_path=f"/{settings.API_PREFIX}"
)

app.include_router(router, tags=["Users"])


if __name__ == "__main__":
    
    uvicorn.run(
        "main:app",
        host=settings.APPLICATION_IP,
        port=settings.APPLICATION_PORT,
        workers=4,
        reload=settings.DEVELOPER_MODE
    )