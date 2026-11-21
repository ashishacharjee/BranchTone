"""Validation run API endpoints for BranchTone."""
from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.db.repository import sqlite_repo
from app.domain.entities import (
    AudioCue,
    Finding,
    FindingStatus,
    NarrativeAnnotation,
    Passage,
    SimulationRun,
    ValidationRun,
)
from app.rules.evaluator import run_validation_suite

router = APIRouter(tags=["validation"])

# In-memory storage for runs and findings
_validation_runs: dict[str, ValidationRun] = {}
_findings_by_id: dict[str, Finding] = {}


def _get_or_create_demo_run(project_id: str, run_id: str) -> ValidationRun | None:
    if run_id in _validation_runs:
        return _validation_runs[run_id]
    if run_id == "run_the_last_signal_demo_v1" or "demo" in run_id:
        from datetime import datetime, timezone
        demo_finding = Finding(
            finding_id="fnd_bt001_route_b_p003_demo",
            finding_code="BT-001",
            rule_id="RULE_REVEAL_PROTECTION",
            severity="high",
            status="open",
            passage_id="P-003",
            cue_id="cue_traitor_theme",
            asset_id="traitor_theme.wav",
            affected_route_ids=["route_b"],
            explanation="The traitor theme starts when entering Air Vent, before the character's identity is revealed on this route.",
            expected_state={"traitor_identity_revealed": True},
            actual_state={"traitor_identity_revealed": False},
            evidence_quote="Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy.",
            evidence_verified=True,
            evidence_provenance="user_supplied_exact_text",
            source_start=138,
            source_end=260,
            route_trace=["P-001", "P-003"],
            suggested_action="Change cue trigger to Server Vault (P-004) or gate behind traitor_identity_revealed == true.",
            created_at=datetime.now(timezone.utc),
            provenance="demo_fixture",
        )
        demo_run = ValidationRun(
            run_id=run_id,
            project_id=project_id,
            version_id="ver_the_last_signal_v04",
            simulation_id="sim_the_last_signal_demo_v1",
            status="completed",
            total_findings=1,
            findings=[demo_finding],
            rule_counts={
                "RULE_REVEAL_PROTECTION": 1,
                "RULE_REQUIRED_CUE_COVERAGE": 0,
                "RULE_TENSION_LIFECYCLE": 0,
                "RULE_EMOTIONAL_CONTINUITY": 0,
            },
            created_at=datetime.now(timezone.utc),
            provenance="demo_fixture",
        )
        _validation_runs[run_id] = demo_run
        _findings_by_id[demo_finding.finding_id] = demo_finding
        _findings_by_id["BT-001"] = demo_finding
        sqlite_repo.save_validation_run(demo_run)
        return demo_run
    return None


class ValidationRunRequest(BaseModel):
    simulation: SimulationRun | None = None
    cues: list[AudioCue] = Field(default_factory=list)
    passages: list[Passage] = Field(default_factory=list)
    annotations: list[NarrativeAnnotation] = Field(default_factory=list)


class UpdateFindingStatusRequest(BaseModel):
    status: FindingStatus


@router.post(
    "/projects/{project_id}/validation-runs",
    response_model=ValidationRun,
    status_code=201,
    summary="Execute deterministic validation suite on simulation run",
)
async def create_validation_run(
    project_id: str,
    payload: ValidationRunRequest = ValidationRunRequest(),
) -> ValidationRun:
    """Executes deterministic validation rules and records findings."""
    simulation = payload.simulation
    passages = payload.passages
    cues = payload.cues

    if simulation is None or not passages:
        from app.compiler.story_compiler import compile_story_ir
        from app.domain.entities import PassageEntryTrigger, RequiredFact
        from app.graph.route_simulator import ExplorationBudget, simulate_routes_bfs
        from app.graph.story_graph import StoryGraph
        from app.ingestion.parser import parse_twee_source

        demo_twee = """\
:: P-001 Lobby [entry]
Atrium entrance.
[[Search Archives->P-002 Archives]]
[[Climb Vent->P-003 Air Vent]]

:: P-002 Archives [stealth]
(set: $conspirator_revealed to true)
Found the traitor file.
[[Access Vault->P-004 Server Vault]]

:: P-003 Air Vent [suspense]
Crawl through the metal duct.
[[Drop into Vault->P-004 Server Vault]]

:: P-004 Server Vault [climax]
Data terminal.
[[Escape->P-005 Safe House]]

:: P-005 Safe House [resolution]
Mission success.
"""
        parse_res = parse_twee_source(demo_twee)
        ir = compile_story_ir(parse_res, project_id=project_id)
        passages = ir.passages
        if not cues:
            cues = [
                AudioCue(
                    cue_id="cue_traitor_theme",
                    asset_id="traitor_theme.wav",
                    layer="music",
                    trigger=PassageEntryTrigger(passage_id="P-003"),
                    required_facts=[RequiredFact(fact_key="conspirator_revealed", expected_value=True)],
                    stop_policy="end_of_passage",
                    provenance="creator_config",
                )
            ]
        graph = StoryGraph(passages=passages, edges=ir.edges, mutations=ir.mutations)
        sim_run, _ = simulate_routes_bfs(
            story_graph=graph,
            cues=cues,
            annotations=payload.annotations,
            budget=ExplorationBudget(),
            project_id=project_id,
        )
        simulation = sim_run

    passages_dict = {p.passage_id: p for p in passages}
    run = run_validation_suite(
        simulation=simulation,
        cues=cues,
        passages=passages_dict,
        annotations=payload.annotations,
    )
    _validation_runs[run.run_id] = run
    for f in run.findings:
        _findings_by_id[f.finding_id] = f

    sqlite_repo.save_validation_run(run)
    return run


@router.get(
    "/projects/{project_id}/validation-runs/{run_id}",
    response_model=ValidationRun,
    summary="Fetch validation run results and findings",
)
async def get_validation_run(project_id: str, run_id: str) -> ValidationRun:
    """Retrieves an existing validation run by ID."""
    run = _validation_runs.get(run_id) or sqlite_repo.get_validation_run(run_id) or _get_or_create_demo_run(project_id, run_id)
    if not run or run.project_id != project_id:
        raise HTTPException(status_code=404, detail="Validation run not found.")
    _validation_runs[run_id] = run
    for f in run.findings:
        _findings_by_id[f.finding_id] = f
    return run


@router.patch(
    "/projects/{project_id}/findings/{finding_id}",
    response_model=Finding,
    summary="Update finding triage status (resolve, accept risk, false positive)",
)
async def update_finding_status(
    project_id: str,
    finding_id: str,
    payload: UpdateFindingStatusRequest,
) -> Finding:
    """Updates the status of a specific finding."""
    # Ensure demo runs are populated if finding is the demo finding
    if finding_id not in _findings_by_id:
        _get_or_create_demo_run(project_id, "run_the_last_signal_demo_v1")

    finding = _findings_by_id.get(finding_id) or sqlite_repo.get_finding(finding_id)
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found.")

    updated_finding = finding.model_copy(update={"status": payload.status})
    _findings_by_id[finding_id] = updated_finding
    sqlite_repo.update_finding_status(finding_id, payload.status)

    # Update in run record as well
    for run in _validation_runs.values():
        for i, f in enumerate(run.findings):
            if f.finding_id == finding_id:
                run.findings[i] = updated_finding

    return updated_finding
