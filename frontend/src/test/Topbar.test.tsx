/**
 * Topbar tests — Shell Navigation & Interaction.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Topbar } from '../layouts/Topbar';

function renderTopbar(initialPath = '/story-graph') {
  return render(
    <MemoryRouter
      initialEntries={[initialPath]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
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

  it('Run Validation button opens compliance gating modal', () => {
    renderTopbar();
    const btn = screen.getByRole('button', { name: /Run Validation/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('title');
    fireEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Deterministic Validation Engine Status/i)).toBeInTheDocument();
  });

  it('search input is enabled and interactive', () => {
    renderTopbar();
    const input = screen.getByRole('searchbox');
    expect(input).toBeEnabled();
    fireEvent.change(input, { target: { value: 'Air Vent' } });
    expect(input).toHaveValue('Air Vent');
  });

  it('Judge Tour (60s) button opens the judge walkthrough modal', () => {
    renderTopbar();
    const btn = screen.getByRole('button', { name: /Judge Tour/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.getByText(/60s Judge Walkthrough/i)).toBeInTheDocument();
    expect(screen.getByText(/The Problem in Branching Game Audio/i)).toBeInTheDocument();
  });

  it('Hotkeys button opens the keyboard shortcuts modal', () => {
    renderTopbar();
    const btn = screen.getByRole('button', { name: /Hotkeys/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.getByText(/Studio Keyboard Shortcuts/i)).toBeInTheDocument();
    expect(screen.getByText(/Toggle Route A \/ Route B/i)).toBeInTheDocument();
  });

  it('Audition Sound button triggers sound audition safely', () => {
    renderTopbar();
    const btn = screen.getByRole('button', { name: /Audition Sound/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(screen.getByText(/Auditioning.../i)).toBeInTheDocument();
  });
});
