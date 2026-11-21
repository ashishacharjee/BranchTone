"""Unit tests for deterministic validation engine and Rule BT-001."""
import pytest
from app.compiler.story_compiler import compile_story_ir
from app.domain.entities import (
    AudioCue,
    FindingStatus,
    PassageEntryTrigger,
    RequiredFact,
    RuleId,
    Severity,
)
from app.graph.route_simulator import simulate_routes
from app.graph.story_graph import StoryGraph
from app.ingestion.parser import parse_twee_source
from app.rules.evaluator import run_validation_suite

TWEE_TEST_MISSION = """\
:: P-001 Lobby [entry]
Atrium entrance.
[[Search Archives->P-002 Archives]]
[[Climb Vent->P-003 Air Vent]]

:: P-002 Archives [stealth]
(set: $conspirator_revealed to true)
Sen uncovers the conspirator dossier in desk 4.
[[Go to Vault->P-004 Server Vault]]

:: P-003 Air Vent [suspense]
Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy.
[[Drop into Vault->P-004 Server Vault]]

:: P-004 Server Vault [climax]
Mainframe terminal.
[[Escape->P-005 Safe House]]

:: P-005 Safe House [resolution]
Mission complete.
"""


def test_bt001_reveal_protection_dynamically_detected():
    parse_res = parse_twee_source(TWEE_TEST_MISSION)
    ir = compile_story_ir(parse_res, project_id="prj_val_test")
    graph = StoryGraph(ir.passages, ir.edges, ir.mutations)

    # Audio cue 'traitor_theme.wav' scheduled at Air Vent (P-003), requiring conspirator_revealed == True
    cue_traitor = AudioCue(
        cue_id="cue_bt001_traitor",
        asset_id="traitor_theme.wav",
        layer="music",
        trigger=PassageEntryTrigger(passage_id="P-003"),
        required_facts=[RequiredFact(fact_key="conspirator_revealed", expected_value=True)],
        stop_policy="end_of_passage",
        provenance="creator_config",
    )

    passages_dict = {p.passage_id: p for p in ir.passages}
    sim = simulate_routes(graph, cues=[cue_traitor], project_id="prj_val_test")

    # Run validation suite
    val_run = run_validation_suite(sim, cues=[cue_traitor], passages=passages_dict)

    assert val_run.status == "completed"
    assert val_run.total_findings >= 1

    # Find the BT-001 finding
    bt001 = next((f for f in val_run.findings if f.rule_id == RuleId.RULE_REVEAL_PROTECTION), None)
    assert bt001 is not None
    assert bt001.finding_code == "BT-001"
    assert bt001.severity == Severity.HIGH
    assert bt001.passage_id == "P-003"
    assert bt001.cue_id == "cue_bt001_traitor"
    assert bt001.asset_id == "traitor_theme.wav"
    assert "conspirator_revealed" in bt001.explanation
    assert bt001.status == FindingStatus.OPEN

    # Evidence quote extracted verbatim from P-003 text
    assert bt001.evidence_quote is not None
    assert "dark metal duct" in bt001.evidence_quote


def test_negative_control_route_a_passes_cleanly():
    parse_res = parse_twee_source(TWEE_TEST_MISSION)
    ir = compile_story_ir(parse_res, project_id="prj_clean")
    graph = StoryGraph(ir.passages, ir.edges, ir.mutations)

    # Audio cue scheduled at Server Vault (P-004), requiring conspirator_revealed == True
    # When traversing via Route A (Archives), conspirator_revealed IS true!
    cue_vault = AudioCue(
        cue_id="cue_vault_reveal",
        asset_id="vault_reveal.wav",
        layer="music",
        trigger=PassageEntryTrigger(passage_id="P-004"),
        required_facts=[RequiredFact(fact_key="conspirator_revealed", expected_value=True)],
        stop_policy="end_of_passage",
        provenance="creator_config",
    )

    passages_dict = {p.passage_id: p for p in ir.passages}
    sim = simulate_routes(graph, cues=[cue_vault], project_id="prj_clean")

    val_run = run_validation_suite(sim, cues=[cue_vault], passages=passages_dict)

    # Route A (through Archives) should NOT trigger a violation for Route A
    route_a = next(r for r in sim.routes if "P-002" in r.passage_path)
    route_a_violations = [
        f for f in val_run.findings
        if f.rule_id == RuleId.RULE_REVEAL_PROTECTION and route_a.route_id in f.affected_route_ids
    ]
    assert len(route_a_violations) == 0
