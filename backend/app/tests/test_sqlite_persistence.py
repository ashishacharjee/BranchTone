"""Automated tests for BranchTone SQLite persistence layer and server restart recovery."""
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

import pytest
from app.db.repository import SQLiteRepository
from app.domain.entities import (
    AudioAsset,
    Finding,
    FindingStatus,
    Project,
    RuleId,
    Severity,
    SimulationRun,
    ValidationRun,
)


@pytest.fixture
def test_repo(tmp_path) -> SQLiteRepository:
    db_file = tmp_path / "test_persistence.db"
    return SQLiteRepository(db_path=db_file)


def test_project_persistence(test_repo: SQLiteRepository):
    now = datetime.now(timezone.utc)
    project = Project(
        project_id="prj_test_persist",
        name="Persistence Test Project",
        description="Verifies DB writes",
        current_version_id="ver_01",
        created_at=now,
        updated_at=now,
    )
    test_repo.save_project(project)

    with test_repo.get_connection() as conn:
        row = conn.execute("SELECT * FROM projects WHERE project_id = ?", ("prj_test_persist",)).fetchone()
        assert row is not None
        assert row["name"] == "Persistence Test Project"


def test_audio_asset_persistence(test_repo: SQLiteRepository):
    asset = AudioAsset(
        asset_id="ast_persist_01",
        project_id="prj_test_persist",
        filename="theme_combat.wav",
        media_type="music",
        mime_type="audio/wav",
        duration_seconds=12.5,
        sample_rate_hz=48000,
        channels=2,
        size_bytes=1200000,
        storage_key="prj_test_persist/ast_persist_01_theme_combat.wav",
        sha256="a" * 64,
        status="available",
        provenance="uploaded_asset",
    )
    test_repo.save_audio_asset(asset)

    retrieved = test_repo.get_audio_asset("ast_persist_01")
    assert retrieved is not None
    assert retrieved.filename == "theme_combat.wav"
    assert retrieved.duration_seconds == 12.5
    assert retrieved.sample_rate_hz == 48000
    assert retrieved.channels == 2

    asset_list = test_repo.list_audio_assets("prj_test_persist")
    assert len(asset_list) == 1
    assert asset_list[0].asset_id == "ast_persist_01"


def test_validation_run_and_finding_lifecycle(test_repo: SQLiteRepository):
    now = datetime.now(timezone.utc)
    finding = Finding(
        finding_id="fnd_test_001",
        finding_code="BT-001",
        rule_id=RuleId.RULE_REVEAL_PROTECTION,
        severity=Severity.HIGH,
        status=FindingStatus.OPEN,
        passage_id="P-003",
        cue_id="cue_traitor_theme",
        asset_id="traitor_theme.wav",
        affected_route_ids=["route_b"],
        explanation="Traitor cue triggered before revelation.",
        expected_state={"traitor_revealed": True},
        actual_state={"traitor_revealed": False},
        evidence_quote="Sen enters the air vent without knowing the truth.",
        evidence_verified=True,
        evidence_provenance="user_supplied_exact_text",
        source_start=100,
        source_end=150,
        route_trace=["P-001", "P-003"],
        suggested_action="Gate cue behind revelation fact.",
        created_at=now,
        provenance="backend_validation",
    )

    val_run = ValidationRun(
        run_id="run_val_test_001",
        project_id="prj_test_persist",
        version_id="ver_01",
        simulation_id="sim_01",
        status="completed",
        total_findings=1,
        findings=[finding],
        rule_counts={"RULE_REVEAL_PROTECTION": 1},
        created_at=now,
        provenance="backend_validation",
    )

    test_repo.save_validation_run(val_run)

    # Fetch run
    fetched = test_repo.get_validation_run("run_val_test_001")
    assert fetched is not None
    assert fetched.total_findings == 1
    assert len(fetched.findings) == 1
    assert fetched.findings[0].finding_code == "BT-001"
    assert fetched.findings[0].status == FindingStatus.OPEN

    # Update finding triage status
    updated = test_repo.update_finding_status("fnd_test_001", FindingStatus.RESOLVED)
    assert updated is not None
    assert updated.status == FindingStatus.RESOLVED

    # Verify update in run fetch
    fetched_again = test_repo.get_validation_run("run_val_test_001")
    assert fetched_again is not None
    assert fetched_again.findings[0].status == FindingStatus.RESOLVED


def test_persistence_survives_repo_restart(tmp_path):
    db_file = tmp_path / "restart_test.db"
    now = datetime.now(timezone.utc)

    # First session: insert records
    repo1 = SQLiteRepository(db_path=db_file)
    finding = Finding(
        finding_id="fnd_survive_01",
        finding_code="BT-002",
        rule_id=RuleId.RULE_REQUIRED_CUE_COVERAGE,
        severity=Severity.MEDIUM,
        status=FindingStatus.ACCEPTED_RISK,
        passage_id="P-002",
        affected_route_ids=["route_a"],
        explanation="Missing cue in Archives passage.",
        evidence_verified=False,
        route_trace=["P-001", "P-002"],
        created_at=now,
        provenance="backend_validation",
    )
    val_run = ValidationRun(
        run_id="run_survive_01",
        project_id="prj_restart",
        version_id="ver_restart",
        simulation_id="sim_restart",
        status="completed",
        total_findings=1,
        findings=[finding],
        rule_counts={"RULE_REQUIRED_CUE_COVERAGE": 1},
        created_at=now,
        provenance="backend_validation",
    )
    repo1.save_validation_run(val_run)

    # Second session: simulate server restart with new connection to same DB file
    repo2 = SQLiteRepository(db_path=db_file)
    recovered_run = repo2.get_validation_run("run_survive_01")

    assert recovered_run is not None
    assert recovered_run.run_id == "run_survive_01"
    assert recovered_run.findings[0].finding_id == "fnd_survive_01"
    assert recovered_run.findings[0].status == FindingStatus.ACCEPTED_RISK
