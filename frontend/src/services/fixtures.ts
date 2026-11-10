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
