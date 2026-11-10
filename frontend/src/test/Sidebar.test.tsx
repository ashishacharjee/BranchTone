/**
 * Sidebar navigation tests — Slice 1.
 * Tests: renders all 7 nav links; active class applied to current route.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../layouts/Sidebar';

function renderSidebar(initialPath = '/story-graph') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  it('renders the BranchTone brand', () => {
    renderSidebar();
    expect(screen.getByText('BranchTone')).toBeInTheDocument();
  });

  it('renders all 7 navigation links', () => {
    renderSidebar();
    const links = [
      'Overview',
      'Story Graph',
      'Narrative Map',
      'Cue Library',
      'Route Lab',
      'Validation Centre',
      'Reports',
    ];
    links.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('shows the project name', () => {
    renderSidebar();
    expect(screen.getByText('The Last Signal')).toBeInTheDocument();
  });

  it('shows the version label', () => {
    renderSidebar();
    expect(screen.getByText('v0.4')).toBeInTheDocument();
  });

  it('marks the active workspace link with aria-current="page"', () => {
    renderSidebar('/overview');
    const overviewLink = screen.getByRole('link', { name: /Overview/i });
    expect(overviewLink).toHaveAttribute('aria-current', 'page');
  });

  it('shows Ready status', () => {
    renderSidebar();
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });
});
