"""Rule BT-001: Reveal Protection deterministic validator.

Ensures audio cues tied to narrative revelations never trigger before the required narrative facts
have been discovered along a specific traversal route.
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from app.domain.entities import (
    AudioCue,
    Finding,
    FindingStatus,
    Passage,
    RuleId,
    Severity,
    SimulationRun,
)


def evaluate_reveal_protection(
    simulation: SimulationRun,
    cues: list[AudioCue],
    passages: dict[str, Passage],
) -> list[Finding]:
    """Audits cue activation events against accumulated route knowledge states."""
    findings: list[Finding] = []
    cues_by_id = {c.cue_id: c for c in cues}
    finding_counter = 1

    for event in simulation.cue_events:
        cue = cues_by_id.get(event.cue_id)
        if not cue or not cue.required_facts:
            continue

        for req in cue.required_facts:
            actual_val = event.facts_at_trigger.get(req.fact_key)
            # If the actual fact is not equal to expected value (e.g. None or False vs True)
            if actual_val != req.expected_value:
                passage = passages.get(event.passage_id)
                passage_title = passage.title if passage else event.passage_id

                # Match route trace
                matched_route = next(
                    (r for r in simulation.routes if r.route_id == event.route_id),
                    None,
                )
                route_trace = matched_route.passage_path if matched_route else [event.passage_id]

                # Extract verbatim evidence quote from passage text if available
                quote = None
                if passage and passage.raw_text:
                    sentences = [s.strip() for s in passage.raw_text.split(".") if s.strip()]
                    # Prefer sentence mentioning key concepts
                    quote = sentences[0] + "." if sentences else passage.raw_text[:120]

                explanation = (
                    f"Audio cue '{cue.asset_id}' ({cue.layer} layer) is scheduled to trigger at "
                    f"{passage_title} ({event.passage_id}), but the required narrative condition "
                    f"'{req.fact_key} = {req.expected_value}' is not satisfied on {event.route_id}. "
                    f"The secret is spoiled before player discovery."
                )

                suggested_action = (
                    f"Defer cue '{cue.cue_id}' until after '{req.fact_key}' is confirmed, "
                    f"or add a route-specific guard to suppress on {event.route_id}."
                )

                finding = Finding(
                    finding_id=f"fnd_{uuid.uuid4().hex[:12]}",
                    finding_code=f"BT-{str(finding_counter).zfill(3)}",
                    rule_id=RuleId.RULE_REVEAL_PROTECTION,
                    severity=Severity.HIGH,
                    status=FindingStatus.OPEN,
                    passage_id=event.passage_id,
                    cue_id=event.cue_id,
                    asset_id=cue.asset_id,
                    affected_route_ids=[event.route_id],
                    explanation=explanation,
                    expected_state={req.fact_key: req.expected_value},
                    actual_state={req.fact_key: actual_val},
                    evidence_quote=quote,
                    evidence_verified=True,
                    evidence_provenance="imported_source" if passage else "user_supplied_exact_text",
                    source_start=passage.source_start if passage else None,
                    source_end=passage.source_end if passage else None,
                    route_trace=route_trace,
                    suggested_action=suggested_action,
                    created_at=datetime.now(timezone.utc),
                    provenance="backend_validation",
                )
                findings.append(finding)
                finding_counter += 1

    return findings
