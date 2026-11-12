/**
 * Topbar — breadcrumb, version chip, save state, search, run validation.
 * Visual source: DESIGN.md §3 and references/branchtone-master-ui.png.
 *
 * Slice 1: Controls are rendered; most are visibly disabled with reason text.
 * Run Validation is disabled until a validation engine is available.
 */
import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  RotateCw,
  PlayCircle,
  ChevronRight,
  CheckCircle,
  X,
  ShieldAlert,
  ArrowRight,
  Info,
  Sparkles,
  Keyboard,
} from 'lucide-react';
import { getPassages, getAllFindings } from '../services/fixtures';
import { useWorkspaceStore } from '../stores/workspace';
import { playAuditionTone, playCueTriggerSound } from '../services/synth';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { JudgeTourModal } from '../components/JudgeTourModal';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { AdaptionLabsModal } from '../components/AdaptionLabsModal';
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAdaptionModalOpen, setIsAdaptionModalOpen] = useState(false);
  const [isPlayingAudition, setIsPlayingAudition] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const selectedRouteId = useWorkspaceStore((state) => state.selectedRouteId);
  const setSelectedPassage = useWorkspaceStore((state) => state.setSelectedPassage);
  const navigateToFinding = useWorkspaceStore((state) => state.navigateToFinding);

  // Global hotkeys hook
  useKeyboardShortcuts({
    onOpenTour: () => setIsJudgeTourOpen(true),
    onOpenShortcuts: () => setIsShortcutsOpen(true),
    onCloseModals: () => {
      setIsValidationModalOpen(false);
      setIsJudgeTourOpen(false);
      setIsShortcutsOpen(false);
    },
  });

  const handleAuditionToggle = () => {
    setIsPlayingAudition(true);
    playAuditionTone(440, 0.18);
    setTimeout(() => {
      playAuditionTone(selectedRouteId === 'route_b' ? 493.88 : 523.25, 0.18);
    }, 200);
    setTimeout(() => {
      playCueTriggerSound(selectedRouteId === 'route_b');
      setIsPlayingAudition(false);
    }, 420);
  };

  const passages = getPassages();
  const findings = getAllFindings();

  const workspaceLabel =
    Object.entries(WORKSPACE_LABELS).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ?? 'Overview';

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { passages: [], findings: [] };
    const q = searchQuery.toLowerCase().trim();

    const matchedPassages = passages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.passage_id.toLowerCase().includes(q) ||
        (p.raw_text && p.raw_text.toLowerCase().includes(q)),
    );

    const matchedFindings = findings.filter(
      (f) =>
        f.finding_code.toLowerCase().includes(q) ||
        f.rule_id.toLowerCase().includes(q) ||
        f.explanation.toLowerCase().includes(q),
    );

    return { passages: matchedPassages, findings: matchedFindings };
  }, [searchQuery, passages, findings]);

  const hasResults =
    searchResults.passages.length > 0 || searchResults.findings.length > 0;

  const handleSelectPassage = (passageId: string) => {
    setSelectedPassage(passageId);
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate('/story-graph');
  };

  const handleSelectFinding = (findingId: string, passageId: string, routeId: string) => {
    navigateToFinding({ findingId, passageId, routeId });
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate('/story-graph');
  };

  return (
    <header className={styles.topbar} aria-label="Application toolbar">
      {/* ── Breadcrumb ───────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <button
          type="button"
          className={styles.crumbLink}
          onClick={() => navigate('/overview')}
          title="Go to Projects Overview"
        >
          Projects
        </button>
        <ChevronRight size={12} aria-hidden="true" className={styles.crumbSep} />
        <button
          type="button"
          className={styles.crumbLink}
          onClick={() => navigate('/overview')}
          title="Go to The Last Signal Overview"
        >
          The Last Signal
        </button>
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
      <div className={styles.searchWrap} role="search" ref={searchRef}>
        <Search size={13} aria-hidden="true" className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search passages or findings…"
          aria-label="Search passages or findings"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.trim()) setIsSearchOpen(true);
          }}
        />

        {isSearchOpen && searchQuery.trim() && (
          <div className={styles.searchDropdown} role="listbox" aria-label="Search results">
            {hasResults ? (
              <>
                {searchResults.passages.length > 0 && (
                  <div>
                    <div className={styles.searchGroupTitle}>Passages</div>
                    {searchResults.passages.map((p) => (
                      <button
                        key={p.passage_id}
                        type="button"
                        className={styles.searchItem}
                        onClick={() => handleSelectPassage(p.passage_id)}
                        role="option"
                        aria-selected={false}
                      >
                        <span className={styles.searchItemTitle}>{p.title}</span>
                        <span className={styles.searchItemMeta}>{p.passage_id}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.findings.length > 0 && (
                  <div>
                    <div className={styles.searchGroupTitle}>Findings</div>
                    {searchResults.findings.map((f) => (
                      <button
                        key={f.finding_id}
                        type="button"
                        className={styles.searchItem}
                        onClick={() =>
                          handleSelectFinding(
                            f.finding_id,
                            f.passage_id,
                            f.affected_route_ids[0] ?? 'route_b',
                          )
                        }
                        role="option"
                        aria-selected={false}
                      >
                        <span className={styles.searchItemTitle} style={{ color: 'var(--bt-error)' }}>
                          {f.finding_code}: {f.rule_id === 'RULE_REVEAL_PROTECTION' ? 'Reveal Protection' : f.rule_id}
                        </span>
                        <span className={styles.searchItemMeta}>Passage {f.passage_id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className={styles.searchNoResults}>
                No passages or findings match "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Adaption Labs Sponsor Bonus Button ──────────────────────── */}
      <button
        type="button"
        className={styles.adaptionBadgeBtn}
        onClick={() => setIsAdaptionModalOpen(true)}
        title="Adaption Labs AI Engine — Fine-Tuning Sponsor Bonus Track"
        aria-label="Adaption Labs AI Engine Sponsor Details"
      >
        <Sparkles size={12} color="#4F46E5" aria-hidden="true" />
        <span>Adaption Labs AI</span>
      </button>

      {/* ── Judge Tour 60s CTA ───────────────────────────────────────── */}
      <button
        type="button"
        className={styles.judgeTourBtn}
        onClick={() => setIsJudgeTourOpen(true)}
        title="Open interactive 60-second walkthrough for hackathon judges (Hot key: T)"
      >
        <Sparkles size={14} aria-hidden="true" />
        <span>Judge Tour (60s)</span>
      </button>

      {/* ── Music Glass Audition Pill ─────────────────────────────────── */}
      <button
        type="button"
        className={[styles.musicGlassBtn, isPlayingAudition ? styles.musicGlassBtnActive : ''].join(' ')}
        onClick={handleAuditionToggle}
        disabled={isPlayingAudition}
        title="Audition synthesized route traversal & defect alert (Hotkey: Space)"
      >
        <div
          className={[styles.equalizer, isPlayingAudition ? 'equalizer-playing' : ''].join(' ')}
          aria-hidden="true"
        >
          <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '4px' }} />
          <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '9px' }} />
          <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '6px' }} />
          <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '11px' }} />
        </div>
        <span>{isPlayingAudition ? 'Auditioning...' : 'Audition Sound'}</span>
      </button>

      {/* ── Keyboard Shortcuts Button ─────────────────────────────────── */}
      <button
        type="button"
        className={styles.shortcutBtn}
        onClick={() => setIsShortcutsOpen(true)}
        title="View studio keyboard shortcuts (Hotkey: ?)"
      >
        <Keyboard size={13} aria-hidden="true" />
        <span>Hotkeys</span>
      </button>

      {/* ── Undo / Redo ──────────────────────────────────────────────── */}
      <div className={styles.historyBtns} role="group" aria-label="Edit history">
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Undo"
          disabled
          title="Undo is available during interactive story editing (Phase 2)."
        >
          <RotateCcw size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Redo"
          disabled
          title="Redo is available during interactive story editing (Phase 2)."
        >
          <RotateCw size={15} aria-hidden="true" />
        </button>
      </div>

      {/* ── Run Validation CTA ───────────────────────────────────────── */}
      <button
        type="button"
        className={styles.runValidation}
        aria-label="Run Validation — view status and compliance details"
        onClick={() => setIsValidationModalOpen(true)}
        title="View validation engine gating and execution status"
      >
        <PlayCircle size={15} aria-hidden="true" />
        Run Validation
      </button>

      {/* ── Run Validation Status Modal ──────────────────────────────── */}
      {isValidationModalOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="validation-modal-title"
          onClick={() => setIsValidationModalOpen(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="validation-modal-title" className={styles.modalTitle}>
                <ShieldAlert size={18} color="var(--bt-accent)" aria-hidden="true" />
                <span>Deterministic Validation Engine Status</span>
              </h2>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsValidationModalOpen(false)}
                aria-label="Close dialog"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>
                BranchTone's live validation engine executes four deterministic rules across compiled route simulation traces:
              </p>

              <div className={styles.modalStatusBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Engine Classification:</span>
                  <span style={{ color: 'var(--bt-accent)' }}>Gated per COMPLIANCE_MATRIX.md</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Current Baseline:</span>
                  <span>Typed Verification Fixtures (Active)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Verified Issue in Fixtures:</span>
                  <span style={{ color: 'var(--bt-error)', fontWeight: 600 }}>
                    BT-001 (Route B · Air Vent Entry)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--bt-text-muted)' }}>
                <Info size={14} color="var(--bt-accent)" style={{ flexShrink: 0 }} aria-hidden="true" />
                <span>
                  Dynamic execution is scheduled for Milestone M5 during the 6-hour live sprint on 21 November 2026.
                </span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalSecondaryBtn}
                onClick={() => setIsValidationModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className={styles.modalPrimaryBtn}
                onClick={() => {
                  setIsValidationModalOpen(false);
                  navigate('/validation-centre');
                }}
              >
                <span>View Findings in Validation Centre</span>
                <ArrowRight size={13} style={{ display: 'inline', marginLeft: '6px' }} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Judge 60s Walkthrough Modal ──────────────────────────────── */}
      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
      />

      {/* ── Adaption Labs Sponsor Modal ──────────────────────────────── */}
      <AdaptionLabsModal
        isOpen={isAdaptionModalOpen}
        onClose={() => setIsAdaptionModalOpen(false)}
      />

      {/* ── Studio Keyboard Shortcuts Modal ───────────────────────────── */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </header>
  );
}
