/**
 * BranchTone typed API client.
 *
 * Rules:
 *   - No fetch calls in view components (ARCHITECTURE.md §6).
 *   - All responses are validated with Zod at the boundary.
 *   - Domain logic (parsing, validation) lives in the backend only.
 */
import { z } from 'zod';
import type {
  AudioAsset,
  AudioCue,
  Finding,
  FindingStatus,
  HealthResponse,
  NarrativeAnnotation,
  Passage,
  SimulationRun,
  ValidationRun,
} from '../types/branchtone';

const API_BASE = '/api/v1';

// ── Error handling ───────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let code = `HTTP_${response.status.toString()}`;
    let message = response.statusText;
    try {
      const body = await response.json() as { error?: { code?: string; message?: string } };
      if (body.error) {
        code = body.error.code ?? code;
        message = body.error.message ?? message;
      }
    } catch {
      // non-JSON error body — use defaults above
    }
    throw new ApiError(response.status, code, message);
  }

  return response.json() as Promise<T>;
}

// ── Health ───────────────────────────────────────────────────────────────────

const HealthResponseSchema = z.object({
  status: z.string(),
  service: z.string(),
  version: z.string(),
  timestamp: z.string(),
  compliance_note: z.string(),
});

export async function fetchHealth(): Promise<HealthResponse> {
  const raw = await request<unknown>('/health');
  return HealthResponseSchema.parse(raw);
}

// ── Story Import & Parsing ───────────────────────────────────────────────────

export interface ImportStoryPayload {
  source_text: string;
  filename: string;
  version_label?: string;
}

export interface CanonicalStoryIRResponse {
  project_id: string;
  story_version: {
    version_id: string;
    version_label: string;
    source_filename: string;
    source_sha256: string;
    story_format: string;
    compilation_status: string;
  };
  passages: Passage[];
  edges: unknown[];
  mutations: unknown[];
  diagnostics: unknown[];
}

export async function importStory(
  projectId: string,
  payload: ImportStoryPayload,
): Promise<CanonicalStoryIRResponse> {
  return request<CanonicalStoryIRResponse>(`/projects/${encodeURIComponent(projectId)}/imports`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ── BFS Route Simulation ─────────────────────────────────────────────────────

export interface SimulationBudgetParams {
  max_depth?: number;
  max_routes?: number;
  max_states?: number;
  max_time_seconds?: number;
  passages?: Passage[];
  edges?: unknown[];
  mutations?: unknown[];
  cues?: AudioCue[];
  annotations?: NarrativeAnnotation[];
}

export async function simulateRoutes(
  projectId: string,
  params?: SimulationBudgetParams,
): Promise<SimulationRun> {
  return request<SimulationRun>(`/projects/${encodeURIComponent(projectId)}/simulate`, {
    method: 'POST',
    body: JSON.stringify(params ?? {}),
  });
}

// ── Audio Asset Ingestion & Waveforms ────────────────────────────────────────

export interface AudioUploadResponse extends AudioAsset {
  waveform_peaks: number[];
}

export async function uploadAudioAsset(
  projectId: string,
  file: File,
  mediaType: 'music' | 'ambience' | 'sfx' | 'voice' = 'music',
): Promise<AudioUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('media_type', mediaType);

  return request<AudioUploadResponse>(`/projects/${encodeURIComponent(projectId)}/assets`, {
    method: 'POST',
    body: formData,
  });
}

export async function fetchAudioAssets(projectId: string): Promise<AudioAsset[]> {
  return request<AudioAsset[]>(`/projects/${encodeURIComponent(projectId)}/assets`);
}

export async function fetchWaveform(
  projectId: string,
  assetId: string,
): Promise<{ asset_id: string; peaks: number[] }> {
  return request<{ asset_id: string; peaks: number[] }>(
    `/projects/${encodeURIComponent(projectId)}/assets/${encodeURIComponent(assetId)}/waveform`,
  );
}

export function getAssetStreamUrl(projectId: string, assetId: string): string {
  return `${API_BASE}/projects/${encodeURIComponent(projectId)}/assets/${encodeURIComponent(assetId)}/stream`;
}

// ── Validation Engine ────────────────────────────────────────────────────────

export async function createValidationRun(
  projectId: string,
  payload: {
    simulation: SimulationRun;
    cues: AudioCue[];
    passages: Passage[];
    annotations?: NarrativeAnnotation[];
  },
): Promise<ValidationRun> {
  return request<ValidationRun>(`/projects/${encodeURIComponent(projectId)}/validation-runs`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchValidationRun(
  projectId: string,
  runId: string,
): Promise<ValidationRun> {
  return request<ValidationRun>(
    `/projects/${encodeURIComponent(projectId)}/validation-runs/${encodeURIComponent(runId)}`,
  );
}

export async function updateFindingStatus(
  projectId: string,
  findingId: string,
  status: FindingStatus,
): Promise<Finding> {
  return request<Finding>(
    `/projects/${encodeURIComponent(projectId)}/findings/${encodeURIComponent(findingId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    },
  );
}

// ── Reports ──────────────────────────────────────────────────────────────────

export async function fetchReportJson(
  projectId: string,
  runId: string,
): Promise<Record<string, unknown>> {
  return request<Record<string, unknown>>(
    `/projects/${encodeURIComponent(projectId)}/reports/${encodeURIComponent(runId)}.json`,
  );
}

export async function fetchReportMarkdown(
  projectId: string,
  runId: string,
): Promise<string> {
  const response = await fetch(
    `${API_BASE}/projects/${encodeURIComponent(projectId)}/reports/${encodeURIComponent(runId)}.md`,
  );
  if (!response.ok) {
    throw new ApiError(response.status, `HTTP_${response.status.toString()}`, response.statusText);
  }
  return response.text();
}
