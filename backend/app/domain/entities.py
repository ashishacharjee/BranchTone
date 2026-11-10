"""Canonical Pydantic domain models for BranchTone.

Source of truth: SCHEMA.md
Contracts mirror SCHEMA.md §2 and schemas/*.
All unavailable source offsets are represented strictly as None (null),
never sentinel values like 0,0.
"""
from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, Field

# ── Shared Enums & Primitives ──────────────────────────────────────────────────

class Severity(StrEnum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class FindingStatus(StrEnum):
    OPEN = "open"
    RESOLVED = "resolved"
    ACCEPTED_RISK = "accepted_risk"
    FALSE_POSITIVE = "false_positive"


class ExplorationStatus(StrEnum):
    EXHAUSTIVE = "exhaustive"
    BOUNDED = "bounded"
    INCOMPLETE = "incomplete"


class RuleId(StrEnum):
    RULE_REVEAL_PROTECTION = "RULE_REVEAL_PROTECTION"
    RULE_REQUIRED_CUE_COVERAGE = "RULE_REQUIRED_CUE_COVERAGE"
    RULE_TENSION_LIFECYCLE = "RULE_TENSION_LIFECYCLE"
    RULE_EMOTIONAL_CONTINUITY = "RULE_EMOTIONAL_CONTINUITY"


# Intensity: integer 1–5 inclusive.
Intensity = Annotated[int, Field(ge=1, le=5)]


# ── Core Entities ─────────────────────────────────────────────────────────────

class Project(BaseModel):
    model_config = ConfigDict(extra="forbid")

    project_id: str
    name: str
    description: str | None = None
    current_version_id: str
    created_at: datetime
    updated_at: datetime


class StoryVersion(BaseModel):
    model_config = ConfigDict(extra="forbid")

    version_id: str
    project_id: str
    version_label: str
    source_filename: str
    source_sha256: str
    story_format: Literal["twee_harlowe_subset"] = "twee_harlowe_subset"
    compiled_at: datetime | None = None
    compilation_status: Literal["success", "warning", "failed"]
    warnings: list[str] = Field(default_factory=list)


class Passage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    passage_id: str
    source_name: str
    title: str
    raw_text: str
    tags: list[str] = Field(default_factory=list)
    source_start: int | None = None
    source_end: int | None = None
    source_line_start: int | None = None
    source_line_end: int | None = None
    outgoing_edge_ids: list[str] = Field(default_factory=list)
    incoming_edge_ids: list[str] = Field(default_factory=list)
    provenance: Literal["imported_source", "demo_fixture"]


class ConditionExpression(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["boolean_literal"] = "boolean_literal"
    variable: str
    value: bool


class StoryEdge(BaseModel):
    model_config = ConfigDict(extra="forbid")

    edge_id: str
    source_passage_id: str
    target_passage_id: str
    choice_text: str
    guard: ConditionExpression | None = None
    source_start: int | None = None
    source_end: int | None = None


class StateMutation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    mutation_id: str
    passage_id: str
    variable_name: str
    value: bool | int | float | str
    source_start: int | None = None
    source_end: int | None = None
    provenance: Literal["source_macro", "demo_fixture"]


class NarrativeFact(BaseModel):
    model_config = ConfigDict(extra="forbid")

    fact_id: str
    key: str
    label: str
    status: Literal["unknown", "false", "true"]
    provenance: Literal["source_macro", "creator_approved_event", "demo_fixture"]


class NarrativeEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    event_id: str
    event_type: Literal[
        "identity_reveal",
        "fact_discovery",
        "mystery_resolved",
        "new_conflict",
        "jump_scare",
        "other",
    ]
    fact_key: str | None = None
    description: str
    evidence_quote: str | None = None
    source_start: int | None = None
    source_end: int | None = None
    order_index: int
    approved: bool


class NarrativeAnnotation(BaseModel):
    model_config = ConfigDict(extra="forbid")

    annotation_id: str
    passage_id: str
    mood: str | None = None
    intensity: Intensity | None = None
    events: list[NarrativeEvent] = Field(default_factory=list)
    provenance: Literal["gemini_candidate", "creator_authored", "demo_fixture"]
    approval_status: Literal["pending", "approved", "rejected", "edited"]


class AudioAsset(BaseModel):
    model_config = ConfigDict(extra="forbid")

    asset_id: str
    project_id: str
    filename: str
    media_type: Literal["music", "ambience", "sfx", "voice"]
    mime_type: str | None = None
    duration_seconds: float | None = None
    sample_rate_hz: int | None = None
    channels: int | None = None
    size_bytes: int | None = None
    storage_key: str | None = None
    sha256: str | None = None
    status: Literal["available", "missing", "invalid"]
    provenance: Literal["uploaded_asset", "demo_fixture"]


class PassageEntryTrigger(BaseModel):
    type: Literal["passage_entry"] = "passage_entry"
    passage_id: str


class NarrativeEventTrigger(BaseModel):
    type: Literal["narrative_event"] = "narrative_event"
    event_id: str
    passage_id: str


CueTrigger = PassageEntryTrigger | NarrativeEventTrigger


class RequiredFact(BaseModel):
    model_config = ConfigDict(extra="forbid")

    fact_key: str
    expected_value: bool


class AudioCue(BaseModel):
    model_config = ConfigDict(extra="forbid")

    cue_id: str
    asset_id: str
    layer: Literal["music", "ambience", "sfx", "voice"]
    trigger: CueTrigger
    required_facts: list[RequiredFact] = Field(default_factory=list)
    stop_policy: Literal["manual", "event_required", "end_of_passage", "asset_end"]
    stop_event_id: str | None = None
    start_offset_ms: int = Field(default=0, ge=0)
    fade_in_ms: int = Field(default=0, ge=0)
    fade_out_ms: int = Field(default=0, ge=0)
    loop: bool = False
    allow_overlap: bool = False
    intentional: bool = False
    provenance: Literal["creator_config", "demo_fixture"]


class CueActivationEvent(BaseModel):
    model_config = ConfigDict(extra="forbid")

    activation_id: str
    route_id: str
    cue_id: str
    passage_id: str
    trigger_type: Literal["passage_entry", "narrative_event"]
    trigger_fired: bool
    asset_available: bool
    route_time_seconds: float | None = None
    timing_provenance: Literal[
        "simulation_trace", "media_derived", "design_fixture_only", "unavailable"
    ]
    facts_at_trigger: dict[str, bool | None]
    required_facts: list[RequiredFact]


class RouteTraceStep(BaseModel):
    model_config = ConfigDict(extra="forbid")

    step_index: int
    passage_id: str
    entered_at_seconds: float | None = None
    facts_before_entry: dict[str, bool | None]
    facts_after_events: dict[str, bool | None]
    triggered_cue_ids: list[str] = Field(default_factory=list)
    event_ids: list[str] = Field(default_factory=list)


class RouteResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    route_id: str
    passage_path: list[str]
    trace: list[RouteTraceStep]
    status: Literal["valid", "issues", "incomplete"]


class SimulationRun(BaseModel):
    model_config = ConfigDict(extra="forbid")

    simulation_id: str
    project_id: str
    version_id: str
    exploration_status: ExplorationStatus
    routes: list[RouteResult]
    cue_events: list[CueActivationEvent]
    states_explored: int = Field(ge=0)
    warnings: list[str] = Field(default_factory=list)
    created_at: datetime
    provenance: Literal["backend_run", "demo_fixture"]


class Finding(BaseModel):
    model_config = ConfigDict(extra="forbid")

    finding_id: str
    finding_code: str = Field(pattern=r"^BT-[0-9]{3,}$")
    rule_id: RuleId
    severity: Severity
    status: FindingStatus
    passage_id: str
    cue_id: str | None = None
    asset_id: str | None = None
    affected_route_ids: list[str]
    explanation: str
    expected_state: dict[str, Any] | None = None
    actual_state: dict[str, Any] | None = None
    evidence_quote: str | None = None
    evidence_verified: bool
    evidence_provenance: Literal[
        "user_supplied_exact_text",
        "imported_source",
        "creator_approved_annotation",
    ] | None = None
    source_start: int | None = None
    source_end: int | None = None
    route_trace: list[str]
    suggested_action: str | None = None
    created_at: datetime
    provenance: Literal["backend_validation", "demo_fixture"]
