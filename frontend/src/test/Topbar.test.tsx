/**
 * Topbar tests — Slice 1.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Topbar } from '../layouts/Topbar';

function renderTopbar(initialPath = '/story-graph') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Topbar />
    </MemoryRouter>,
  );
}

describe('Topbar', () => {
  it('shows the breadcrumb project name', () => {
    renderTopbar();
    expect(screen.getByText('The Last Signal')).toBeInTheDocument();
  });

  it('shows current workspace in breadcrumb', () => {
    renderTopbar('/story-graph');
    expect(screen.getByText('Story Graph')).toBeInTheDocument();
  });

  it('shows version chip v0.4', () => {
    renderTopbar();
    expect(screen.getByLabelText(/Story version 0.4/i)).toBeInTheDocument();
  });

  it('Run Validation button is disabled with reason', () => {
    renderTopbar();
    const btn = screen.getByRole('button', { name: /Run Validation/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('title');
  });

  it('search input is disabled in Slice 1', () => {
    renderTopbar();
    const input = screen.getByRole('searchbox');
    expect(input).toBeDisabled();
  });
});
