/**
 * BranchTone Zustand store — transient workspace/selection/playback state.
 *
 * Rules (AGENTS.md §5):
 *   - One selectedRouteId source of truth.
 *   - One selectedPassageId source of truth.
 *   - TanStack Query owns server data; this store owns UI-only transient state.
 *   - No copied mutable route/finding entities; derived data is computed from IDs.
 *   - Default demonstration state: Route B, Air Vent P-003, demoMode: true.
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

export const initialWorkspaceState = {
  activeProjectId: 'prj_the_last_signal_demo',
  activeStoryVersionId: 'ver_the_last_signal_v04',
  demoMode: true,
  activeWorkspace: 'story-graph' as WorkspaceId,
  selectedRouteId: 'route_b',
  selectedPassageId: 'P-003',
  selectedFindingId: 'fnd_bt001_route_b_p003_demo',
  activeSimulationId: null,
  activeValidationRunId: null,
};

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  ...initialWorkspaceState,

  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),

  setSelectedRoute: (routeId) =>
    set({
      selectedRouteId: routeId,
      // Clear or update finding if route changes
      selectedFindingId: null,
    }),

  setSelectedPassage: (passageId) =>
    set({
      selectedPassageId: passageId,
      // If P-003 is selected on Route B, connect finding BT-001
      selectedFindingId:
        passageId === 'P-003' ? 'fnd_bt001_route_b_p003_demo' : null,
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

  reset: () => set(initialWorkspaceState),
}));
