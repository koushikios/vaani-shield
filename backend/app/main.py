from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import routes_health, routes_history, routes_detect
from app.core.config import settings
from app.db import init_db


app = FastAPI(
    title=settings.app_name
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vaani-shield-iv3a.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.exception_handler(Exception)
async def unhandled_exception_handler(
    request: Request,
    exc: Exception
) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_error",
            "message": "An unexpected error occurred."
        },
    )


app.include_router(routes_health.router)
app.include_router(routes_history.router)
app.include_router(routes_detect.router)