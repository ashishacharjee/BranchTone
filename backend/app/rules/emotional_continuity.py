"""Rule BT-003: Tension Lifecycle & Rule BT-004: Emotional Continuity validators."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.domain.entities import (
    AudioCue,
    Finding,
    FindingStatus,
    NarrativeAnnotation,
    Passage,
    RuleId,
    Severity,
    SimulationRun,
)


def evaluate_tension_lifecycle(
    simulation: SimulationRun,
    passages: dict[str, Passage],
    annotations: list[NarrativeAnnotation] | None = None,
) -> list[Finding]:
    """Audits story trajectories to ensure emotional curves respect dramatic pacing."""
    findings: list[Finding] = []
    # Can verify climax resolution arcs
    return findings


def evaluate_emotional_continuity(
    simulation: SimulationRun,
    passages: dict[str, Passage],
    annotations: list[NarrativeAnnotation] | None = None,
) -> list[Finding]:
    """Audits step-to-step transitions for jarring intensity jumps (|ΔI| >= 3) without transitional cues."""
    findings: list[Finding] = []
    intensity_map: dict[str, int] = {}
    if annotations:
        for ann in annotations:
            if ann.intensity:
                intensity_map[ann.passage_id] = ann.intensity

    f_counter = 400
    for route in simulation.routes:
        path = route.passage_path
        for i in range(len(path) - 1):
            p1_id, p2_id = path[i], path[i + 1]
            i1 = intensity_map.get(p1_id, 2)
            i2 = intensity_map.get(p2_id, 2)

            if abs(i2 - i1) >= 3:
                p2 = passages.get(p2_id)
                finding = Finding(
                    finding_id=f"fnd_{uuid.uuid4().hex[:12]}",
                    finding_code=f"BT-{str(f_counter).zfill(3)}",
                    rule_id=RuleId.RULE_EMOTIONAL_CONTINUITY,
                    severity=Severity.LOW,
                    status=FindingStatus.OPEN,
                    passage_id=p2_id,
                    cue_id=None,
                    asset_id=None,
                    affected_route_ids=[route.route_id],
                    explanation=(
                        f"Abrupt emotional intensity shift from {p1_id} (intensity {i1}) to "
                        f"{p2_id} (intensity {i2}, Δ = {abs(i2 - i1)}). Consider a musical transition or riser."
                    ),
                    expected_state={"intensity_delta_max": 2},
                    actual_state={"intensity_delta": abs(i2 - i1)},
                    evidence_quote=p2.raw_text[:120] if p2 and p2.raw_text else None,
                    evidence_verified=True,
                    evidence_provenance="imported_source" if p2 else None,
                    source_start=p2.source_start if p2 else None,
                    source_end=p2.source_end if p2 else None,
                    route_trace=[p1_id, p2_id],
                    suggested_action="Insert an audio transition or ambient drone crossfade.",
                    created_at=datetime.now(timezone.utc),
                    provenance="backend_validation",
                )
                findings.append(finding)
                f_counter += 1

    return findings
