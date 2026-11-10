"""Standard error envelope as specified in SCHEMA.md §6."""
from __future__ import annotations

from typing import Any

from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    passage_id: str | None = None
    source_start: int | None = None
    source_end: int | None = None
    message: str | None = None


class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[dict[str, Any]] | None = None


class ErrorEnvelope(BaseModel):
    error: ErrorBody


def make_error_response(
    status_code: int,
    code: str,
    message: str,
    details: list[dict[str, Any]] | None = None,
) -> JSONResponse:
    body = ErrorEnvelope(
        error=ErrorBody(code=code, message=message, details=details)
    )
    return JSONResponse(status_code=status_code, content=body.model_dump(exclude_none=True))


async def not_found_handler(request: Request, exc: Exception) -> JSONResponse:
    return make_error_response(404, "NOT_FOUND", "The requested resource was not found.")


async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
    return make_error_response(500, "INTERNAL_ERROR", "An unexpected server error occurred.")
