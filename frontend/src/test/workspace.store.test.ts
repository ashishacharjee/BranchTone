/**
 * Zustand workspace store tests — Slice 1.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useWorkspaceStore } from '../stores/workspace';

// Reset store before each test
beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('useWorkspaceStore', () => {
  it('has correct initial state', () => {
    const state = useWorkspaceStore.getState();
    expect(state.selectedRouteId).toBeNull();
    expect(state.selectedPassageId).toBeNull();
    expect(state.selectedFindingId).toBeNull();
    expect(state.demoMode).toBe(false);
    expect(state.activeWorkspace).toBe('story-graph');
  });

  it('setSelectedRoute clears passage and finding', () => {
    const store = useWorkspaceStore.getState();
    store.navigateToFinding({ findingId: 'fnd_1', routeId: 'route_b', passageId: 'P-003' });
    expect(useWorkspaceStore.getState().selectedFindingId).toBe('fnd_1');
    // Changing route clears both
    useWorkspaceStore.getState().setSelectedRoute('route_a');
    const after = useWorkspaceStore.getState();
    expect(after.selectedRouteId).toBe('route_a');
    expect(after.selectedPassageId).toBeNull();
    expect(after.selectedFindingId).toBeNull();
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

  it('setDemoMode enables demo flag', () => {
    useWorkspaceStore.getState().setDemoMode(true);
    expect(useWorkspaceStore.getState().demoMode).toBe(true);
  });

  it('reset returns to initial state', () => {
    const store = useWorkspaceStore.getState();
    store.setDemoMode(true);
    store.setSelectedRoute('route_b');
    store.reset();
    const after = useWorkspaceStore.getState();
    expect(after.demoMode).toBe(false);
    expect(after.selectedRouteId).toBeNull();
  });
});
