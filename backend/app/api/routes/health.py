"""Health check endpoint — GET /api/v1/health"""
from datetime import UTC, datetime

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict[str, str]:
    """Return service health status and version."""
    return {
        "status": "ok",
        "service": "branchtone-backend",
        "version": "0.1.0",
        "timestamp": datetime.now(UTC).isoformat(),
        "compliance_note": (
            "Domain engine modules (parser, simulator, rules) are reserved "
            "pending organizer compliance classification per COMPLIANCE_MATRIX.md."
        ),
    }
