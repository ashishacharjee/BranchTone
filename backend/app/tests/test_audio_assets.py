"""Unit tests for audio asset storage, header validation, and waveform extraction."""
import io
import math
import struct
import wave
import pytest
from app.audio.asset_service import AudioAssetService, sanitize_filename
from app.audio.waveform_decoder import decode_wav_peaks


def generate_test_wav(duration_sec: float = 0.5, freq_hz: float = 440.0, sample_rate: int = 44100) -> bytes:
    """Generates an in-memory 16-bit mono sine wave WAV."""
    buffer = io.BytesIO()
    num_samples = int(duration_sec * sample_rate)
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        frames = bytearray()
        for i in range(num_samples):
            val = int(32767.0 * 0.7 * math.sin(2.0 * math.pi * freq_hz * (i / sample_rate)))
            frames.extend(struct.pack("<h", val))
        wf.writeframes(frames)
    return buffer.getvalue()


def test_waveform_decoder_extracts_real_peaks():
    wav_bytes = generate_test_wav(duration_sec=0.5, freq_hz=440.0, sample_rate=44100)
    peaks, duration, srate, channels = decode_wav_peaks(wav_bytes, bucket_count=64)

    assert round(duration, 2) == 0.5
    assert srate == 44100
    assert channels == 1
    assert len(peaks) == 64
    assert all(0.0 <= p <= 1.0 for p in peaks)
    # Sine wave at 0.7 amplitude should have peaks near 0.7
    assert any(p > 0.6 for p in peaks)


def test_audio_asset_service_upload_and_decode(tmp_path):
    service = AudioAssetService(storage_root=tmp_path)
    wav_bytes = generate_test_wav(duration_sec=1.0)

    asset, peaks = service.store_and_decode_asset(
        file_bytes=wav_bytes,
        filename="theme_intro.wav",
        project_id="prj_audio_test",
        media_type="music",
    )

    assert asset.status == "available"
    assert asset.mime_type == "audio/wav"
    assert asset.filename == "theme_intro.wav"
    assert round(asset.duration_seconds or 0.0, 1) == 1.0
    assert asset.sample_rate_hz == 44100
    assert asset.channels == 1
    assert len(asset.sha256 or "") == 64
    assert len(peaks) == 128


def test_sanitize_filename_prevents_path_traversal():
    assert sanitize_filename("../../../etc/passwd.wav") == "passwd.wav"
    assert sanitize_filename("..\\..\\windows\\system32\\evil.wav") == "evil.wav"
    assert sanitize_filename("normal_audio.wav") == "normal_audio.wav"


def test_reject_invalid_audio_header(tmp_path):
    service = AudioAssetService(storage_root=tmp_path)
    bad_bytes = b"This is not a real audio file header"
    with pytest.raises(ValueError, match="Invalid or unsupported audio header"):
        service.store_and_decode_asset(
            file_bytes=bad_bytes,
            filename="fake.wav",
            project_id="prj_fake",
            media_type="sfx",
        )


def test_stream_audio_asset_endpoints(tmp_path, monkeypatch):
    from fastapi.testclient import TestClient
    from app.audio.asset_service import audio_asset_service
    from app.main import app

    client = TestClient(app)
    wav_bytes = generate_test_wav(duration_sec=0.2)
    asset, _ = audio_asset_service.store_and_decode_asset(
        file_bytes=wav_bytes,
        filename="test_stream.wav",
        project_id="prj_stream_test",
        media_type="music",
    )

    # 1. Full content stream (no Range header)
    resp = client.get(f"/api/v1/projects/prj_stream_test/assets/{asset.asset_id}/stream")
    assert resp.status_code == 200
    assert resp.headers["accept-ranges"] == "bytes"
    assert resp.headers["content-type"] == "audio/wav"
    assert int(resp.headers["content-length"]) == len(wav_bytes)
    assert resp.content == wav_bytes

    # 2. Partial content stream with Range header
    resp_range = client.get(
        f"/api/v1/projects/prj_stream_test/assets/{asset.asset_id}/stream",
        headers={"Range": "bytes=0-99"},
    )
    assert resp_range.status_code == 206
    assert resp_range.headers["accept-ranges"] == "bytes"
    assert resp_range.headers["content-range"] == f"bytes 0-99/{len(wav_bytes)}"
    assert len(resp_range.content) == 100
    assert resp_range.content == wav_bytes[0:100]

    # 3. Open-ended range: bytes=100-
    resp_open = client.get(
        f"/api/v1/projects/prj_stream_test/assets/{asset.asset_id}/stream",
        headers={"Range": "bytes=100-"},
    )
    assert resp_open.status_code == 206
    expected_len = len(wav_bytes) - 100
    assert len(resp_open.content) == expected_len
    assert resp_open.content == wav_bytes[100:]

    # 4. Out of bounds range
    resp_oob = client.get(
        f"/api/v1/projects/prj_stream_test/assets/{asset.asset_id}/stream",
        headers={"Range": f"bytes={len(wav_bytes) + 100}-"},
    )
    assert resp_oob.status_code == 416

    # 5. Nonexistent asset
    resp_404 = client.get("/api/v1/projects/prj_stream_test/assets/ast_nonexistent/stream")
    assert resp_404.status_code == 404
