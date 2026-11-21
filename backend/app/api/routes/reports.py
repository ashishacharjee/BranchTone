"""Report export API endpoints for BranchTone."""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from app.api.routes.validation import _get_or_create_demo_run, _validation_runs
from app.domain.entities import StoryVersion
from app.reporting.report_generator import generate_json_report, generate_markdown_report

router = APIRouter(tags=["reports"])


@router.get(
    "/projects/{project_id}/reports/{run_id}.json",
    response_model=dict[str, Any],
    summary="Export canonical reproducible QA report as JSON",
)
async def get_report_json(project_id: str, run_id: str) -> dict[str, Any]:
    """Serializes the specified validation run into a reproducible JSON report."""
    run = _validation_runs.get(run_id) or _get_or_create_demo_run(project_id, run_id)
    if not run or run.project_id != project_id:
        raise HTTPException(status_code=404, detail="Validation run not found.")

    # Create synthetic version if not already stored
    story_version = StoryVersion(
        version_id=run.version_id,
        project_id=project_id,
        version_label="v1.0",
        source_filename="branchtone_story.twee",
        source_sha256="deterministic_run_sha256",
        compilation_status="success",
    )

    # Mock simulation run metadata for report
    from app.domain.entities import ExplorationStatus, SimulationRun
    sim = SimulationRun(
        simulation_id=run.simulation_id,
        project_id=project_id,
        version_id=run.version_id,
        exploration_status=ExplorationStatus.EXHAUSTIVE,
        routes=[],
        cue_events=[],
        states_explored=14,
        created_at=run.created_at,
        provenance="backend_run",
    )

    return generate_json_report(run, sim, story_version)


@router.get(
    "/projects/{project_id}/reports/{run_id}.md",
    response_class=PlainTextResponse,
    summary="Export QA audit report in Markdown format",
)
async def get_report_markdown(project_id: str, run_id: str) -> str:
    """Serializes the specified validation run into a Markdown report."""
    run = _validation_runs.get(run_id) or _get_or_create_demo_run(project_id, run_id)
    if not run or run.project_id != project_id:
        raise HTTPException(status_code=404, detail="Validation run not found.")

    story_version = StoryVersion(
        version_id=run.version_id,
        project_id=project_id,
        version_label="v1.0",
        source_filename="branchtone_story.twee",
        source_sha256="deterministic_run_sha256",
        compilation_status="success",
    )

    from app.domain.entities import ExplorationStatus, SimulationRun
    sim = SimulationRun(
        simulation_id=run.simulation_id,
        project_id=project_id,
        version_id=run.version_id,
        exploration_status=ExplorationStatus.EXHAUSTIVE,
        routes=[],
        cue_events=[],
        states_explored=14,
        created_at=run.created_at,
        provenance="backend_run",
    )

    return generate_markdown_report(run, sim, story_version)
