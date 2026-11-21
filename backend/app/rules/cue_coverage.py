"""Rule BT-002: Required Cue Coverage deterministic validator."""
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


def evaluate_cue_coverage(
    simulation: SimulationRun,
    cues: list[AudioCue],
    passages: dict[str, Passage],
    annotations: list[NarrativeAnnotation] | None = None,
) -> list[Finding]:
    """Audits story passages for missing audio cues during climactic or high-intensity scenes."""
    findings: list[Finding] = []
    cues_by_passage: dict[str, list[AudioCue]] = {}
    for c in cues:
        if c.trigger.type == "passage_entry":
            cues_by_passage.setdefault(c.trigger.passage_id, []).append(c)

    intensity_by_passage: dict[str, int] = {}
    if annotations:
        for ann in annotations:
            if ann.intensity:
                intensity_by_passage[ann.passage_id] = ann.intensity

    # Check passages tagged climax/suspense or intensity >= 4 that lack music cues
    finding_counter = 100
    for pid, passage in passages.items():
        intensity = intensity_by_passage.get(pid, 1)
        is_high_tension = intensity >= 4 or "climax" in passage.tags or "suspense" in passage.tags
        p_cues = cues_by_passage.get(pid, [])
        has_music = any(c.layer == "music" for c in p_cues)

        # If intentional silence is flagged on the passage, respect it
        has_intentional_silence = any(c.intentional for c in p_cues)
        if is_high_tension and not has_music and not has_intentional_silence:
            # High tension scene with unconfigured music
            finding = Finding(
                finding_id=f"fnd_{uuid.uuid4().hex[:12]}",
                finding_code=f"BT-{str(finding_counter).zfill(3)}",
                rule_id=RuleId.RULE_REQUIRED_CUE_COVERAGE,
                severity=Severity.MEDIUM,
                status=FindingStatus.OPEN,
                passage_id=pid,
                cue_id=None,
                asset_id=None,
                affected_route_ids=[r.route_id for r in simulation.routes if pid in r.passage_path],
                explanation=(
                    f"Passage '{passage.title}' ({pid}) has high emotional tension (intensity {intensity}) "
                    "but lacks an active music cue or explicit intentional silence marker."
                ),
                expected_state={"music_cue_assigned": True},
                actual_state={"music_cue_assigned": False},
                evidence_quote=passage.raw_text[:120] if passage.raw_text else None,
                evidence_verified=True,
                evidence_provenance="imported_source",
                source_start=passage.source_start,
                source_end=passage.source_end,
                route_trace=[pid],
                suggested_action=f"Assign an audio asset to '{passage.title}' or mark layer as intentional silence.",
                created_at=datetime.now(timezone.utc),
                provenance="backend_validation",
            )
            findings.append(finding)
            finding_counter += 1

    return findings
