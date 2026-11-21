"""BranchTone FastAPI application entry point."""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse, FileResponse, Response

from app.api.routes.assets import router as assets_router
from app.api.routes.health import router as health_router
from app.api.routes.imports import router as imports_router
from app.api.routes.reports import router as reports_router
from app.api.routes.simulation import router as simulation_router
from app.api.routes.validation import router as validation_router
from app.core.config import settings
from app.core.errors import internal_error_handler, make_error_response

app = FastAPI(
    title="BranchTone API",
    description="Narrative Audio QA and Regression Testing Studio — backend API.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration — support local dev server, production origin, range requests, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://branchtone.vercel.app",
        "*",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"],
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


# API v1 routers
API_PREFIX = f"/api/{settings.api_version}"
app.include_router(health_router, prefix=API_PREFIX)
app.include_router(health_router, prefix="/api")  # alias for /api/health
app.include_router(imports_router, prefix=API_PREFIX)
app.include_router(simulation_router, prefix=API_PREFIX)
app.include_router(assets_router, prefix=API_PREFIX)
app.include_router(validation_router, prefix=API_PREFIX)
app.include_router(reports_router, prefix=API_PREFIX)

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.isdir(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")


@app.get("/")
async def root(request: Request) -> Response:
    accept = request.headers.get("accept", "")
    if "text/html" in accept and os.path.isdir(FRONTEND_DIST):
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
    return JSONResponse({"message": "BranchTone API — see /docs for available endpoints."})


@app.get("/studio")
@app.get("/app")
@app.get("/app/{full_path:path}")
@app.get("/overview")
@app.get("/story-graph")
@app.get("/narrative-map")
@app.get("/cue-library")
@app.get("/route-lab")
@app.get("/validation-centre")
@app.get("/reports")
async def serve_spa_pages() -> Response:
    if os.path.isdir(FRONTEND_DIST):
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
    return JSONResponse({"message": "BranchTone Frontend is building or not found."})
