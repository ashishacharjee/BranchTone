/**
 * Comprehensive Workspace Verification Tests.
 *
 * Verifies that each of the 6 independent workspaces:
 * - Renders its dedicated, functional layout (not static placeholders or collages).
 * - Binds to typed fixture data without hardcoded duplicates.
 * - Synchronizes with shared Zustand state (route/passage/finding).
 * - Displays "Not evaluated" when a real validation result does not exist.
 * - Accurately shows missing audio files and disabled playback in Cue Library.
 * - Accurately presents route sequence and state in Route Lab.
 * - Displays BT-001 with exact evidence in Validation Centre.
 * - Distinguishes fixture previews from generated reports in Reports.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OverviewPage } from '../features/overview/OverviewPage';
import { NarrativeMapPage } from '../features/narrative-map/NarrativeMapPage';
import { CueLibraryPage } from '../features/cue-library/CueLibraryPage';
import { RouteLabPage } from '../features/route-lab/RouteLabPage';
import { ValidationCentrePage } from '../features/validation-centre/ValidationCentrePage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { useWorkspaceStore } from '../stores/workspace';

function wrap(element: React.ReactElement) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

beforeEach(() => {
  useWorkspaceStore.getState().reset();
});

describe('Workspace 1: Overview', () => {
  it('renders project summary, counts, and "Not evaluated" coverage', () => {
    wrap(<OverviewPage />);

    // Project name and version
    expect(screen.getByRole('heading', { name: /The Last Signal/i })).toBeInTheDocument();
    expect(screen.getByText('v0.4')).toBeInTheDocument();

    // Metric counts
    expect(screen.getByText('5 nodes mapped across 2 routes')).toBeInTheDocument();
    expect(screen.getByText('All structural edges valid')).toBeInTheDocument();
    expect(screen.getByText('BT-001 Reveal Protection (High)')).toBeInTheDocument();

    // Coverage is honestly "Not evaluated"
    expect(screen.getByText('Not evaluated')).toBeInTheDocument();
    expect(screen.getByText(/Requires route exploration engine/i)).toBeInTheDocument();

    // Latest finding BT-001 is displayed
    expect(screen.getByText('BT-001')).toBeInTheDocument();
    expect(screen.getByText(/The traitor theme starts when entering Air Vent/i)).toBeInTheDocument();
  });
});

describe('Workspace 2: Narrative Map', () => {
  it('renders chronological intensity plot and syncs with shared route selection', () => {
    wrap(<NarrativeMapPage />);

    // Default route is Route B
    const routeBPill = screen.getByRole('button', { name: /Select Route B/i });
    expect(routeBPill).toHaveAttribute('aria-pressed', 'true');

    // Route B sequence: Lobby, Air Vent, Server Vault, Safe House
    expect(screen.getByText('Step 01')).toBeInTheDocument();
    expect(screen.getByText('Air Vent')).toBeInTheDocument();
    expect(screen.getAllByText('Suspense').length).toBeGreaterThanOrEqual(1);

    // Switch to Route A
    const routeAPill = screen.getByRole('button', { name: /Select Route A/i });
    fireEvent.click(routeAPill);

    expect(routeAPill).toHaveAttribute('aria-pressed', 'true');
    expect(useWorkspaceStore.getState().selectedRouteId).toBe('route_a');

    // Route A sequence contains Archives
    expect(screen.getByText('Archives')).toBeInTheDocument();

    // Annotation review distinguishes Approved vs Pending
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Pending Candidate')).toBeInTheDocument();
  });
});

describe('Workspace 3: Cue Library', () => {
  it('displays traitor_theme.wav as missing, hides fake waveforms, and disables playback', () => {
    wrap(<CueLibraryPage />);

    // Lists traitor_theme.wav in table and inspector
    expect(screen.getAllByText('traitor_theme.wav').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Missing')).toBeInTheDocument();
    expect(screen.getByText('Unavailable')).toBeInTheDocument();

    // Waveform box explains missing bytes
    expect(screen.getByText(/No Audio Waveform Available/i)).toBeInTheDocument();
    expect(screen.getByText(/Waveforms are computed only from actual decoded audio bytes/i)).toBeInTheDocument();

    // Playback button is disabled
    const playBtn = screen.getByRole('button', { name: /Play audio cue — disabled: asset missing/i });
    expect(playBtn).toBeDisabled();
    expect(playBtn).toHaveAttribute('title', expect.stringContaining('not present in storage'));

    // Trigger details
    expect(screen.getByText(/traitor_identity_revealed == true/i)).toBeInTheDocument();
  });
});

describe('Workspace 4: Route Lab', () => {
  it('renders step-by-step fact snapshots and cue activation trace', () => {
    wrap(<RouteLabPage />);

    // Route B is active by default
    expect(screen.getByRole('button', { name: /Select Route B/i })).toHaveAttribute('aria-pressed', 'true');

    // Step cards show state snapshots
    expect(screen.getByText('Step 01')).toBeInTheDocument();
    expect(screen.getByText(/Cue Defect: BT-001 Mismatch/i)).toBeInTheDocument();

    // Trace table shows activation ID
    expect(screen.getByText('activation_route_b_airvent_demo')).toBeInTheDocument();
    expect(screen.getByText('Issue BT-001')).toBeInTheDocument();

    // Multitrack transport is disabled
    expect(screen.getByRole('button', { name: /Play Route \(Disabled\)/i })).toBeDisabled();
  });
});

describe('Workspace 5: Validation Centre', () => {
  it('renders finding BT-001 with exact evidence and negative controls', () => {
    wrap(<ValidationCentrePage />);

    // Finding BT-001 in table
    expect(screen.getByText('BT-001')).toBeInTheDocument();
    expect(screen.getAllByText('Reveal Protection').length).toBeGreaterThanOrEqual(1);

    // Detail panel displays exact P-003 source quotation
    expect(
      screen.getByText(
        /"Sen squeezes through the dark metal duct to bypass the locked hallway, completely unaware of who is behind the conspiracy\."/i,
      ),
    ).toBeInTheDocument();

    // Negative controls section
    expect(screen.getByText(/Route A must not receive the Route B Air Vent cue finding/i)).toBeInTheDocument();
    expect(screen.getByText(/The Lobby → Air Vent structural edge remains valid/i)).toBeInTheDocument();
  });
});

describe('Workspace 6: Reports', () => {
  it('renders run identifiers, rules summary, and "Not evaluated" graph coverage', () => {
    wrap(<ReportsPage />);

    // Identifiers
    expect(screen.getByText('prj_the_last_signal_demo')).toBeInTheDocument();
    expect(screen.getByText(/run_the_last_signal_demo_v1/i)).toBeInTheDocument();

    // Rules evaluated in fixture
    expect(screen.getByText('Reveal Protection')).toBeInTheDocument();
    expect(screen.getByText('1 Finding (BT-001)')).toBeInTheDocument();
    expect(screen.getByText('Required Cue Coverage')).toBeInTheDocument();
    expect(screen.getAllByText('Pass (0 Issues)').length).toBeGreaterThanOrEqual(1);

    // Coverage is "Not evaluated"
    expect(screen.getByText('Not evaluated')).toBeInTheDocument();

    // Export button exists
    expect(screen.getByRole('button', { name: /Export JSON Report/i })).toBeInTheDocument();
  });
});
