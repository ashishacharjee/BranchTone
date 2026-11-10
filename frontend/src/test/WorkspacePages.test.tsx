/**
 * Workspace placeholder tests — Slice 1.
 * Verifies each workspace page renders with correct heading and pending notes.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { OverviewPage } from '../features/overview/OverviewPage';
import { StoryGraphPage } from '../features/story-graph/StoryGraphPage';
import { NarrativeMapPage } from '../features/narrative-map/NarrativeMapPage';
import { CueLibraryPage } from '../features/cue-library/CueLibraryPage';
import { RouteLabPage } from '../features/route-lab/RouteLabPage';
import { ValidationCentrePage } from '../features/validation-centre/ValidationCentrePage';
import { ReportsPage } from '../features/reports/ReportsPage';

function wrap(element: React.ReactElement) {
  return render(<MemoryRouter>{element}</MemoryRouter>);
}

describe('Workspace placeholder pages', () => {
  it('Overview renders with correct heading', () => {
    wrap(<OverviewPage />);
    expect(screen.getByRole('heading', { name: /Overview/i })).toBeInTheDocument();
  });

  it('Story Graph renders with compliance note about BT-001', () => {
    wrap(<StoryGraphPage />);
    expect(screen.getByRole('heading', { name: /Story Graph/i })).toBeInTheDocument();
    // Must mention BT-001 and backend requirement
    expect(screen.getByText(/BT-001 must be derived from the backend rule evaluator/i)).toBeInTheDocument();
  });

  it('Narrative Map renders', () => {
    wrap(<NarrativeMapPage />);
    expect(screen.getByRole('heading', { name: /Narrative Map/i })).toBeInTheDocument();
  });

  it('Cue Library renders with missing asset note', () => {
    wrap(<CueLibraryPage />);
    expect(screen.getByRole('heading', { name: /Cue Library/i })).toBeInTheDocument();
    expect(screen.getByText(/traitor_theme\.wav shown as missing/i)).toBeInTheDocument();
  });

  it('Route Lab renders', () => {
    wrap(<RouteLabPage />);
    expect(screen.getByRole('heading', { name: /Route Lab/i })).toBeInTheDocument();
  });

  it('Validation Centre renders with CONFIRM note', () => {
    wrap(<ValidationCentrePage />);
    expect(screen.getByRole('heading', { name: /Validation Centre/i })).toBeInTheDocument();
    expect(screen.getByText(/Deterministic validation rules are CONFIRM/i)).toBeInTheDocument();
  });

  it('Reports renders', () => {
    wrap(<ReportsPage />);
    expect(screen.getByRole('heading', { name: /Reports/i })).toBeInTheDocument();
  });
});
