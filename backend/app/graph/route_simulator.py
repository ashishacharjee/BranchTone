"""Queue-based BFS Route Exploration and Narrative State Engine for BranchTone.

Explores branching narrative routes using breadth-first search, honoring configurable exploration
budgets (depth, routes, states, timeout) and tracking distinct knowledge/variable states.
"""
from __future__ import annotations

import copy
import time
import uuid
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.domain.entities import (
    AudioCue,
    CueActivationEvent,
    ExplorationStatus,
    NarrativeAnnotation,
    RouteResult,
    RouteTraceStep,
    SimulationRun,
)
from app.graph.story_graph import StoryGraph


@dataclass
class ExplorationBudget:
    """Configurable limits for deterministic BFS route exploration."""
    max_depth: int = 50
    max_routes: int = 50
    max_states: int = 1000
    max_time_seconds: float = 5.0


@dataclass
class BFSTraversalState:
    """Represents a discrete state node in the BFS exploration queue."""
    current_passage: str
    previous_passage: str | None
    visit_sequence: list[str]
    narrative_knowledge: dict[str, bool | None]
    story_variables: dict[str, Any]
    event_history: list[str]
    triggered_cues: list[str]
    depth: int
    trace_steps: list[RouteTraceStep]
    accumulated_cue_events: list[CueActivationEvent] = field(default_factory=list)


class ExplorationTelemetry(BaseModel):
    """Detailed metrics on route exploration results."""
    model_config = ConfigDict(extra="forbid")

    routes_discovered: int
    routes_evaluated: int
    passages_visited: int
    states_processed: int
    truncated_branches: int
    budget_exhausted: bool
    unsupported_conditions: list[str] = Field(default_factory=list)
    unverified_states: list[str] = Field(default_factory=list)
    elapsed_seconds: float


def simulate_routes_bfs(
    story_graph: StoryGraph,
    cues: list[AudioCue],
    annotations: list[NarrativeAnnotation] | None = None,
    budget: ExplorationBudget | None = None,
    project_id: str = "prj_demo",
    version_id: str = "ver_demo",
) -> tuple[SimulationRun, ExplorationTelemetry]:
    """Executes queue-based BFS route exploration across the story graph."""
    if budget is None:
        budget = ExplorationBudget()

    start_time = time.perf_counter()

    annotations_by_passage: dict[str, list[NarrativeAnnotation]] = {}
    if annotations:
        for ann in annotations:
            annotations_by_passage.setdefault(ann.passage_id, []).append(ann)

    cues_by_passage: dict[str, list[AudioCue]] = {}
    for cue in cues:
        if cue.trigger.type == "passage_entry":
            cues_by_passage.setdefault(cue.trigger.passage_id, []).append(cue)

    entry_passages = story_graph.find_entry_passages()
    routes: list[RouteResult] = []
    all_cue_events: list[CueActivationEvent] = []
    visited_passages_all: set[str] = set()

    # Track distinct state footprints: (passage_id, frozenset(knowledge), frozenset(variables))
    visited_state_keys: set[tuple[str, frozenset[tuple[str, Any]], frozenset[tuple[str, Any]]]] = set()

    states_processed = 0
    truncated_branches = 0
    budget_exhausted = False
    warnings: list[str] = []
    route_counter = 1

    # Initialize FIFO queue for BFS
    queue: deque[BFSTraversalState] = deque()

    for root_id in entry_passages:
        queue.append(
            BFSTraversalState(
                current_passage=root_id,
                previous_passage=None,
                visit_sequence=[root_id],
                narrative_knowledge={},
                story_variables={},
                event_history=[],
                triggered_cues=[],
                depth=1,
                trace_steps=[],
            )
        )

    while queue:
        elapsed = time.perf_counter() - start_time
        if elapsed > budget.max_time_seconds:
            warnings.append(f"Exploration exceeded time budget ({budget.max_time_seconds}s).")
            budget_exhausted = True
            break

        if states_processed >= budget.max_states:
            warnings.append(f"Exploration exceeded state budget ({budget.max_states} states).")
            budget_exhausted = True
            break

        if len(routes) >= budget.max_routes:
            warnings.append(f"Exploration reached maximum route quota ({budget.max_routes} routes).")
            budget_exhausted = True
            break

        curr = queue.popleft()
        states_processed += 1
        visited_passages_all.add(curr.current_passage)

        if curr.depth > budget.max_depth:
            warnings.append(f"Branch exceeded max depth ({budget.max_depth}). Truncating branch.")
            truncated_branches += 1
            budget_exhausted = True
            continue

        # Check state uniqueness
        state_key = (
            curr.current_passage,
            frozenset(curr.narrative_knowledge.items()),
            frozenset(curr.story_variables.items()),
        )
        if state_key in visited_state_keys:
            # Reached exact same passage with identical state -> skip duplicate exploration
            continue
        visited_state_keys.add(state_key)

        knowledge_before = copy.deepcopy(curr.narrative_knowledge)
        variables_before = copy.deepcopy(curr.story_variables)

        # 1. Evaluate passage-entry cues against inherited state
        step_triggered_cues: list[str] = []
        step_cue_events: list[CueActivationEvent] = []
        route_label = f"route_{route_counter}"

        passage_cues = cues_by_passage.get(curr.current_passage, [])
        for cue in passage_cues:
            evt = CueActivationEvent(
                activation_id=f"act_{uuid.uuid4().hex[:12]}",
                route_id="",
                cue_id=cue.cue_id,
                passage_id=curr.current_passage,
                trigger_type="passage_entry",
                trigger_fired=True,
                asset_available=True,
                route_time_seconds=(curr.depth - 1) * 45.0,
                timing_provenance="simulation_trace",
                facts_at_trigger=copy.deepcopy(knowledge_before),
                required_facts=cue.required_facts,
            )
            step_cue_events.append(evt)
            step_triggered_cues.append(cue.cue_id)

        new_cue_events = curr.accumulated_cue_events + step_cue_events

        # 2. Apply state mutations for current passage
        mutations = story_graph.mutations_by_passage.get(curr.current_passage, [])
        knowledge_after = copy.deepcopy(knowledge_before)
        variables_after = copy.deepcopy(variables_before)

        for mut in mutations:
            variables_after[mut.variable_name] = mut.value
            # If boolean, sync with narrative knowledge
            if isinstance(mut.value, bool):
                knowledge_after[mut.variable_name] = mut.value
            elif mut.value in ("true", "True", "1"):
                knowledge_after[mut.variable_name] = True
            elif mut.value in ("false", "False", "0"):
                knowledge_after[mut.variable_name] = False
            else:
                knowledge_after[mut.variable_name] = True

        # 3. Check approved annotations / narrative events
        step_event_ids: list[str] = []
        p_annotations = annotations_by_passage.get(curr.current_passage, [])
        for ann in p_annotations:
            if ann.approval_status == "approved":
                for evt in ann.events:
                    step_event_ids.append(evt.event_id)
                    if evt.fact_key:
                        knowledge_after[evt.fact_key] = True

        # 4. Record trace step
        step = RouteTraceStep(
            step_index=len(curr.trace_steps),
            passage_id=curr.current_passage,
            entered_at_seconds=(curr.depth - 1) * 45.0,
            facts_before_entry=knowledge_before,
            facts_after_events=knowledge_after,
            triggered_cue_ids=step_triggered_cues,
            event_ids=step_event_ids,
        )
        new_trace = curr.trace_steps + [step]
        new_triggered = curr.triggered_cues + step_triggered_cues
        new_events = curr.event_history + step_event_ids

        # 5. Explore outgoing edges
        outgoing = story_graph.outgoing.get(curr.current_passage, [])
        if not outgoing:
            # Terminal node reached — complete route!
            for evt in new_cue_events:
                all_cue_events.append(evt.model_copy(update={"route_id": route_label}))

            routes.append(
                RouteResult(
                    route_id=route_label,
                    passage_path=list(curr.visit_sequence),
                    trace=new_trace,
                    status="valid",
                )
            )
            route_counter += 1
        else:
            for edge in outgoing:
                target_pid = edge.target_passage_id
                # Check for cycle within this route's history
                if target_pid in curr.visit_sequence:
                    warnings.append(
                        f"Cycle detected on route {curr.visit_sequence} -> {target_pid}. Terminating branch."
                    )
                    for evt in new_cue_events:
                        all_cue_events.append(evt.model_copy(update={"route_id": route_label}))

                    routes.append(
                        RouteResult(
                            route_id=route_label,
                            passage_path=list(curr.visit_sequence),
                            trace=new_trace,
                            status="valid",
                        )
                    )
                    route_counter += 1
                    continue

                # Evaluate edge guards if present
                if edge.guard:
                    var_val = variables_after.get(edge.guard.variable)
                    if var_val != edge.guard.value:
                        # Guard blocked
                        continue

                # Enqueue child state
                queue.append(
                    BFSTraversalState(
                        current_passage=target_pid,
                        previous_passage=curr.current_passage,
                        visit_sequence=curr.visit_sequence + [target_pid],
                        narrative_knowledge=knowledge_after,
                        story_variables=variables_after,
                        event_history=new_events,
                        triggered_cues=new_triggered,
                        depth=curr.depth + 1,
                        trace_steps=new_trace,
                        accumulated_cue_events=new_cue_events,
                    )
                )

    total_time = round(time.perf_counter() - start_time, 4)
    exploration_status = (
        ExplorationStatus.BOUNDED if budget_exhausted else ExplorationStatus.EXHAUSTIVE
    )

    telemetry = ExplorationTelemetry(
        routes_discovered=len(routes),
        routes_evaluated=len(routes),
        passages_visited=len(visited_passages_all),
        states_processed=states_processed,
        truncated_branches=truncated_branches,
        budget_exhausted=budget_exhausted,
        unsupported_conditions=[],
        unverified_states=[],
        elapsed_seconds=total_time,
    )

    sim_run = SimulationRun(
        simulation_id=f"sim_{uuid.uuid4().hex[:12]}",
        project_id=project_id,
        version_id=version_id,
        exploration_status=exploration_status,
        routes=routes,
        cue_events=all_cue_events,
        states_explored=states_processed,
        warnings=warnings,
        created_at=datetime.now(timezone.utc),
        provenance="backend_run",
    )

    return sim_run, telemetry


def simulate_routes(
    story_graph: StoryGraph,
    cues: list[AudioCue],
    annotations: list[NarrativeAnnotation] | None = None,
    project_id: str = "prj_demo",
    version_id: str = "ver_demo",
    max_depth: int = 50,
    max_states: int = 1000,
) -> SimulationRun:
    """Convenience wrapper for backward compatibility with simulate_routes using BFS."""
    budget = ExplorationBudget(max_depth=max_depth, max_states=max_states)
    sim_run, _ = simulate_routes_bfs(
        story_graph=story_graph,
        cues=cues,
        annotations=annotations,
        budget=budget,
        project_id=project_id,
        version_id=version_id,
    )
    return sim_run
