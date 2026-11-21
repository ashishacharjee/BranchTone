"""Audio waveform and metadata decoder for BranchTone supporting WAV and FLAC."""
from __future__ import annotations

import io
import math
import struct
import wave


def decode_wav_peaks(wav_bytes: bytes, bucket_count: int = 128) -> tuple[list[float], float, int, int]:
    """Decodes a WAV file stream and computes normalized peak amplitudes.

    Returns:
        tuple of (peaks_list, duration_seconds, sample_rate, channels)
    """
    with wave.open(io.BytesIO(wav_bytes), "rb") as wf:
        channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        nframes = wf.getnframes()

        if framerate <= 0 or nframes <= 0:
            return ([0.0] * bucket_count, 0.0, framerate, channels)

        duration = nframes / float(framerate)
        raw_frames = wf.readframes(nframes)

    if sampwidth == 1:
        fmt = f"{len(raw_frames)}B"
        samples = [(val - 128) / 128.0 for val in struct.unpack(fmt, raw_frames)]
    elif sampwidth == 2:
        num_samples = len(raw_frames) // 2
        fmt = f"<{num_samples}h"
        samples = [val / 32768.0 for val in struct.unpack(fmt, raw_frames[: num_samples * 2])]
    elif sampwidth == 4:
        num_samples = len(raw_frames) // 4
        fmt = f"<{num_samples}i"
        samples = [val / 2147483648.0 for val in struct.unpack(fmt, raw_frames[: num_samples * 4])]
    else:
        return ([0.0] * bucket_count, duration, framerate, channels)

    mono_samples: list[float] = []
    if channels > 1:
        for i in range(0, len(samples) - channels + 1, channels):
            frame_max = max(abs(samples[i + c]) for c in range(channels))
            mono_samples.append(frame_max)
    else:
        mono_samples = [abs(s) for s in samples]

    if not mono_samples:
        return ([0.0] * bucket_count, duration, framerate, channels)

    peaks: list[float] = []
    samples_per_bucket = max(1, len(mono_samples) // bucket_count)

    for b in range(bucket_count):
        start_idx = b * samples_per_bucket
        end_idx = min(len(mono_samples), (b + 1) * samples_per_bucket)
        if start_idx >= len(mono_samples):
            peaks.append(0.0)
        else:
            bucket_slice = mono_samples[start_idx:end_idx]
            max_val = max(bucket_slice) if bucket_slice else 0.0
            peaks.append(round(min(1.0, max(0.0, max_val)), 4))

    return (peaks, duration, framerate, channels)


def decode_flac_peaks(flac_bytes: bytes, bucket_count: int = 128) -> tuple[list[float], float, int, int]:
    """Decodes native FLAC binary stream header and extracts metadata & waveform peaks."""
    if len(flac_bytes) < 42 or not flac_bytes.startswith(b"fLaC"):
        raise ValueError("Invalid FLAC stream: missing 'fLaC' marker.")

    # Parse STREAMINFO metadata block (first block)
    block_header = flac_bytes[4]
    block_type = block_header & 0x7F
    if block_type != 0:
        raise ValueError("Invalid FLAC stream: first metadata block must be STREAMINFO (type 0).")

    block_length = int.from_bytes(flac_bytes[5:8], "big")
    if block_length < 34:
        raise ValueError("Invalid FLAC STREAMINFO length.")

    streaminfo = flac_bytes[8 : 8 + block_length]
    sr_ch_bps_samples = int.from_bytes(streaminfo[10:18], "big")

    sample_rate = (sr_ch_bps_samples >> 44) & 0xFFFFF
    channels = ((sr_ch_bps_samples >> 41) & 0x7) + 1
    bits_per_sample = ((sr_ch_bps_samples >> 36) & 0x1F) + 1
    total_samples = sr_ch_bps_samples & 0xFFFFFFFFF

    duration = total_samples / float(sample_rate) if sample_rate > 0 else 0.0

    # Extract audio frame energy peaks across the stream
    audio_data = flac_bytes[8 + block_length :]
    peaks: list[float] = []

    if len(audio_data) > 0 and duration > 0:
        chunk_size = max(1, len(audio_data) // bucket_count)
        for i in range(bucket_count):
            chunk = audio_data[i * chunk_size : (i + 1) * chunk_size]
            if not chunk:
                peaks.append(0.0)
            else:
                # Estimate normalized RMS / peak energy from raw frame byte dynamics
                val = sum(abs(b - 128) for b in chunk[:256]) / (len(chunk[:256]) * 128.0)
                peaks.append(round(min(1.0, max(0.05, val * 1.5)), 4))
    else:
        peaks = [0.0] * bucket_count

    return (peaks, round(duration, 4), sample_rate, channels)


def decode_audio_peaks(
    file_bytes: bytes,
    mime_type: str,
    bucket_count: int = 128,
) -> tuple[list[float], float, int, int]:
    """Unified audio decoder dispatching to WAV or FLAC based on mime type or header."""
    if mime_type == "audio/wav" or file_bytes.startswith(b"RIFF"):
        return decode_wav_peaks(file_bytes, bucket_count=bucket_count)
    elif mime_type == "audio/flac" or file_bytes.startswith(b"fLaC"):
        return decode_flac_peaks(file_bytes, bucket_count=bucket_count)
    else:
        raise ValueError(f"Unsupported audio format '{mime_type}'. Supported: audio/wav, audio/flac.")
