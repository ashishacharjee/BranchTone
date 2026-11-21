"""Audio asset API endpoints for BranchTone."""
from __future__ import annotations

import re
from typing import Literal

from fastapi import APIRouter, File, Form, HTTPException, Request, Response, UploadFile
from pydantic import BaseModel

from app.audio.asset_service import audio_asset_service
from app.domain.entities import AudioAsset

router = APIRouter(tags=["assets"])


class WaveformResponse(BaseModel):
    asset_id: str
    bucket_count: int
    peaks: list[float]


@router.post(
    "/projects/{project_id}/assets",
    response_model=AudioAsset,
    status_code=201,
    summary="Upload and decode audio asset file",
)
async def upload_asset(
    project_id: str,
    file: UploadFile = File(...),
    media_type: Literal["music", "ambience", "sfx", "voice"] = Form("music"),
) -> AudioAsset:
    """Uploads, validates, and decodes an audio file into managed storage."""
    file_bytes = await file.read()
    try:
        asset, _ = audio_asset_service.store_and_decode_asset(
            file_bytes=file_bytes,
            filename=file.filename or "track.wav",
            project_id=project_id,
            media_type=media_type,
        )
        return asset
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@router.get(
    "/projects/{project_id}/assets",
    response_model=list[AudioAsset],
    summary="List audio assets for a project",
)
async def list_assets(project_id: str) -> list[AudioAsset]:
    """Returns all stored audio assets for the specified project."""
    return audio_asset_service.list_assets(project_id)


@router.get(
    "/projects/{project_id}/assets/{asset_id}",
    response_model=AudioAsset,
    summary="Get audio asset details",
)
async def get_asset(project_id: str, asset_id: str) -> AudioAsset:
    """Returns metadata for a specific audio asset."""
    asset = audio_asset_service.get_asset(asset_id)
    if not asset or asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Audio asset not found.")
    return asset


@router.get(
    "/projects/{project_id}/assets/{asset_id}/waveform",
    response_model=WaveformResponse,
    summary="Get decoded waveform peak amplitudes",
)
async def get_waveform(project_id: str, asset_id: str) -> WaveformResponse:
    """Returns normalized PCM waveform peaks for an audio asset."""
    asset = audio_asset_service.get_asset(asset_id)
    if not asset or asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Audio asset not found.")

    peaks = audio_asset_service.get_waveform(asset_id)
    if peaks is None:
        raise HTTPException(status_code=404, detail="Waveform not available for this asset.")

    return WaveformResponse(
        asset_id=asset_id,
        bucket_count=len(peaks),
        peaks=peaks,
    )


@router.get(
    "/projects/{project_id}/assets/{asset_id}/stream",
    summary="Stream binary audio with HTTP Range support for scrubbing and seeking",
)
async def stream_asset(
    project_id: str,
    asset_id: str,
    request: Request,
) -> Response:
    """Streams audio file with HTTP Range partial content (206) support for scrubbing."""
    asset = audio_asset_service.get_asset(asset_id)
    if not asset or asset.project_id != project_id:
        raise HTTPException(status_code=404, detail="Audio asset not found.")

    file_path = audio_asset_service.get_asset_file_path(asset)
    if not file_path or not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Audio asset '{asset.filename}' file is missing or unavailable on disk.",
        )

    file_size = file_path.stat().st_size
    content_type = asset.mime_type or "audio/wav"
    range_header = request.headers.get("Range") or request.headers.get("range")

    if range_header:
        # Expected format: bytes=start-end
        range_match = re.match(r"^bytes=(\d+)-(\d*)$", range_header.strip())
        if not range_match:
            raise HTTPException(status_code=400, detail="Invalid Range header format.")

        start_str, end_str = range_match.groups()
        start = int(start_str)
        end = int(end_str) if end_str else file_size - 1

        if start >= file_size or end >= file_size or start > end:
            return Response(
                status_code=416,
                headers={"Content-Range": f"bytes */{file_size}"},
            )

        chunk_size = end - start + 1
        with open(file_path, "rb") as f:
            f.seek(start)
            data = f.read(chunk_size)

        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(chunk_size),
            "Content-Type": content_type,
        }
        return Response(content=data, status_code=206, headers=headers, media_type=content_type)
    else:
        with open(file_path, "rb") as f:
            data = f.read()
        headers = {
            "Accept-Ranges": "bytes",
            "Content-Length": str(file_size),
            "Content-Type": content_type,
        }
        return Response(content=data, status_code=200, headers=headers, media_type=content_type)
