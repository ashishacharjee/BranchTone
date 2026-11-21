"""Unit tests for Queue-based BFS route exploration engine and budgets."""
import pytest
from app.compiler.story_compiler import compile_story_ir
from app.domain.entities import ExplorationStatus
from app.graph.route_simulator import ExplorationBudget, simulate_routes_bfs
from app.graph.story_graph import StoryGraph
from app.ingestion.parser import parse_story_source

INK_BRANCHING_STORY = """\
VAR key_found = false

=== Entrance ===
# entry
You stand before two doors.
* [Open Left Door] -> LeftRoom
* [Open Right Door] -> RightRoom

=== LeftRoom ===
~ key_found = true
You pick up the gold key.
-> Vault

=== RightRoom ===
The room is empty.
-> Vault

=== Vault ===
# climax
The inner vault door.
-> Exit

=== Exit ===
# resolution
You escaped.
-> END
"""


def test_bfs_explores_distinct_knowledge_states_at_same_passage():
    parse_res = parse_story_source(INK_BRANCHING_STORY, filename="story.ink")
    ir = compile_story_ir(parse_res, project_id="prj_bfs_test")
    graph = StoryGraph(ir.passages, ir.edges, ir.mutations)

    budget = ExplorationBudget(max_depth=20, max_routes=10, max_states=100)
    sim, telemetry = simulate_routes_bfs(graph, cues=[], budget=budget, project_id="prj_bfs_test")

    assert sim.exploration_status == ExplorationStatus.EXHAUSTIVE
    assert len(sim.routes) == 2  # Left path and Right path
    assert telemetry.routes_discovered == 2
    assert telemetry.budget_exhausted is False

    # Vault is reached in both routes, but with different key_found states!
    left_route = next(r for r in sim.routes if "pas_leftroom" in r.passage_path)
    right_route = next(r for r in sim.routes if "pas_rightroom" in r.passage_path)

    vault_step_left = next(s for s in left_route.trace if s.passage_id == "pas_vault")
    vault_step_right = next(s for s in right_route.trace if s.passage_id == "pas_vault")

    assert vault_step_left.facts_before_entry.get("key_found") is True
    assert vault_step_right.facts_before_entry.get("key_found") is not True


def test_bfs_budget_exhaustion_marks_bounded():
    parse_res = parse_story_source(INK_BRANCHING_STORY, filename="story.ink")
    ir = compile_story_ir(parse_res, project_id="prj_budget_test")
    graph = StoryGraph(ir.passages, ir.edges, ir.mutations)

    # Set very tight depth limit (depth 2 will truncate before Vault/Exit)
    budget = ExplorationBudget(max_depth=2, max_routes=10, max_states=100)
    sim, telemetry = simulate_routes_bfs(graph, cues=[], budget=budget, project_id="prj_budget_test")

    assert sim.exploration_status == ExplorationStatus.BOUNDED
    assert telemetry.budget_exhausted is True
    assert telemetry.truncated_branches > 0
