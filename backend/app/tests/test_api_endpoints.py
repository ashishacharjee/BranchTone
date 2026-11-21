"""End-to-end local integration test for all BranchTone API endpoints."""
import io
import math
import struct
import wave
import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def generate_local_wav() -> bytes:
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(44100)
        frames = bytearray()
        for i in range(4410):  # 0.1s
            val = int(32767.0 * 0.5 * math.sin(2.0 * math.pi * 440.0 * (i / 44100)))
            frames.extend(struct.pack("<h", val))
        wf.writeframes(frames)
    return buffer.getvalue()


SAMPLE_TWEE = """\
:: P-001 Lobby [entry]
Atrium entrance.
[[Climb Vent->P-003 Air Vent]]

:: P-003 Air Vent [suspense]
Crawl in duct.
[[Drop Vault->P-004 Server Vault]]

:: P-004 Server Vault [climax]
Server room.
"""


def test_full_pipeline_local_api():
    project_id = "prj_e2e_local"

    # 1. Test Import Twee
    import_resp = client.post(
        f"/api/v1/projects/{project_id}/imports",
        json={
            "source_text": SAMPLE_TWEE,
            "filename": "local_story.twee",
            "version_label": "v1.0",
        },
    )
    assert import_resp.status_code == 201
    ir_data = import_resp.json()
    assert len(ir_data["passages"]) == 3
    assert len(ir_data["edges"]) == 2

    # 2. Test Audio Upload & Waveform
    wav_bytes = generate_local_wav()
    upload_resp = client.post(
        f"/api/v1/projects/{project_id}/assets",
        files={"file": ("test_track.wav", wav_bytes, "audio/wav")},
        data={"media_type": "music"},
    )
    assert upload_resp.status_code == 201
    asset_data = upload_resp.json()
    asset_id = asset_data["asset_id"]

    # Waveform endpoint
    wave_resp = client.get(f"/api/v1/projects/{project_id}/assets/{asset_id}/waveform")
    assert wave_resp.status_code == 200
    assert len(wave_resp.json()["peaks"]) == 128

    # 3. Test Simulation
    cue = {
        "cue_id": "cue_local_01",
        "asset_id": asset_id,
        "layer": "music",
        "trigger": {"type": "passage_entry", "passage_id": "P-003"},
        "required_facts": [{"fact_key": "traitor_known", "expected_value": True}],
        "stop_policy": "end_of_passage",
        "provenance": "creator_config",
        "start_offset_ms": 0,
        "fade_in_ms": 0,
        "fade_out_ms": 0,
        "loop": False,
        "allow_overlap": False,
        "intentional": False,
    }

    sim_resp = client.post(
        f"/api/v1/projects/{project_id}/simulate",
        json={
            "version_id": ir_data["story_version"]["version_id"],
            "passages": ir_data["passages"],
            "edges": ir_data["edges"],
            "mutations": ir_data["mutations"],
            "cues": [cue],
        },
    )
    assert sim_resp.status_code == 200
    sim_data = sim_resp.json()
    assert len(sim_data["routes"]) == 1
    assert len(sim_data["cue_events"]) == 1

    # 4. Test Validation Run (BT-001 dynamic detection + BT-002 coverage)
    val_resp = client.post(
        f"/api/v1/projects/{project_id}/validation-runs",
        json={
            "simulation": sim_data,
            "cues": [cue],
            "passages": ir_data["passages"],
        },
    )
    assert val_resp.status_code == 201
    val_data = val_resp.json()
    assert val_data["total_findings"] == 2

    bt001 = next(f for f in val_data["findings"] if f["rule_id"] == "RULE_REVEAL_PROTECTION")
    assert bt001["finding_code"] == "BT-001"
    assert bt001["passage_id"] == "P-003"
    assert bt001["status"] == "open"

    bt002 = next(f for f in val_data["findings"] if f["rule_id"] == "RULE_REQUIRED_CUE_COVERAGE")
    assert bt002["passage_id"] == "P-004"

    # 5. Test Finding Status Triage (Mark Resolved on BT-001)
    patch_resp = client.patch(
        f"/api/v1/projects/{project_id}/findings/{bt001['finding_id']}",
        json={"status": "resolved"},
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "resolved"

    # 6. Test JSON & Markdown Report Export
    run_id = val_data["run_id"]
    rep_json_resp = client.get(f"/api/v1/projects/{project_id}/reports/{run_id}.json")
    assert rep_json_resp.status_code == 200
    assert "report_sha256" in rep_json_resp.json()

    rep_md_resp = client.get(f"/api/v1/projects/{project_id}/reports/{run_id}.md")
    assert rep_md_resp.status_code == 200
    assert "# BranchTone Narrative Audio QA Audit Report" in rep_md_resp.text


def test_create_validation_run_default_payload():
    resp = client.post("/api/v1/projects/prj_direct_test/validation-runs", json={})
    assert resp.status_code == 201
    data = resp.json()
    assert data["status"] == "completed"
    assert data["total_findings"] >= 1
    assert any(f["finding_code"] == "BT-001" for f in data["findings"])
