"""BranchTone FastAPI application entry point."""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse

from app.api.routes.health import router as health_router
from app.core.config import settings
from app.core.errors import internal_error_handler, make_error_response

app = FastAPI(
    title="BranchTone API",
    description="Narrative Audio QA and Regression Testing Studio — backend API.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — restrict to configured origins only
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Accept"],
)

# Exception handlers — standard error envelope per SCHEMA.md §6
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    if exc.status_code == 404:
        msg = (
            str(exc.detail)
            if exc.detail and exc.detail != "Not Found"
            else "The requested resource was not found."
        )
        return make_error_response(404, "NOT_FOUND", msg)
    return make_error_response(exc.status_code, f"HTTP_{exc.status_code}", str(exc.detail))


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return await internal_error_handler(request, exc)


# API v1 router
API_PREFIX = f"/api/{settings.api_version}"
app.include_router(health_router, prefix=API_PREFIX)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "BranchTone API — see /docs for available endpoints."}
