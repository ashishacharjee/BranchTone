/**
 * Cross-Workspace Integration & Shared-State Verification Tests.
 *
 * Verifies the exact workflows mandated by acceptance audit:
 * 1. Story Graph → select Air Vent → Validation Centre → inspect BT-001.
 * 2. Validation Centre → inspect finding → return to Story Graph with Air Vent P-003 selected.
 * 3. Route Lab → switch Route A/B → verify Story Graph and timeline synchronization.
 * 4. Narrative Map → switch routes → verify shared selected route.
 * 5. Reports → export JSON → verify fixture provenance is preserved.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { OverviewPage } from '../features/overview/OverviewPage';
import { CueLibraryPage } from '../features/cue-library/CueLibraryPage';
import { StoryGraphPage } from '../features/story-graph/StoryGraphPage';
import { ValidationCentrePage } from '../features/validation-centre/ValidationCentrePage';
import { RouteLabPage } from '../features/route-lab/RouteLabPage';
import { NarrativeMapPage } from '../features/narrative-map/NarrativeMapPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { useWorkspaceStore } from '../stores/workspace';
import { getReportExportPayload } from '../services/fixtures';

function renderAppWithRouter(initialRoute = '/story-graph') {
  return render(
    <MemoryRouter
      initialEntries={[initialRoute]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/story-graph" element={<StoryGraphPage />} />
        <Route path="/narrative-map" element={<NarrativeMapPage />} />
        <Route path="/cue-library" element={<CueLibraryPage />} />
        <Route path="/route-lab" element={<RouteLabPage />} />
        <Route path="/validation-centre" element={<ValidationCentrePage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('Cross-Workspace Integration & Shared-State', () => {
  it('Workflow 1: Story Graph → select Air Vent → Validation Centre → inspect BT-001', () => {
    // 1. In Story Graph, Air Vent (P-003) is selected on Route B
    renderAppWithRouter('/story-graph');

    expect(screen.getByRole('heading', { name: /Air Vent/i })).toBeInTheDocument();
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-003');
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_b');

    // 2. Navigate to Validation Centre
    act(() => {
      useWorkspaceStore.getState().setActiveWorkspace('validation-centre');
    });

    const { unmount } = renderAppWithRouter('/validation-centre');

    // 3. Finding BT-001 is active in Validation Centre
    expect(screen.getAllByText('BT-001').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Reveal Protection').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/P-003 \(Air Vent\)/i)).toBeInTheDocument();

    unmount();
  });

  it('Workflow 2: Validation Centre → inspect finding → return to Story Graph with Air Vent P-003 selected', () => {
    // 1. Start in Validation Centre with a non-Air-Vent selection in store
    act(() => {
      useWorkspaceStore.getState().setSelectedPassage('P-001');
    });
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-001');

    renderAppWithRouter('/validation-centre');

    // 2. Click "Inspect in Story Graph Workspace"
    const inspectBtn = screen.getByRole('button', { name: /Inspect in Story Graph Workspace/i });
    fireEvent.click(inspectBtn);

    // 3. Verify store synchronization: route_b, P-003, and fnd_bt001_route_b_p003_demo
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_b');
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-003');
    expect(useWorkspaceStore.getState().selectedFindingId).toBe('fnd_bt001_route_b_p003_demo');

    // 4. In Story Graph, Air Vent and its exact text are rendered
    expect(screen.getByRole('heading', { name: /Air Vent/i })).toBeInTheDocument();
    expect(screen.getByText(/P-003 · Original Passage Text/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /"Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy\."/i,
      ),
    ).toBeInTheDocument();
  });

  it('Workflow 3: Route Lab → switch Route A/B → verify Story Graph and timeline synchronization', () => {
    // 1. Start in Route Lab
    const { unmount } = renderAppWithRouter('/route-lab');

    // Default route is Route B
    expect(screen.getByRole('button', { name: /Select Route B/i })).toHaveAttribute('aria-pressed', 'true');

    // 2. Switch to Route A in Route Lab
    const routeAPill = screen.getByRole('button', { name: /Select Route A/i });
    fireEvent.click(routeAPill);

    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_a');
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-002');
    unmount();

    // 3. Render Story Graph — verify Route A is selected and timeline reflects Archives
    const storyGraph = renderAppWithRouter('/story-graph');

    const graphRouteAPill = screen.getByRole('button', { name: /Select Route A/i });
    expect(graphRouteAPill).toHaveAttribute('aria-pressed', 'true');

    const timelineRegion = screen.getByRole('region', { name: /Audio timeline and transport/i });
    expect(timelineRegion).toHaveTextContent(/Archives/i);
    // Red cue marker is NOT visible on Route A
    expect(screen.queryByLabelText(/Cue trigger: traitor_theme\.wav at Air Vent entry/i)).not.toBeInTheDocument();

    storyGraph.unmount();
  });

  it('Workflow 4: Narrative Map → switch routes → verify shared selected route', () => {
    renderAppWithRouter('/narrative-map');

    // Default is Route B
    expect(screen.getByRole('button', { name: /Select Route B/i })).toHaveAttribute('aria-pressed', 'true');
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_b');

    // Switch to Route A
    const routeAPill = screen.getByRole('button', { name: /Select Route A/i });
    fireEvent.click(routeAPill);

    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_a');
    expect(screen.getByText('Archives')).toBeInTheDocument();

    // Switch back to Route B
    const routeBPill = screen.getByRole('button', { name: /Select Route B/i });
    fireEvent.click(routeBPill);

    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_b');
    expect(screen.getByText('Air Vent')).toBeInTheDocument();
  });

  it('Workflow 5: Reports → export JSON → verify fixture provenance is preserved', () => {
    // 1. Verify structured export payload directly
    const payload = getReportExportPayload();

    expect(payload.report_metadata.provenance).toBe('demo_fixture_preview');
    expect(payload.report_metadata.generator).toContain('BranchTone QA Workbench');
    expect(payload.project.project_id).toBe('prj_the_last_signal_demo');
    expect(payload.story_version.version_label).toBe('v0.4');
    expect(payload.exploration_scope.coverage_status).toBe('not_evaluated');
    expect(payload.exploration_scope.coverage_explanation).toContain('Full graph traversal coverage is calculated by the route exploration engine');

    // Verify findings include BT-001 with demo provenance
    expect(payload.findings.length).toBe(1);
    expect(payload.findings[0]?.finding_code).toBe('BT-001');
    expect(payload.findings[0]?.rule_id).toBe('RULE_REVEAL_PROTECTION');
    expect(payload.findings[0]?.provenance).toBe('demo_fixture');

    // 2. Test Export button click in Reports view
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderAppWithRouter('/reports');

    const exportBtn = screen.getByRole('button', { name: /Export JSON Report/i });
    fireEvent.click(exportBtn);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('Workflow F: Navigate between all seven workspaces and verify shared state consistency', () => {
    // Start on Route B with Air Vent selected
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_b');
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-003');
    expect(useWorkspaceStore.getState().selectedFindingId).toBe('fnd_bt001_route_b_p003_demo');

    // 1. Overview
    const overview = renderAppWithRouter('/overview');
    expect(screen.getByRole('region', { name: /Project Overview/i })).toBeInTheDocument();
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_b');
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-003');
    overview.unmount();

    // 2. Story Graph
    const graph = renderAppWithRouter('/story-graph');
    expect(screen.getByTestId('story-graph-workspace')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Air Vent/i })).toBeInTheDocument();
    graph.unmount();

    // 3. Narrative Map
    const narrativeMap = renderAppWithRouter('/narrative-map');
    expect(screen.getByRole('region', { name: /Narrative Map Workspace/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Route B/i })).toHaveAttribute('aria-pressed', 'true');
    narrativeMap.unmount();

    // 4. Cue Library
    const cueLib = renderAppWithRouter('/cue-library');
    expect(screen.getByRole('region', { name: /Audio Cue Library/i })).toBeInTheDocument();
    expect(screen.getAllByText('traitor_theme.wav').length).toBeGreaterThanOrEqual(1);
    cueLib.unmount();

    // 5. Route Lab
    const routeLab = renderAppWithRouter('/route-lab');
    expect(screen.getByRole('region', { name: /Route Lab Workspace/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Route B/i })).toHaveAttribute('aria-pressed', 'true');
    routeLab.unmount();

    // 6. Validation Centre
    const valCentre = renderAppWithRouter('/validation-centre');
    expect(screen.getByRole('region', { name: /Validation Centre Workspace/i })).toBeInTheDocument();
    expect(screen.getAllByText('BT-001').length).toBeGreaterThanOrEqual(1);
    valCentre.unmount();

    // 7. Reports
    const reports = renderAppWithRouter('/reports');
    expect(screen.getByRole('region', { name: /Validation Reports Workspace/i })).toBeInTheDocument();
    expect(screen.getByText('Not evaluated')).toBeInTheDocument();
    reports.unmount();

    // State remains 100% stable and consistent across all 7 transitions
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_b');
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-003');
    expect(useWorkspaceStore.getState().selectedFindingId).toBe('fnd_bt001_route_b_p003_demo');
  });
});
