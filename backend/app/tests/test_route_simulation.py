"""Unit tests for directed story graph route simulation."""
import pytest
from app.compiler.story_compiler import compile_story_ir
from app.domain.entities import (
    AudioCue,
    ExplorationStatus,
    PassageEntryTrigger,
    RequiredFact,
)
from app.graph.route_simulator import simulate_routes
from app.graph.story_graph import StoryGraph
from app.ingestion.parser import parse_twee_source

TWEE_SOURCE = """\
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


def test_simulate_routes_branching_and_fact_isolation():
    parse_res = parse_twee_source(TWEE_SOURCE)
    ir = compile_story_ir(parse_res, project_id="prj_branchtone")
    graph = StoryGraph(ir.passages, ir.edges, ir.mutations)

    # Configure a reveal cue on Air Vent (P-003) requiring conspirator_revealed == True
    cue_bt001 = AudioCue(
        cue_id="cue_traitor_theme",
        asset_id="ast_traitor_wav",
        layer="music",
        trigger=PassageEntryTrigger(passage_id="P-003"),
        required_facts=[RequiredFact(fact_key="conspirator_revealed", expected_value=True)],
        stop_policy="end_of_passage",
        provenance="creator_config",
    )

    sim = simulate_routes(graph, cues=[cue_bt001], project_id="prj_branchtone")

    assert sim.exploration_status == ExplorationStatus.EXHAUSTIVE
    assert len(sim.routes) == 2  # Route A through Archives, Route B through Air Vent

    # Find the route passing through Air Vent (P-003)
    vent_route = next(r for r in sim.routes if "P-003" in r.passage_path)
    assert vent_route.passage_path == ["P-001", "P-003", "P-004", "P-005"]

    # Find the route passing through Archives (P-002)
    archives_route = next(r for r in sim.routes if "P-002" in r.passage_path)
    assert archives_route.passage_path == ["P-001", "P-002", "P-004", "P-005"]

    # Verify fact isolation at Air Vent step
    vent_step = next(s for s in vent_route.trace if s.passage_id == "P-003")
    assert vent_step.facts_before_entry.get("conspirator_revealed") is not True

    # Verify fact present on Archives route after Archives step
    vault_step_archives = next(s for s in archives_route.trace if s.passage_id == "P-004")
    assert vault_step_archives.facts_before_entry.get("conspirator_revealed") is True

    # Verify cue activation event fired at Air Vent
    cue_events = [evt for evt in sim.cue_events if evt.cue_id == "cue_traitor_theme"]
    assert len(cue_events) == 1
    assert cue_events[0].passage_id == "P-003"
    assert cue_events[0].facts_at_trigger.get("conspirator_revealed") is not True


def test_simulate_routes_cycle_termination():
    cycle_twee = """:: Room A [entry]
[[Go to B->Room B]]
:: Room B
[[Back to A->Room A]]
"""
    parse_res = parse_twee_source(cycle_twee)
    ir = compile_story_ir(parse_res, project_id="prj_cycle")
    graph = StoryGraph(ir.passages, ir.edges)

    sim = simulate_routes(graph, cues=[], project_id="prj_cycle", max_depth=10)
    assert len(sim.routes) > 0
    assert any("Cycle detected" in w for w in sim.warnings)
