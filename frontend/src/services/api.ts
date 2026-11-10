/**
 * BranchTone typed API client.
 *
 * Rules:
 *   - No fetch calls in view components (ARCHITECTURE.md §6).
 *   - All responses are validated with Zod at the boundary.
 *   - Domain logic (parsing, validation) lives in the backend only.
 *
 * Slice 1: Only the health endpoint is active. All other endpoints are
 * typed stubs — they will throw NotImplementedError until the corresponding
 * backend module is implemented and compliance-cleared.
 */
import { z } from 'zod';
import type { HealthResponse } from '../types/branchtone';

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
  if (!headers.has('Content-Type')) {
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

// ── Projects (stub — not yet implemented) ────────────────────────────────────

export function fetchProject(_projectId: string): Promise<never> {
  return Promise.reject(
    new ApiError(501, 'NOT_IMPLEMENTED', 'Project API not yet implemented (Slice 2+).'),
  );
}

export function fetchProjectGraph(_projectId: string): Promise<never> {
  return Promise.reject(
    new ApiError(501, 'NOT_IMPLEMENTED', 'Graph API not yet implemented (Slice 2+).'),
  );
}
