# SCHEMA.md — Canonical Data Contracts

This is the source of truth for backend domain models, API contracts, fixture JSON and TypeScript types. `schemas/` must agree with this document. If a contract changes, update the Python model, TS type, JSON Schema, fixtures and tests in the same change.

## 1. Conventions

- Stable IDs are strings; production IDs use `prj_`, `ver_`, `pas_`, `evt_`, `ast_`, `cue_`, `rte_`, `sim_`, `run_`, `fnd_` prefixes.
- Fixture IDs may use `P-001`/`BT-001` for readability. `BT-001` is a finding code, not the rule ID.
- Timestamps are ISO 8601 UTC with `Z`.
- Time is numeric seconds internally; fields explicitly named `_ms` use milliseconds. UI renders `mm:ss`.
- Intensity is integer 1–5 inclusive. Reject decimals and out-of-range values.
- Severity: `critical | high | medium | low | info`.
- Finding status: `open | resolved | accepted_risk | false_positive`.
- Exploration: `exhaustive | bounded | incomplete`.
- Source offsets are zero-based Unicode code-point offsets into the exact decoded source string; `source_start` inclusive, `source_end` exclusive. Preserve raw newlines. Browser code must convert code-point offsets to UTF-16 indices before JS slicing. If line/column values are supplied, they are 1-based and parser-derived only.
- Use explicit `null` for unknown/not supplied; do not use empty strings as missing values.

## 2. Core entities

```ts
interface Project {
  project_id: string; name: string; description?: string | null;
  current_version_id: string; created_at: string; updated_at: string;
}
interface StoryVersion {
  version_id: string; project_id: string; version_label: string;
  source_filename: string; source_sha256: string;
  story_format: "twee_harlowe_subset";
  compiled_at?: string | null;
  compilation_status: "success" | "warning" | "failed";
}
interface Passage {
  passage_id: string; source_name: string; title: string; raw_text: string;
  tags: string[]; source_start: number; source_end: number;
  source_line_start?: number | null; source_line_end?: number | null;
  outgoing_edge_ids: string[]; incoming_edge_ids: string[];
  provenance: "imported_source" | "demo_fixture";
}
interface StoryEdge {
  edge_id: string; source_passage_id: string; target_passage_id: string;
  choice_text: string; guard?: ConditionExpression | null;
  source_start: number; source_end: number;
}
interface StateMutation {
  mutation_id: string; passage_id: string; variable_name: string;
  value: boolean | number | string; source_start: number; source_end: number;
  provenance: "source_macro" | "demo_fixture";
}
interface NarrativeFact {
  fact_id: string; key: string; label: string;
  status: "unknown" | "false" | "true";
  provenance: "source_macro" | "creator_approved_event" | "demo_fixture";
}
interface NarrativeAnnotation {
  annotation_id: string; passage_id: string; mood?: string | null;
  intensity?: number | null; events: NarrativeEvent[];
  provenance: "gemini_candidate" | "creator_authored" | "demo_fixture";
  approval_status: "pending" | "approved" | "rejected" | "edited";
}
interface NarrativeEvent {
  event_id: string;
  event_type: "identity_reveal" | "fact_discovery" | "mystery_resolved" | "new_conflict" | "jump_scare" | "other";
  fact_key?: string | null; description: string;
  evidence_quote?: string | null; source_start?: number | null; source_end?: number | null;
  order_index: number; approved: boolean;
}
interface AudioAsset {
  asset_id: string; project_id: string; filename: string;
  media_type: "music" | "ambience" | "sfx" | "voice";
  mime_type?: string | null; duration_seconds?: number | null;
  sample_rate_hz?: number | null; channels?: number | null; size_bytes?: number | null;
  storage_key?: string | null; sha256?: string | null;
  status: "available" | "missing" | "invalid";
  provenance: "uploaded_asset" | "demo_fixture";
}
type CueTrigger =
  | { type: "passage_entry"; passage_id: string }
  | { type: "narrative_event"; event_id: string; passage_id: string };
interface AudioCue {
  cue_id: string; asset_id: string; layer: "music" | "ambience" | "sfx" | "voice";
  trigger: CueTrigger;
  required_facts: Array<{ fact_key: string; expected_value: boolean }>;
  stop_policy: "manual" | "event_required" | "end_of_passage" | "asset_end";
  stop_event_id?: string | null;
  start_offset_ms: number; fade_in_ms: number; fade_out_ms: number;
  loop: boolean; allow_overlap: boolean; intentional: boolean;
  provenance: "creator_config" | "demo_fixture";
}
interface CueActivationEvent {
  activation_id: string; route_id: string; cue_id: string; passage_id: string;
  trigger_type: "passage_entry" | "narrative_event";
  trigger_fired: boolean;
  asset_available: boolean;
  route_time_seconds?: number | null;
  timing_provenance: "simulation_trace" | "media_derived" | "design_fixture_only" | "unavailable";
  facts_at_trigger: Record<string, boolean | null>;
  required_facts: Array<{ fact_key: string; expected_value: boolean }>;
}
interface RouteTraceStep {
  step_index: number; passage_id: string; entered_at_seconds?: number | null;
  facts_before_entry: Record<string, boolean | null>;
  facts_after_events: Record<string, boolean | null>;
  triggered_cue_ids: string[]; event_ids: string[];
}
interface RouteResult {
  route_id: string; passage_path: string[]; trace: RouteTraceStep[];
  status: "valid" | "issues" | "incomplete";
}
interface SimulationRun {
  simulation_id: string; project_id: string; version_id: string;
  exploration_status: "exhaustive" | "bounded" | "incomplete";
  routes: RouteResult[]; cue_events: CueActivationEvent[];
  states_explored: number; warnings: string[]; created_at: string;
  provenance: "backend_run" | "demo_fixture";
}
interface Finding {
  finding_id: string; finding_code: string;
  rule_id: "RULE_REVEAL_PROTECTION" | "RULE_REQUIRED_CUE_COVERAGE" | "RULE_TENSION_LIFECYCLE" | "RULE_EMOTIONAL_CONTINUITY";
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "open" | "resolved" | "accepted_risk" | "false_positive";
  passage_id: string; cue_id?: string | null; asset_id?: string | null;
  affected_route_ids: string[]; explanation: string;
  expected_state?: Record<string, unknown> | null;
  actual_state?: Record<string, unknown> | null;
  evidence_quote?: string | null; evidence_verified: boolean;
  evidence_provenance?: "user_supplied_exact_text" | "imported_source" | "creator_approved_annotation" | null;
  source_start?: number | null; source_end?: number | null;
  route_trace: string[]; suggested_action?: string | null; created_at: string;
  provenance: "backend_validation" | "demo_fixture";
}
```

`ConditionExpression` is a restricted typed AST, never arbitrary code. If guards are unsupported, report them and mark affected route analysis incomplete. Event evidence must be a verbatim excerpt of its passage after documented whitespace normalization. Unverified evidence cannot drive authoritative fact state. A production `available` asset requires managed storage key, verified hash and successful decode.

## 3. Rule semantics

### `RULE_REVEAL_PROTECTION`
Evaluate all cue `required_facts` at the exact moment the trigger fires. Unknown is not true. For a passage-entry trigger, this occurs before passage-local events/mutations. Create one finding per cue/route/trigger violation, with source and route evidence; deduplicate stable repeats.

### `RULE_REQUIRED_CUE_COVERAGE`
Evaluate only explicit creator-authored requirements. Do not infer a missing cue merely because a layer is empty.

### `RULE_TENSION_LIFECYCLE`
Require a stop event only when `stop_policy = event_required` and a stop event is configured. An approved new conflict after a resolution can justify renewed tension.

### `RULE_EMOTIONAL_CONTINUITY`
Compare approved integer 1–5 values between adjacent passages on explored routes. The threshold is configurable, documented and creator-editable. Intentional transitions are exempt. Default result is a warning, not a hard failure.

## 4. Passage-entry execution order

1. Record entry and pre-entry state.
2. Evaluate passage-entry cue triggers against inherited state.
3. Record cue trigger and requirement mismatches.
4. Apply supported source mutations and approved events in source order.
5. Evaluate event-triggered cues immediately after the relevant approved event.
6. Evaluate outgoing edge guards and advance.

## 5. Finding identity and deduplication

`finding_code` is a stable human-facing identifier such as `BT-001`; `finding_id` is a unique record identifier; `rule_id` identifies evaluator semantics. Do not overload these fields. A dedupe key should include rule ID + cue ID + route ID + trigger event identity + passage ID. Do not dedupe distinct routes into one finding unless the report explicitly groups them and retains all affected route IDs/traces.

## 6. API envelope and endpoints

All endpoints use `/api/v1`. Error shape:

```json
{
  "error": {
    "code": "UNSUPPORTED_STORY_SYNTAX",
    "message": "The imported story contains syntax outside the supported subset.",
    "details": [{"passage_id":"P-003","source_start":120,"source_end":145}]
  }
}
```

Minimum endpoint plan:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Service health/version |
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects/{project_id}` | Project summary |
| POST | `/api/v1/projects/{project_id}/imports` | Import `.twee` |
| GET | `/api/v1/projects/{project_id}/graph` | Graph nodes/edges |
| POST | `/api/v1/projects/{project_id}/assets` | Upload audio |
| GET | `/api/v1/projects/{project_id}/assets` | List assets |
| POST/PATCH/DELETE | `/api/v1/projects/{project_id}/cues[/{cue_id}]` | Cue management |
| POST | `/api/v1/projects/{project_id}/simulate` | Route simulation |
| POST | `/api/v1/projects/{project_id}/validation-runs` | Run rules |
| GET | `/api/v1/projects/{project_id}/validation-runs/{run_id}` | Fetch run/findings |
| GET | `/api/v1/projects/{project_id}/reports/{run_id}.json` | Export reproducible report |

A provider/model endpoint is not part of the base implementation until compliance permits it.

## 7. Persistence tables

Initial relational tables: `projects`, `story_versions`, `passages`, `story_edges`, `state_mutations`, `narrative_annotations`, `narrative_events`, `audio_assets`, `audio_cues`, `simulation_runs`, `route_results`, `cue_activation_events`, `validation_runs`, `findings`. Keep IDs/FKs explicit; use JSON only for state snapshots/traces that are not queried relationally. Enable SQLite foreign keys on every connection.
