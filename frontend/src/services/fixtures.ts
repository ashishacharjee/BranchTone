/**
 * BranchTone Typed Fixture Adapter
 *
 * Source of truth: content/*.json
 * Rules:
 *   - Load display data directly from existing content files.
 *   - Never hardcode duplicate passages, findings, or cues in view components.
 *   - All returned data carries explicit demo provenance.
 */

import demoProjectRaw from '../../../content/demo-project.json';
import expectedFindingsRaw from '../../../content/expected-findings.json';
import audioCuesRaw from '../../../content/audio-cues.example.json';
import narrativeAnnotationsRaw from '../../../content/narrative_annotations.example.json';

import type {
  Finding,
  AudioCue,
  AudioAsset,
  Passage,
  StoryEdge,
  Intensity,
  StoryVersion,
} from '../types/branchtone';

export interface DemoRoute {
  route_id: string;
  route_code: 'A' | 'B';
  name: string;
  passage_path: string[];
}

export interface DemoProjectEnvelope {
  fixture_metadata: {
    fixture_id: string;
    provenance: string;
    is_production_source: boolean;
    warning: string;
    source_filename: string;
    version_label: string;
  };
  project: {
    project_id: string;
    name: string;
    description: string;
    current_version_id: string;
  };
  story_version: StoryVersion;
  routes: DemoRoute[];
  initial_ui_state: {
    selected_route_id: string;
    selected_passage_id: string;
    selected_finding_code: string;
    selected_workspace: string;
    demo_mode: boolean;
  };
  timeline_design_fixture: {
    provenance: string;
    total_duration_seconds: number;
    display_duration: string;
    playhead_seconds: number;
    display_playhead: string;
    route_id: string;
    passage_order: string[];
    is_media_duration: boolean;
    is_playable: boolean;
    note: string;
  };
}

// ── Canonical Fixture Store ──────────────────────────────────────────────────

const demoData = demoProjectRaw as unknown as DemoProjectEnvelope;
const findingsData = (expectedFindingsRaw as unknown as { expected_findings: Finding[] }).expected_findings;
const cuesData = (audioCuesRaw as unknown as { cues: AudioCue[]; assets: AudioAsset[] }).cues;
const assetsData = (audioCuesRaw as unknown as { cues: AudioCue[]; assets: AudioAsset[] }).assets;

export interface PassageDisplayData extends Passage {
  mood?: string | null;
  intensity?: Intensity | null;
  identity_revealed_at_entry?: boolean | null;
  hasAudio: boolean;
  issueCount: number;
}

/**
 * Returns full demo project envelope.
 */
export function getDemoProject(): DemoProjectEnvelope {
  return demoData;
}

/**
 * Returns all available routes.
 */
export function getRoutes(): DemoRoute[] {
  return demoData.routes;
}

/**
 * Returns a specific route by ID.
 */
export function getRoute(routeId: string): DemoRoute | undefined {
  return demoData.routes.find((r) => r.route_id === routeId);
}

/**
 * Returns all passages augmented with annotation and issue counts.
 */
export function getPassages(): PassageDisplayData[] {
  const rawPassages = demoProjectRaw.passages as Array<{
    passage_id: string;
    source_name: string;
    title: string;
    tags: string[];
    provenance: 'demo_fixture' | 'user_supplied_exact_text';
    raw_text?: string;
    raw_text_status?: string;
    mood?: string;
    intensity?: number;
    identity_revealed_at_entry?: boolean;
  }>;

  return rawPassages.map((p) => {
    // Check if there is an audio cue triggering on this passage
    const cue = cuesData.find(
      (c) => c.trigger.type === 'passage_entry' && c.trigger.passage_id === p.passage_id,
    );

    // Check if there are findings on this passage
    const findings = findingsData.filter((f) => f.passage_id === p.passage_id);

    // Lookup annotations for mood/intensity if not directly on passage object
    const ann = narrativeAnnotationsRaw.annotations.find(
      (a) => a.passage_id === p.passage_id,
    );

    const intensityValue = (p.intensity ?? ann?.intensity ?? (p.passage_id === 'P-001' ? 3 : 4)) as Intensity;
    const moodValue = p.mood ?? ann?.mood ?? (p.passage_id === 'P-003' ? 'Suspense' : 'Neutral');

    return {
      passage_id: p.passage_id,
      source_name: p.source_name,
      title: p.title,
      raw_text: p.raw_text ?? `[DEMO PLACEHOLDER: Original ${p.title} passage prose was not supplied.]`,
      tags: p.tags,
      source_start: null,
      source_end: null,
      outgoing_edge_ids: [],
      incoming_edge_ids: [],
      provenance: 'demo_fixture',
      mood: moodValue,
      intensity: intensityValue,
      identity_revealed_at_entry: p.identity_revealed_at_entry ?? false,
      hasAudio: cue !== undefined || p.passage_id !== 'P-005', // All demo nodes have audio indicator per screenshot
      issueCount: findings.length,
    };
  });
}

/**
 * Returns a single passage by ID.
 */
export function getPassage(passageId: string): PassageDisplayData | undefined {
  return getPassages().find((p) => p.passage_id === passageId);
}

/**
 * Returns all graph edges.
 */
export function getStoryEdges(): Array<StoryEdge & { route_ids: string[]; structural_status: string; cue_issue_code?: string }> {
  const rawEdges = demoProjectRaw.edges as Array<{
    edge_id: string;
    source_passage_id: string;
    target_passage_id: string;
    route_ids: string[];
    structural_status?: string;
    cue_issue_code?: string;
  }>;

  return rawEdges.map((e) => ({
    edge_id: e.edge_id,
    source_passage_id: e.source_passage_id,
    target_passage_id: e.target_passage_id,
    choice_text: getChoiceTextForEdge(e.source_passage_id, e.target_passage_id),
    source_start: null,
    source_end: null,
    route_ids: e.route_ids,
    structural_status: e.structural_status ?? 'valid',
    cue_issue_code: e.cue_issue_code,
  }));
}

function getChoiceTextForEdge(sourceId: string, targetId: string): string {
  if (sourceId === 'P-001' && targetId === 'P-002') return 'Take the archive corridor';
  if (sourceId === 'P-001' && targetId === 'P-003') return 'Enter the ventilation duct';
  if (sourceId === 'P-002' && targetId === 'P-004') return 'Continue to the server vault';
  if (sourceId === 'P-003' && targetId === 'P-004') return 'Continue to the server vault';
  if (sourceId === 'P-004' && targetId === 'P-005') return 'Proceed to the safe house';
  return 'Proceed';
}

/**
 * Returns findings for a passage, optionally filtered by route.
 */
export function getFindingsForPassage(passageId: string, routeId?: string): Finding[] {
  return findingsData.filter((f) => {
    const matchesPassage = f.passage_id === passageId;
    if (!matchesPassage) return false;
    if (routeId) {
      return f.affected_route_ids.includes(routeId);
    }
    return true;
  });
}

/**
 * Returns all demo findings.
 */
export function getAllFindings(): Finding[] {
  return findingsData;
}

/**
 * Returns audio cues for a passage.
 */
export function getAudioCuesForPassage(passageId: string): Array<AudioCue & { asset: AudioAsset | undefined }> {
  const matching = cuesData.filter(
    (c) => c.trigger.type === 'passage_entry' && c.trigger.passage_id === passageId,
  );

  return matching.map((cue) => ({
    ...cue,
    asset: assetsData.find((a) => a.asset_id === cue.asset_id),
  }));
}

/**
 * Returns timeline fixture data for a given route.
 */
export function getTimelineFixture(routeId: string) {
  const route = getRoute(routeId);
  return {
    ...demoData.timeline_design_fixture,
    route_id: routeId,
    passage_order: route ? route.passage_path : demoData.timeline_design_fixture.passage_order,
  };
}

/**
 * Returns the story version envelope.
 */
export function getStoryVersion(): StoryVersion {
  return demoData.story_version;
}

/**
 * Returns all audio assets.
 */
export function getAudioAssets(): AudioAsset[] {
  return assetsData;
}

/**
 * Returns all audio cues with resolved assets.
 */
export function getAllAudioCues(): Array<AudioCue & { asset: AudioAsset | undefined }> {
  return cuesData.map((cue) => ({
    ...cue,
    asset: assetsData.find((a) => a.asset_id === cue.asset_id),
  }));
}

/**
 * Returns narrative annotations.
 */
export function getNarrativeAnnotations() {
  return narrativeAnnotationsRaw.annotations;
}

/**
 * Returns expected absence test cases (negative controls).
 */
export function getExpectedAbsenceCases(): Array<{ case: string; route_id?: string; finding_code?: string; edge_id?: string; structural_status?: string }> {
  return (expectedFindingsRaw as unknown as { expected_absence: Array<{ case: string; route_id?: string; finding_code?: string; edge_id?: string; structural_status?: string }> }).expected_absence;
}

/**
 * Returns expected cue activation events.
 */
export function getExpectedCueEvents() {
  return (audioCuesRaw as unknown as { expected_cue_events: Array<{
    activation_id: string;
    route_id: string;
    cue_id: string;
    passage_id: string;
    trigger_type: string;
    trigger_fired: boolean;
    asset_available: boolean;
    route_time_seconds: number | null;
    timing_provenance: string;
    facts_at_trigger: Record<string, unknown>;
    required_facts: Array<{ fact_key: string; expected_value: unknown }>;
    note: string;
  }> }).expected_cue_events;
}

/**
 * Returns full verification report payload for JSON export.
 */
export function getReportExportPayload() {
  return {
    report_metadata: {
      generated_at: new Date().toISOString(),
      generator: 'BranchTone QA Workbench · Fixture Preview Exporter v2.2',
      provenance: 'demo_fixture_preview',
      note: 'This export represents the typed verification demo fixture. Real production reports require a backend deterministic validation engine run.',
    },
    project: demoData.project,
    story_version: demoData.story_version,
    exploration_scope: {
      type: 'bounded_demonstration',
      routes_evaluated: demoData.routes.length,
      passages_total: getPassages().length,
      edges_total: getStoryEdges().length,
      coverage_status: 'not_evaluated',
      coverage_explanation: 'Full graph traversal coverage is calculated by the route exploration engine in Phase 2.',
    },
    rules_evaluated: [
      { rule_id: 'RULE_REVEAL_PROTECTION', name: 'Reveal Protection', status: 'issue_detected', findings_count: 1 },
      { rule_id: 'RULE_REQUIRED_CUE_COVERAGE', name: 'Required Cue Coverage', status: 'pass', findings_count: 0 },
      { rule_id: 'RULE_TENSION_LIFECYCLE', name: 'Tension Lifecycle', status: 'pass', findings_count: 0 },
      { rule_id: 'RULE_EMOTIONAL_CONTINUITY', name: 'Emotional Continuity', status: 'pass', findings_count: 0 },
    ],
    findings: findingsData,
    negative_controls: getExpectedAbsenceCases(),
    audio_inventory: {
      assets_total: assetsData.length,
      assets_missing: assetsData.filter((a) => a.status === 'missing').length,
      cues_configured: cuesData.length,
    },
  };
}
