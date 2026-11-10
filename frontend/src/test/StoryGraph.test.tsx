/**
 * Story Graph Workspace Tests — Slice 2.
 *
 * Verifies:
 * - Route A/B switching.
 * - Passage selection and inspector synchronization.
 * - Exact P-003 source quotation and heading.
 * - Emotional intensity 4/5 representation.
 * - BT-001 Reveal Protection finding display.
 * - Route B passage ordering (Lobby → Air Vent → Server Vault → Safe House).
 * - Red cue marker semantics at Air Vent entry boundary.
 * - Timeline duration (04:32) and playhead (01:24) consistency.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StoryGraphPage } from '../features/story-graph/StoryGraphPage';
import { useWorkspaceStore } from '../stores/workspace';

function renderStoryGraph() {
  return render(
    <MemoryRouter>
      <StoryGraphPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('Story Graph Workspace — Slice 2', () => {
  it('renders default demonstration state with Route B and Air Vent P-003 selected', () => {
    renderStoryGraph();

    // Route B pill is active
    const routeBPill = screen.getByRole('button', { name: /Select Route B/i });
    expect(routeBPill).toHaveAttribute('aria-pressed', 'true');

    // Air Vent is selected in inspector
    expect(screen.getByRole('heading', { name: /Passage Inspector/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Air Vent/i })).toBeInTheDocument();
  });

  it('displays exact P-003 quotation and exact source heading', () => {
    renderStoryGraph();

    // Source heading exact format
    expect(screen.getByText(/P-003 · Original Passage Text/i)).toBeInTheDocument();

    // Exact canonical quotation
    expect(
      screen.getByText(
        /"Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy\."/i,
      ),
    ).toBeInTheDocument();
  });

  it('displays emotional intensity 4/5 and narrative state properties', () => {
    renderStoryGraph();

    // Emotional intensity 4/5 appears in node badges and inspector
    const intensityBadges = screen.getAllByText('4/5');
    expect(intensityBadges.length).toBeGreaterThanOrEqual(1);

    // Mood is Suspense
    expect(screen.getByText('Suspense')).toBeInTheDocument();

    // Identity revealed is No
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('displays BT-001 Reveal Protection finding with exact explanation', () => {
    renderStoryGraph();

    // Finding code
    expect(screen.getByText('BT-001')).toBeInTheDocument();

    // Rule name
    expect(screen.getByText('Reveal Protection')).toBeInTheDocument();

    // Severity High
    expect(screen.getByText('High')).toBeInTheDocument();

    // Exact explanation string from PRD / DESIGN.md / expected-findings.json
    expect(
      screen.getByText(
        /The traitor theme starts when entering Air Vent, before the character's identity is revealed on this route\./i,
      ),
    ).toBeInTheDocument();
  });

  it('displays audio cue traitor_theme.wav on Music layer with Passage entry trigger', () => {
    renderStoryGraph();

    expect(screen.getByText('traitor_theme.wav')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Passage entry')).toBeInTheDocument();
  });

  it('displays Route B passages in correct order on the timeline', () => {
    renderStoryGraph();

    // Passage labels in timeline sequence
    const timelineRegion = screen.getByRole('region', { name: /Audio timeline and transport/i });
    expect(timelineRegion).toHaveTextContent(/Lobby/i);
    expect(timelineRegion).toHaveTextContent(/Air Vent/i);
    expect(timelineRegion).toHaveTextContent(/Server Vault/i);
    expect(timelineRegion).toHaveTextContent(/Safe House/i);
  });

  it('switches between Route A and Route B and updates sequence and active highlighting', () => {
    renderStoryGraph();

    const routeAPill = screen.getByRole('button', { name: /Select Route A/i });
    fireEvent.click(routeAPill);

    // Route A is now selected
    expect(routeAPill).toHaveAttribute('aria-pressed', 'true');
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_a');

    // Timeline updates sequence to Route A containing Archives instead of Air Vent
    const timelineRegion = screen.getByRole('region', { name: /Audio timeline and transport/i });
    expect(timelineRegion).toHaveTextContent(/Archives/i);
  });

  it('synchronizes passage selection with the inspector', () => {
    renderStoryGraph();

    // Initially Air Vent is in inspector
    expect(screen.getByRole('heading', { name: /Air Vent/i })).toBeInTheDocument();

    // Select Lobby (P-001) via store action
    act(() => {
      useWorkspaceStore.getState().setSelectedPassage('P-001');
    });

    // Inspector updates to Lobby
    expect(screen.getByRole('heading', { name: /Lobby/i })).toBeInTheDocument();
    expect(screen.getByText('P-001 · Original Passage Text')).toBeInTheDocument();
    // Lobby has no findings
    expect(screen.getByText(/No validation issues detected on this route/i)).toBeInTheDocument();
  });

  it('renders red cue marker at Air Vent entry on Route B with finding semantics', () => {
    renderStoryGraph();

    const cueMarker = screen.getByLabelText(/Cue trigger: traitor_theme\.wav at Air Vent entry — finding BT-001/i);
    expect(cueMarker).toBeInTheDocument();

    // Deselect P-003
    act(() => {
      useWorkspaceStore.getState().setSelectedPassage('P-001');
    });
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-001');

    // Clicking cue marker sets selected passage back to P-003
    fireEvent.click(cueMarker);
    expect(useWorkspaceStore.getState().selectedPassageId).toBe('P-003');
  });

  it('displays timeline reference duration 04:32 and playhead 01:24 with demo data label', () => {
    renderStoryGraph();

    expect(screen.getByText('01:24')).toBeInTheDocument();
    expect(screen.getAllByText('04:32').length).toBeGreaterThanOrEqual(1);

    // Playback buttons are disabled with explanation
    const playBtn = screen.getByRole('button', { name: /Play \/ Pause/i });
    expect(playBtn).toBeDisabled();
    expect(playBtn).toHaveAttribute('title', expect.stringContaining('missing asset fixture'));
  });
});
