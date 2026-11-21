"""Deterministic Validation Suite Evaluator for BranchTone.

Orchestrates all domain validation rules and aggregates findings into a canonical ValidationRun.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.domain.entities import (
    AudioCue,
    Finding,
    NarrativeAnnotation,
    Passage,
    SimulationRun,
    ValidationRun,
)
from app.rules.cue_coverage import evaluate_cue_coverage
from app.rules.emotional_continuity import (
    evaluate_emotional_continuity,
    evaluate_tension_lifecycle,
)
from app.rules.reveal_protection import evaluate_reveal_protection


def run_validation_suite(
    simulation: SimulationRun,
    cues: list[AudioCue],
    passages: dict[str, Passage],
    annotations: list[NarrativeAnnotation] | None = None,
) -> ValidationRun:
    """Executes all deterministic rules against a completed simulation run."""
    all_findings: list[Finding] = []

    # 1. Rule BT-001: Reveal Protection
    all_findings.extend(evaluate_reveal_protection(simulation, cues, passages))

    # 2. Rule BT-002: Required Cue Coverage
    all_findings.extend(evaluate_cue_coverage(simulation, cues, passages, annotations))

    # 3. Rule BT-003: Tension Lifecycle
    all_findings.extend(evaluate_tension_lifecycle(simulation, passages, annotations))

    # 4. Rule BT-004: Emotional Continuity
    all_findings.extend(evaluate_emotional_continuity(simulation, passages, annotations))

    # Deduplicate findings by (rule_id, cue_id, tuple(affected_route_ids), passage_id)
    seen_keys: set[tuple[str, str | None, tuple[str, ...], str]] = set()
    deduped_findings: list[Finding] = []

    for f in all_findings:
        key = (f.rule_id, f.cue_id, tuple(sorted(f.affected_route_ids)), f.passage_id)
        if key not in seen_keys:
            seen_keys.add(key)
            deduped_findings.append(f)

    # Calculate rule counts
    rule_counts: dict[str, int] = {}
    for f in deduped_findings:
        rule_counts[f.rule_id] = rule_counts.get(f.rule_id, 0) + 1

    return ValidationRun(
        run_id=f"run_{uuid.uuid4().hex[:12]}",
        project_id=simulation.project_id,
        version_id=simulation.version_id,
        simulation_id=simulation.simulation_id,
        status="completed",
        total_findings=len(deduped_findings),
        findings=deduped_findings,
        rule_counts=rule_counts,
        created_at=datetime.now(timezone.utc),
        provenance="backend_validation",
    )
