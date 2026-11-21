"""Route simulation API endpoint for BranchTone."""
from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.domain.entities import (
    AudioCue,
    NarrativeAnnotation,
    Passage,
    SimulationRun,
    StateMutation,
    StoryEdge,
)
from app.graph.route_simulator import simulate_routes
from app.graph.story_graph import StoryGraph

router = APIRouter(tags=["simulation"])


class SimulateRequest(BaseModel):
    version_id: str = Field(default="ver_the_last_signal_v04")
    passages: list[Passage] = Field(default_factory=list)
    edges: list[StoryEdge] = Field(default_factory=list)
    mutations: list[StateMutation] = Field(default_factory=list)
    cues: list[AudioCue] = Field(default_factory=list)
    annotations: list[NarrativeAnnotation] = Field(default_factory=list)
    max_depth: int = Field(default=50, ge=1, le=2000)
    max_routes: int = Field(default=50, ge=1, le=1000)
    max_states: int = Field(default=1000, ge=1, le=50000)
    max_time_seconds: float = Field(default=5.0, ge=0.1, le=60.0)


CANONICAL_DEMO_TWEE = """\
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


@router.post(
    "/projects/{project_id}/simulate",
    response_model=SimulationRun,
    status_code=200,
    summary="Simulate branching routes using BFS and evaluate fact state propagation",
)
async def run_simulation(
    project_id: str,
    payload: SimulateRequest,
) -> SimulationRun:
    """Constructs a StoryGraph and executes queue-based BFS route traversal simulation."""
    from app.compiler.story_compiler import compile_story_ir
    from app.domain.entities import PassageEntryTrigger, RequiredFact
    from app.graph.route_simulator import ExplorationBudget, simulate_routes_bfs
    from app.ingestion.parser import parse_twee_source

    passages = payload.passages
    edges = payload.edges
    mutations = payload.mutations
    cues = payload.cues

    # Fallback to canonical demo story if passages/edges were omitted
    if not passages or not edges:
        parse_res = parse_twee_source(CANONICAL_DEMO_TWEE)
        ir = compile_story_ir(parse_res, project_id=project_id)
        passages = ir.passages
        edges = ir.edges
        mutations = ir.mutations
        if not cues:
            cues = [
                AudioCue(
                    cue_id="cue_traitor_theme",
                    asset_id="ast_traitor_wav",
                    layer="music",
                    trigger=PassageEntryTrigger(passage_id="P-003"),
                    required_facts=[RequiredFact(fact_key="conspirator_revealed", expected_value=True)],
                    stop_policy="end_of_passage",
                    provenance="creator_config",
                )
            ]

    graph = StoryGraph(
        passages=passages,
        edges=edges,
        mutations=mutations,
    )

    budget = ExplorationBudget(
        max_depth=payload.max_depth,
        max_routes=payload.max_routes,
        max_states=payload.max_states,
        max_time_seconds=payload.max_time_seconds,
    )

    simulation, _ = simulate_routes_bfs(
        story_graph=graph,
        cues=cues,
        annotations=payload.annotations,
        budget=budget,
        project_id=project_id,
        version_id=payload.version_id,
    )
    return simulation
