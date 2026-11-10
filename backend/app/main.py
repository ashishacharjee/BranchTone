"""BranchTone FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.core.config import settings

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

# API v1 router
API_PREFIX = f"/api/{settings.api_version}"
app.include_router(health_router, prefix=API_PREFIX)


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "BranchTone API — see /docs for available endpoints."}
