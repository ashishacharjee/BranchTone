"""Unit tests for FLAC audio binary decoder."""
import pytest
from app.audio.asset_service import AudioAssetService
from app.audio.waveform_decoder import decode_audio_peaks, decode_flac_peaks


def generate_mock_flac(duration_sec: float = 2.0, sample_rate: int = 44100, channels: int = 2) -> bytes:
    """Constructs a valid native FLAC binary stream with STREAMINFO metadata block."""
    total_samples = int(duration_sec * sample_rate)
    header = b"fLaC"

    # STREAMINFO block: type 0 (1 byte), length 34 (3 bytes)
    block_header = bytes([0x00, 0x00, 0x00, 0x22])

    min_block_size = (4096).to_bytes(2, "big")
    max_block_size = (4096).to_bytes(2, "big")
    min_frame_size = bytes([0x00, 0x00, 0x00])
    max_frame_size = bytes([0x00, 0x00, 0x00])

    # 8 bytes: (sample_rate: 20 bits) | (channels - 1: 3 bits) | (bps - 1: 5 bits) | (total_samples: 36 bits)
    bits_per_sample = 16
    sr_ch_bps_samples = (
        (sample_rate << 44)
        | ((channels - 1) << 41)
        | ((bits_per_sample - 1) << 36)
        | (total_samples & 0xFFFFFFFFF)
    )
    sr_data = sr_ch_bps_samples.to_bytes(8, "big")
    md5_sig = b"\x00" * 16

    streaminfo_body = min_block_size + max_block_size + min_frame_size + max_frame_size + sr_data + md5_sig
    assert len(streaminfo_body) == 34

    # Add mock audio frame payload
    audio_frames = bytes([i % 256 for i in range(1024)])

    return header + block_header + streaminfo_body + audio_frames


def test_decode_flac_metadata_and_peaks():
    flac_bytes = generate_mock_flac(duration_sec=2.5, sample_rate=48000, channels=2)
    peaks, duration, srate, channels = decode_flac_peaks(flac_bytes, bucket_count=64)

    assert round(duration, 1) == 2.5
    assert srate == 48000
    assert channels == 2
    assert len(peaks) == 64
    assert all(0.0 <= p <= 1.0 for p in peaks)


def test_asset_service_stores_and_decodes_flac(tmp_path):
    service = AudioAssetService(storage_root=tmp_path)
    flac_bytes = generate_mock_flac(duration_sec=3.0)

    asset, peaks = service.store_and_decode_asset(
        file_bytes=flac_bytes,
        filename="ambient_cave.flac",
        project_id="prj_flac_test",
        media_type="ambience",
    )

    assert asset.status == "available"
    assert asset.mime_type == "audio/flac"
    assert asset.filename == "ambient_cave.flac"
    assert round(asset.duration_seconds or 0.0, 1) == 3.0
    assert len(peaks) == 128


def test_decode_flac_invalid_header_raises():
    bad_bytes = b"fLaX" + b"\x00" * 40
    with pytest.raises(ValueError, match="missing 'fLaC' marker"):
        decode_flac_peaks(bad_bytes)
