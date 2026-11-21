"""Audio asset management and validation service for BranchTone."""
from __future__ import annotations

import hashlib
import os
import re
import uuid
from pathlib import Path
from typing import BinaryIO, Literal

from app.audio.waveform_decoder import decode_audio_peaks, decode_wav_peaks
from app.db.repository import sqlite_repo
from app.domain.entities import AudioAsset

MAX_AUDIO_BYTES = 50 * 1024 * 1024  # 50 MB
ALLOWED_MEDIA_TYPES = {"music", "ambience", "sfx", "voice"}


def sanitize_filename(filename: str) -> str:
    """Strips directory traversal sequences and unsafe characters."""
    # Strip any directory components
    base = os.path.basename(filename)
    # Remove null bytes and non-alphanumeric/dot/dash/underscore
    cleaned = re.sub(r"[^A-Za-z0-9._-]", "_", base)
    # Prevent leading dots
    cleaned = cleaned.lstrip(".")
    return cleaned or "audio_track.wav"


def detect_audio_mime(header: bytes) -> str | None:
    """Verifies audio header magic bytes."""
    if len(header) >= 12 and header.startswith(b"RIFF") and header[8:12] == b"WAVE":
        return "audio/wav"
    if header.startswith(b"ID3") or (len(header) >= 2 and header[0] == 0xFF and (header[1] & 0xE0) == 0xE0):
        return "audio/mpeg"
    if header.startswith(b"OggS"):
        return "audio/ogg"
    if header.startswith(b"fLaC"):
        return "audio/flac"
    return None


class AudioAssetService:
    """Manages audio file storage and real waveform decoding."""

    def __init__(self, storage_root: str | Path = "storage/audio") -> None:
        self.storage_root = Path(storage_root)
        self.storage_root.mkdir(parents=True, exist_ok=True)
        self._assets: dict[str, AudioAsset] = {}
        self._waveforms: dict[str, list[float]] = {}

    def store_and_decode_asset(
        self,
        file_bytes: bytes,
        filename: str,
        project_id: str,
        media_type: Literal["music", "ambience", "sfx", "voice"],
    ) -> tuple[AudioAsset, list[float]]:
        """Validates, stores, and decodes an uploaded audio file."""
        if len(file_bytes) > MAX_AUDIO_BYTES:
            raise ValueError(f"File size exceeds maximum allowed limit of 50MB ({len(file_bytes)} bytes).")

        mime_type = detect_audio_mime(file_bytes[:16])
        if not mime_type:
            raise ValueError(
                "Invalid or unsupported audio header. Must be a valid WAV, MP3, OGG, or FLAC binary file."
            )

        safe_name = sanitize_filename(filename)
        sha256 = hashlib.sha256(file_bytes).hexdigest()
        asset_id = f"ast_{uuid.uuid4().hex[:12]}"
        storage_key = f"{project_id}/{asset_id}_{safe_name}"

        # Save to disk
        dest_path = self.storage_root / project_id / f"{asset_id}_{safe_name}"
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        dest_path.write_bytes(file_bytes)

        duration_sec: float | None = None
        sample_rate: int | None = None
        channels: int | None = None
        peaks: list[float] = []

        if mime_type in ("audio/wav", "audio/flac"):
            try:
                peaks, duration_sec, sample_rate, channels = decode_audio_peaks(file_bytes, mime_type)
            except Exception:
                # If decoding fails, record available status without fabricated peaks
                pass

        asset = AudioAsset(
            asset_id=asset_id,
            project_id=project_id,
            filename=safe_name,
            media_type=media_type,
            mime_type=mime_type,
            duration_seconds=duration_sec,
            sample_rate_hz=sample_rate,
            channels=channels,
            size_bytes=len(file_bytes),
            storage_key=storage_key,
            sha256=sha256,
            status="available",
            provenance="uploaded_asset",
        )

        self._assets[asset_id] = asset
        if peaks:
            self._waveforms[asset_id] = peaks

        try:
            sqlite_repo.save_audio_asset(asset)
        except Exception:
            pass

        return asset, peaks

    def get_asset_file_path(self, asset: AudioAsset) -> Path | None:
        """Returns the absolute filesystem path for an asset if it exists."""
        if not asset.storage_key:
            return None
        path = self.storage_root / asset.storage_key
        if path.exists() and path.is_file():
            return path
        return None

    def get_asset(self, asset_id: str) -> AudioAsset | None:
        return self._assets.get(asset_id) or sqlite_repo.get_audio_asset(asset_id)

    def get_waveform(self, asset_id: str) -> list[float] | None:
        return self._waveforms.get(asset_id)

    def list_assets(self, project_id: str) -> list[AudioAsset]:
        persisted = sqlite_repo.list_audio_assets(project_id)
        combined = {a.asset_id: a for a in persisted}
        for a in self._assets.values():
            if a.project_id == project_id:
                combined[a.asset_id] = a
        return list(combined.values())


# Global singleton instance
audio_asset_service = AudioAssetService()
