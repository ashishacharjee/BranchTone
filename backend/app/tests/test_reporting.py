"""Unit tests for JSON and Markdown report generation."""
from datetime import datetime, timezone
from app.domain.entities import (
    ExplorationStatus,
    Finding,
    FindingStatus,
    RuleId,
    Severity,
    SimulationRun,
    StoryVersion,
    ValidationRun,
)
from app.reporting.report_generator import generate_json_report, generate_markdown_report


def test_generate_json_and_markdown_reports():
    finding = Finding(
        finding_id="fnd_test_001",
        finding_code="BT-001",
        rule_id=RuleId.RULE_REVEAL_PROTECTION,
        severity=Severity.HIGH,
        status=FindingStatus.OPEN,
        passage_id="P-003",
        cue_id="cue_traitor",
        asset_id="traitor_theme.wav",
        affected_route_ids=["route_b"],
        explanation="Cue triggered before secret revealed.",
        evidence_quote="Sen crawls through vent.",
        evidence_verified=True,
        route_trace=["P-001", "P-003", "P-004", "P-005"],
        created_at=datetime.now(timezone.utc),
        provenance="backend_validation",
    )

    val_run = ValidationRun(
        run_id="run_test_123",
        project_id="prj_test",
        version_id="ver_test",
        simulation_id="sim_test",
        status="completed",
        total_findings=1,
        findings=[finding],
        rule_counts={"RULE_REVEAL_PROTECTION": 1},
        created_at=datetime.now(timezone.utc),
        provenance="backend_validation",
    )

    sim_run = SimulationRun(
        simulation_id="sim_test",
        project_id="prj_test",
        version_id="ver_test",
        exploration_status=ExplorationStatus.EXHAUSTIVE,
        routes=[],
        cue_events=[],
        states_explored=14,
        created_at=datetime.now(timezone.utc),
        provenance="backend_run",
    )

    story_ver = StoryVersion(
        version_id="ver_test",
        project_id="prj_test",
        version_label="v1.0",
        source_filename="test.twee",
        source_sha256="abc123sha",
        compilation_status="success",
    )

    # Test JSON report
    json_rep = generate_json_report(val_run, sim_run, story_ver)
    assert json_rep["project_id"] == "prj_test"
    assert json_rep["total_findings"] == 1
    assert "report_sha256" in json_rep
    assert json_rep["source_sha256"] == "abc123sha"

    # Test Markdown report
    md_rep = generate_markdown_report(val_run, sim_run, story_ver)
    assert "# BranchTone Narrative Audio QA Audit Report" in md_rep
    assert "BT-001" in md_rep
    assert "traitor_theme.wav" in md_rep
    assert "Sen crawls through vent." in md_rep
