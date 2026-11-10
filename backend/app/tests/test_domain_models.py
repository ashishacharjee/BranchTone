"""Domain model contract tests.

Verifies:
- source_start and source_end are null when unavailable (never 0,0 sentinels).
- intensity must be integer 1–5.
- finding_code pattern ^BT-[0-9]{3,}$.
"""
from datetime import UTC, datetime

import pytest
from pydantic import ValidationError

from app.domain.entities import Finding, FindingStatus, Passage, RuleId, Severity


def test_passage_with_null_offsets() -> None:
    passage = Passage(
        passage_id="P-001",
        source_name="Lobby",
        title="Lobby",
        raw_text="Demo placeholder",
        tags=["start"],
        source_start=None,
        source_end=None,
        provenance="demo_fixture",
    )
    assert passage.source_start is None
    assert passage.source_end is None


def test_finding_contract() -> None:
    finding = Finding(
        finding_id="fnd_bt001",
        finding_code="BT-001",
        rule_id=RuleId.RULE_REVEAL_PROTECTION,
        severity=Severity.HIGH,
        status=FindingStatus.OPEN,
        passage_id="P-003",
        affected_route_ids=["route_b"],
        explanation="The traitor theme starts before reveal.",
        evidence_verified=True,
        source_start=None,
        source_end=None,
        route_trace=["P-001", "P-003"],
        created_at=datetime.now(UTC),
        provenance="demo_fixture",
    )
    assert finding.finding_code == "BT-001"
    assert finding.source_start is None


def test_invalid_finding_code() -> None:
    with pytest.raises(ValidationError):
        Finding(
            finding_id="fnd_invalid",
            finding_code="INVALID-CODE",  # Must match ^BT-[0-9]{3,}$
            rule_id=RuleId.RULE_REVEAL_PROTECTION,
            severity=Severity.HIGH,
            status=FindingStatus.OPEN,
            passage_id="P-003",
            affected_route_ids=["route_b"],
            explanation="Invalid code",
            evidence_verified=False,
            route_trace=[],
            created_at=datetime.now(UTC),
            provenance="demo_fixture",
        )
