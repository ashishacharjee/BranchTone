/**
 * BranchTone Zustand store — transient workspace/selection/playback state.
 *
 * Rules (AGENTS.md §5):
 *   - One selectedRouteId source of truth.
 *   - One selectedPassageId source of truth.
 *   - TanStack Query owns server data; this store owns UI-only transient state.
 *   - No copied mutable route/finding entities; derived data is computed from IDs.
 */
import { create } from 'zustand';
import type { WorkspaceId } from '../types/branchtone';

interface WorkspaceState {
  // ── Project context ──────────────────────────────────────────────────────
  activeProjectId: string | null;
  activeStoryVersionId: string | null;
  demoMode: boolean;

  // ── Workspace navigation ─────────────────────────────────────────────────
  activeWorkspace: WorkspaceId;

  // ── Selection — single sources of truth ──────────────────────────────────
  selectedRouteId: string | null;
  selectedPassageId: string | null;
  selectedFindingId: string | null;

  // ── Simulation / validation run references ───────────────────────────────
  activeSimulationId: string | null;
  activeValidationRunId: string | null;

  // ── Actions ──────────────────────────────────────────────────────────────
  setActiveWorkspace: (workspace: WorkspaceId) => void;
  setSelectedRoute: (routeId: string | null) => void;
  setSelectedPassage: (passageId: string | null) => void;
  /**
   * Deep-link from a finding: sets route, passage and finding consistently.
   * (AGENTS.md §5 — finding deep-link updates all three together)
   */
  navigateToFinding: (opts: {
    findingId: string;
    routeId: string;
    passageId: string;
  }) => void;
  setActiveProject: (projectId: string, versionId: string) => void;
  setDemoMode: (enabled: boolean) => void;
  setActiveSimulation: (simulationId: string | null) => void;
  setActiveValidationRun: (runId: string | null) => void;
  reset: () => void;
}

const initialState = {
  activeProjectId: null,
  activeStoryVersionId: null,
  demoMode: false,
  activeWorkspace: 'story-graph' as WorkspaceId,
  selectedRouteId: null,
  selectedPassageId: null,
  selectedFindingId: null,
  activeSimulationId: null,
  activeValidationRunId: null,
};

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  ...initialState,

  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

  setSelectedRoute: (routeId) =>
    set({
      selectedRouteId: routeId,
      // Clear passage selection when route changes (AGENTS.md §5)
      selectedPassageId: null,
      selectedFindingId: null,
    }),

  setSelectedPassage: (passageId) =>
    set({
      selectedPassageId: passageId,
      // Clear finding when passage changes independently
      selectedFindingId: null,
    }),

  navigateToFinding: ({ findingId, routeId, passageId }) =>
    set({
      selectedFindingId: findingId,
      selectedRouteId: routeId,
      selectedPassageId: passageId,
    }),

  setActiveProject: (projectId, versionId) =>
    set({
      activeProjectId: projectId,
      activeStoryVersionId: versionId,
    }),

  setDemoMode: (enabled) => set({ demoMode: enabled }),

  setActiveSimulation: (simulationId) => set({ activeSimulationId: simulationId }),

  setActiveValidationRun: (runId) => set({ activeValidationRunId: runId }),

  reset: () => set(initialState),
}));
