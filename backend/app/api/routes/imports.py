"""Story import endpoint for BranchTone (.twee and .ink)."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.compiler.story_compiler import CanonicalStoryIR, compile_story_ir
from app.ingestion.parser import parse_story_source

router = APIRouter(tags=["imports"])


class ImportTextRequest(BaseModel):
    source_text: str = Field(..., description="Raw UTF-8 .twee or .ink story text")
    filename: str = Field(default="story.twee", description="Source filename (.twee or .ink)")
    version_label: str = Field(default="v1.0", description="Version label")


@router.post(
    "/projects/{project_id}/imports",
    response_model=CanonicalStoryIR,
    status_code=201,
    summary="Import Twee or Ink story file and compile to Canonical Story IR",
)
async def import_story(
    project_id: str,
    payload: ImportTextRequest,
) -> CanonicalStoryIR:
    """Parses and compiles a Twee or Ink source text into Canonical Story IR."""
    parsing_res = parse_story_source(payload.source_text, filename=payload.filename)
    if parsing_res.errors:
        raise HTTPException(
            status_code=422,
            detail=f"Story parsing failed: {'; '.join(parsing_res.errors)}",
        )

    ir = compile_story_ir(
        parsing_res,
        project_id=project_id,
        version_label=payload.version_label,
    )
    return ir
