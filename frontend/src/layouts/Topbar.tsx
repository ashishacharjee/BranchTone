/**
 * Topbar — breadcrumb, version chip, save state, search, run validation.
 * Visual source: DESIGN.md §3 and references/branchtone-master-ui.png.
 *
 * Slice 1: Controls are rendered; most are visibly disabled with reason text.
 * Run Validation is disabled until a validation engine is available.
 */
import { useLocation } from 'react-router-dom';
import { Search, RotateCcw, RotateCw, PlayCircle, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './Topbar.module.css';

const WORKSPACE_LABELS: Record<string, string> = {
  '/overview': 'Overview',
  '/story-graph': 'Story Graph',
  '/narrative-map': 'Narrative Map',
  '/cue-library': 'Cue Library',
  '/route-lab': 'Route Lab',
  '/validation-centre': 'Validation Centre',
  '/reports': 'Reports',
};

export function Topbar() {
  const location = useLocation();
  const workspaceLabel =
    Object.entries(WORKSPACE_LABELS).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ?? 'Overview';

  return (
    <header className={styles.topbar} aria-label="Application toolbar">
      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <span className={styles.crumb}>Projects</span>
        <ChevronRight size={12} aria-hidden="true" className={styles.crumbSep} />
        <span className={styles.crumb}>The Last Signal</span>
        <ChevronRight size={12} aria-hidden="true" className={styles.crumbSep} />
        <span className={styles.crumbCurrent} aria-current="page">
          {workspaceLabel}
        </span>
      </nav>

      {/* ── Version chip + save state ────────────────────────────────── */}
      <div className={styles.meta}>
        <span className={styles.versionChip} aria-label="Story version 0.4">
          v0.4
        </span>
        <span className={styles.saveState} aria-label="Save state: Saved">
          <CheckCircle size={13} aria-hidden="true" />
          Saved
        </span>
      </div>

      {/* ── Spacer ───────────────────────────────────────────────────── */}
      <div className={styles.spacer} />

      {/* ── Search ───────────────────────────────────────────────────── */}
      <div className={styles.searchWrap} role="search">
        <Search size={13} aria-hidden="true" className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search passages or commands…"
          aria-label="Search passages or commands"
          disabled
          title="Search is not yet available — requires a loaded story."
        />
      </div>

      {/* ── Undo / Redo ──────────────────────────────────────────────── */}
      <div className={styles.historyBtns} role="group" aria-label="Edit history">
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Undo"
          disabled
          title="Undo is not yet available."
        >
          <RotateCcw size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Redo"
          disabled
          title="Redo is not yet available."
        >
          <RotateCw size={15} aria-hidden="true" />
        </button>
      </div>

      {/* ── Run Validation CTA ───────────────────────────────────────── */}
      <button
        type="button"
        className={styles.runValidation}
        aria-label="Run Validation — requires domain engine (not yet implemented)"
        disabled
        title="Run Validation requires the domain engine. See COMPLIANCE_MATRIX.md — pending organizer classification."
      >
        <PlayCircle size={15} aria-hidden="true" />
        Run Validation
      </button>
    </header>
  );
}
