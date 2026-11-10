/**
 * Zustand workspace store tests — Slice 2.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useWorkspaceStore } from '../stores/workspace';

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('useWorkspaceStore', () => {
  it('has correct canonical initial demonstration state', () => {
    const state = useWorkspaceStore.getState();
    expect(state.selectedRouteId).toBe('route_b');
    expect(state.selectedPassageId).toBe('P-003');
    expect(state.selectedFindingId).toBe('fnd_bt001_route_b_p003_demo');
    expect(state.demoMode).toBe(true);
    expect(state.activeWorkspace).toBe('story-graph');
  });

  it('setSelectedRoute updates route', () => {
    useWorkspaceStore.getState().setSelectedRoute('route_a');
    const after = useWorkspaceStore.getState();
    expect(after.selectedRouteId).toBe('route_a');
  });

  it('setSelectedPassage updates selected passage and finding association', () => {
    useWorkspaceStore.getState().setSelectedPassage('P-001');
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-001');
    expect(useWorkspaceStore.getState().selectedFindingId).toBeNull();

    useWorkspaceStore.getState().setSelectedPassage('P-003');
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-003');
    expect(useWorkspaceStore.getState().selectedFindingId).toBe('fnd_bt001_route_b_p003_demo');
  });

  it('navigateToFinding sets all three consistently', () => {
    useWorkspaceStore.getState().navigateToFinding({
      findingId: 'fnd_bt001',
      routeId: 'route_b',
      passageId: 'P-003',
    });
    const s = useWorkspaceStore.getState();
    expect(s.selectedFindingId).toBe('fnd_bt001');
    expect(s.selectedRouteId).toBe('route_b');
    expect(s.selectedPassageId).toBe('P-003');
  });

  it('setActiveWorkspace updates workspace', () => {
    useWorkspaceStore.getState().setActiveWorkspace('validation-centre');
    expect(useWorkspaceStore.getState().activeWorkspace).toBe('validation-centre');
  });

  it('reset returns to initial demonstration state', () => {
    const store = useWorkspaceStore.getState();
    store.setDemoMode(false);
    store.setSelectedRoute('route_a');
    store.reset();
    const after = useWorkspaceStore.getState();
    expect(after.demoMode).toBe(true);
    expect(after.selectedRouteId).toBe('route_b');
    expect(after.selectedPassageId).toBe('P-003');
  });
});
