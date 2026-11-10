/**
 * BranchTone Canonical TypeScript Contracts
 *
 * Source of truth: SCHEMA.md
 *
 * Corrections applied:
 *   - source_start / source_end are number | null throughout.
 *     Unknown source offsets must remain null; 0 is not used as a sentinel.
 *     (AGENTS.md correction #2; PACK_AUDIT.md §3)
 *
 * Do not modify without updating SCHEMA.md, Pydantic models and JSON Schemas.
 */

// ── Shared primitives ────────────────────────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type FindingStatus = 'open' | 'resolved' | 'accepted_risk' | 'false_positive';
export type ExplorationStatus = 'exhaustive' | 'bounded' | 'incomplete';
export type Provenance =
  | 'imported_source'
  | 'demo_fixture'
  | 'backend_validation'
  | 'backend_run'
  | 'creator_config'
  | 'gemini_candidate'
  | 'creator_authored'
  | 'source_macro'
  | 'creator_approved_event'
  | 'uploaded_asset';

/** Intensity is an integer 1–5 inclusive. Reject decimals and out-of-range. */
export type Intensity = 1 | 2 | 3 | 4 | 5;

// ── Core entities ────────────────────────────────────────────────────────────

export interface Project {
  project_id: string;
  name: string;
  description?: string | null;
  current_version_id: string;
  created_at: string; // ISO 8601 UTC
  updated_at: string;
}

export interface StoryVersion {
  version_id: string;
  project_id: string;
  version_label: string;
  source_filename: string;
  source_sha256: string;
  story_format: 'twee_harlowe_subset';
  compiled_at?: string | null;
  compilation_status: 'success' | 'warning' | 'failed';
  warnings?: string[];
}

export interface Passage {
  passage_id: string;
  source_name: string;
  title: string;
  raw_text: string;
  tags: string[];
  /**
   * Zero-based Unicode code-point offset, inclusive.
   * null when not yet derived by parser (demo fixtures, placeholder passages).
   */
  source_start: number | null;
  /**
   * Zero-based Unicode code-point offset, exclusive.
   * null when not yet derived by parser.
   */
  source_end: number | null;
  source_line_start?: number | null;
  source_line_end?: number | null;
  outgoing_edge_ids: string[];
  incoming_edge_ids: string[];
  provenance: 'imported_source' | 'demo_fixture';
}

export type ConditionExpression = {
  type: 'boolean_literal';
  variable: string;
  value: boolean;
};

export interface StoryEdge {
  edge_id: string;
  source_passage_id: string;
  target_passage_id: string;
  /** Exact text of the choice link from the .twee source. Never invented. */
  choice_text: string;
  guard?: ConditionExpression | null;
  source_start: number | null;
  source_end: number | null;
}

export interface StateMutation {
  mutation_id: string;
  passage_id: string;
  variable_name: string;
  value: boolean | number | string;
  source_start: number | null;
  source_end: number | null;
  provenance: 'source_macro' | 'demo_fixture';
}

export interface NarrativeFact {
  fact_id: string;
  key: string;
  label: string;
  status: 'unknown' | 'false' | 'true';
  provenance: 'source_macro' | 'creator_approved_event' | 'demo_fixture';
}

export type NarrativeEventType =
  | 'identity_reveal'
  | 'fact_discovery'
  | 'mystery_resolved'
  | 'new_conflict'
  | 'jump_scare'
  | 'other';

export interface NarrativeEvent {
  event_id: string;
  event_type: NarrativeEventType;
  fact_key?: string | null;
  description: string;
  evidence_quote?: string | null;
  source_start?: number | null;
  source_end?: number | null;
  order_index: number;
  approved: boolean;
}

export interface NarrativeAnnotation {
  annotation_id: string;
  passage_id: string;
  mood?: string | null;
  intensity?: Intensity | null;
  events: NarrativeEvent[];
  provenance: 'gemini_candidate' | 'creator_authored' | 'demo_fixture';
  approval_status: 'pending' | 'approved' | 'rejected' | 'edited';
}

export interface AudioAsset {
  asset_id: string;
  project_id: string;
  filename: string;
  media_type: 'music' | 'ambience' | 'sfx' | 'voice';
  mime_type?: string | null;
  /** Measured from actual decoded file. null when not yet decoded/uploaded. */
  duration_seconds?: number | null;
  sample_rate_hz?: number | null;
  channels?: number | null;
  size_bytes?: number | null;
  storage_key?: string | null;
  sha256?: string | null;
  status: 'available' | 'missing' | 'invalid';
  provenance: 'uploaded_asset' | 'demo_fixture';
}

export type CueTrigger =
  | { type: 'passage_entry'; passage_id: string }
  | { type: 'narrative_event'; event_id: string; passage_id: string };

export interface AudioCue {
  cue_id: string;
  asset_id: string;
  layer: 'music' | 'ambience' | 'sfx' | 'voice';
  trigger: CueTrigger;
  required_facts: Array<{ fact_key: string; expected_value: boolean }>;
  stop_policy: 'manual' | 'event_required' | 'end_of_passage' | 'asset_end';
  stop_event_id?: string | null;
  start_offset_ms: number;
  fade_in_ms: number;
  fade_out_ms: number;
  loop: boolean;
  allow_overlap: boolean;
  intentional: boolean;
  provenance: 'creator_config' | 'demo_fixture';
}

export interface CueActivationEvent {
  activation_id: string;
  route_id: string;
  cue_id: string;
  passage_id: string;
  trigger_type: 'passage_entry' | 'narrative_event';
  trigger_fired: boolean;
  asset_available: boolean;
  route_time_seconds?: number | null;
  timing_provenance: 'simulation_trace' | 'media_derived' | 'design_fixture_only' | 'unavailable';
  facts_at_trigger: Record<string, boolean | null>;
  required_facts: Array<{ fact_key: string; expected_value: boolean }>;
}

export interface RouteTraceStep {
  step_index: number;
  passage_id: string;
  entered_at_seconds?: number | null;
  facts_before_entry: Record<string, boolean | null>;
  facts_after_events: Record<string, boolean | null>;
  triggered_cue_ids: string[];
  event_ids: string[];
}

export interface RouteResult {
  route_id: string;
  passage_path: string[];
  trace: RouteTraceStep[];
  status: 'valid' | 'issues' | 'incomplete';
}

export interface SimulationRun {
  simulation_id: string;
  project_id: string;
  version_id: string;
  exploration_status: ExplorationStatus;
  routes: RouteResult[];
  cue_events: CueActivationEvent[];
  states_explored: number;
  warnings: string[];
  created_at: string;
  provenance: 'backend_run' | 'demo_fixture';
}

export interface Finding {
  finding_id: string;
  finding_code: string;
  rule_id:
    | 'RULE_REVEAL_PROTECTION'
    | 'RULE_REQUIRED_CUE_COVERAGE'
    | 'RULE_TENSION_LIFECYCLE'
    | 'RULE_EMOTIONAL_CONTINUITY';
  severity: Severity;
  status: FindingStatus;
  passage_id: string;
  cue_id?: string | null;
  asset_id?: string | null;
  affected_route_ids: string[];
  explanation: string;
  expected_state?: Record<string, unknown> | null;
  actual_state?: Record<string, unknown> | null;
  evidence_quote?: string | null;
  evidence_verified: boolean;
  evidence_provenance?: 'user_supplied_exact_text' | 'imported_source' | 'creator_approved_annotation' | null;
  source_start?: number | null;
  source_end?: number | null;
  route_trace: string[];
  suggested_action?: string | null;
  created_at: string;
  provenance: 'backend_validation' | 'demo_fixture';
}

// ── API envelope ─────────────────────────────────────────────────────────────

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<Record<string, unknown>>;
  };
}

// ── Health response ───────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  compliance_note: string;
}

// ── Workspace shared state ────────────────────────────────────────────────────

export type WorkspaceId =
  | 'overview'
  | 'story-graph'
  | 'narrative-map'
  | 'cue-library'
  | 'route-lab'
  | 'validation-centre'
  | 'reports';
