import { useNavigate } from 'react-router-dom';
import {
  VolumeX,
  ShieldAlert,
  GitBranch,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import {
  getRoutes,
  getRoute,
  getPassage,
  getExpectedCueEvents,
} from '../../services/fixtures';
import { playAuditionTone, playCueTriggerSound } from '../../services/synth';
import { useWorkspaceStore } from '../../stores/workspace';
import styles from './RouteLabPage.module.css';

export function RouteLabPage() {
  const navigate = useNavigate();
  const routes = getRoutes();
  const selectedRouteId = useWorkspaceStore((s) => s.selectedRouteId) ?? 'route_b';
  const selectedPassageId = useWorkspaceStore((s) => s.selectedPassageId) ?? 'P-003';
  const setSelectedRoute = useWorkspaceStore((s) => s.setSelectedRoute);
  const setSelectedPassage = useWorkspaceStore((s) => s.setSelectedPassage);
  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);

  const activeRoute = getRoute(selectedRouteId);
  const passageIds = activeRoute ? activeRoute.passage_path : ['P-001', 'P-003', 'P-004', 'P-005'];
  const allCueEvents = getExpectedCueEvents();
  const activeRouteCueEvents = allCueEvents.filter((e) => e.route_id === selectedRouteId);

  const selectedPassage = getPassage(selectedPassageId);

  const currentIndex = passageIds.indexOf(selectedPassageId);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < passageIds.length - 1;

  const handleStepTo = (targetId: string) => {
    setSelectedPassage(targetId);
    if (targetId === 'P-003' && selectedRouteId === 'route_b') {
      playCueTriggerSound(true);
    } else {
      playAuditionTone(523.25, 0.12);
    }
  };

  const handlePrevStep = () => {
    if (canGoPrev) {
      handleStepTo(passageIds[currentIndex - 1]);
    }
  };

  const handleNextStep = () => {
    if (canGoNext) {
      handleStepTo(passageIds[currentIndex + 1]);
    }
  };

  // Identity reveal evaluation per route:
  // Route A: reveal occurs at Archives (P-002)
  // Route B: reveal occurs at Server Vault (P-004)
  const isSelectedPassageRevealed = selectedRouteId === 'route_a'
    ? (selectedPassageId === 'P-002' || selectedPassageId === 'P-004' || selectedPassageId === 'P-005')
    : (selectedPassageId === 'P-004' || selectedPassageId === 'P-005');

  const handleInspectFinding = () => {
    navigateToFinding({
      findingId: 'BT-001',
      routeId: 'route_b',
      passageId: 'P-003',
    });
    navigate('/validation-centre');
  };

  return (
    <div className={styles.routeLab} role="region" aria-label="Route Lab Workspace">
      {/* ── Topbar / Route Selector ─────────────────────────────────── */}
      <div className={styles.topbar}>
        <div className={styles.routeSelector} role="group" aria-label="Route selector">
          <span className={styles.routeLabel}>Route:</span>
          {routes.map((r) => {
            const isActive = r.route_id === selectedRouteId;
            return (
              <button
                key={r.route_id}
                type="button"
                className={[styles.routePill, isActive ? styles.routePillActive : ''].join(' ')}
                onClick={() => setSelectedRoute(r.route_id)}
                aria-pressed={isActive}
                aria-label={`Select ${r.name}`}
              >
                <span className={styles.pillBadge}>{r.route_code}</span>
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--bt-text-muted)' }}>
            Sequential Traversal: {passageIds.join(' → ')}
          </span>
          <span className="demo-badge">Verification Trace</span>
        </div>
      </div>

      {/* ── Sequence & State Stepper ────────────────────────────────── */}
      <div className={styles.stepperPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <GitBranch size={15} color="var(--bt-accent)" aria-hidden="true" />
            <span>Passage Sequence & Narrative Fact Snapshots</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className={styles.stepNavBtn}
              onClick={handlePrevStep}
              disabled={!canGoPrev}
              aria-label="Previous step"
            >
              <ArrowLeft size={12} aria-hidden="true" />
              <span>Prev Step</span>
            </button>
            <button
              type="button"
              className={styles.stepNavBtn}
              onClick={handleNextStep}
              disabled={!canGoNext}
              aria-label="Next step"
            >
              <span>Next Step</span>
              <ArrowRight size={12} aria-hidden="true" />
            </button>
            <span className="demo-badge">Demo Data</span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--bt-text-secondary)', margin: 0 }}>
          Per PRD FR-023: Simulation carries supported variables, narrative facts, active cue IDs, path and event trace. Displaying supplied verification fixtures; route simulation engine is not executed.
        </p>

        <div className={styles.stepsGrid}>
          {passageIds.map((pId, idx) => {
            const p = getPassage(pId);
            const isSelected = pId === selectedPassageId;
            const isAirVent = pId === 'P-003';
            // Reveal point per route: Route A is P-002; Route B is P-004
            const isRevealPoint = selectedRouteId === 'route_a' ? pId === 'P-002' : pId === 'P-004';
            const isIdentityRevealed = selectedRouteId === 'route_a'
              ? (pId === 'P-002' || pId === 'P-004' || pId === 'P-005')
              : (pId === 'P-004' || pId === 'P-005');

            return (
              <div
                key={pId}
                className={[
                  styles.stepCard,
                  isSelected ? styles.stepSelected : '',
                  isAirVent && selectedRouteId === 'route_b' ? styles.stepIssue : '',
                ].join(' ')}
                onClick={() => setSelectedPassage(pId)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPassage(pId);
                  }
                }}
                aria-label={`${p ? p.title : pId}, step ${(idx + 1).toString()}`}
                aria-pressed={isSelected}
              >
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>Step 0{(idx + 1).toString()}</span>
                  <span style={{ fontFamily: 'var(--bt-font-mono)', fontSize: '11px', color: 'var(--bt-text-muted)' }}>
                    {pId}
                  </span>
                </div>

                <div className={styles.stepName}>{p ? p.title : pId}</div>

                <div className={styles.factBox}>
                  <div className={styles.factRow}>
                    <span style={{ color: 'var(--bt-text-muted)' }}>identity_revealed:</span>
                    <span style={{ color: isIdentityRevealed ? 'var(--bt-accent)' : 'var(--bt-text-muted)' }}>
                      {isIdentityRevealed ? 'true' : 'false'}
                    </span>
                  </div>
                  {isRevealPoint && (
                    <div style={{ color: '#EAB308', fontSize: '10px', marginTop: '2px' }}>
                      ⚡ State Event: Identity Revealed
                    </div>
                  )}
                  {isAirVent && selectedRouteId === 'route_b' && (
                    <div style={{ color: 'var(--bt-error)', fontSize: '10px', marginTop: '2px', fontWeight: 600 }}>
                      ⚠️ Cue Defect: BT-001 Mismatch
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Snapshot Drawer */}
        <div className={styles.snapshotDrawer}>
          <div className={styles.snapshotHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={14} color="var(--bt-accent)" aria-hidden="true" />
              <span>Selected Step Snapshot: {selectedPassage?.title ?? selectedPassageId} ({selectedPassageId})</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--bt-text-muted)' }}>
              Click any step above to inspect narrative state
            </span>
          </div>

          <div className={styles.snapshotGrid}>
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Emotional Intensity</span>
              <span className={styles.snapshotVal}>
                {(selectedPassage?.intensity ?? (selectedPassageId === 'P-001' ? 3 : 4)).toString()}/5
              </span>
            </div>
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Mood Quality</span>
              <span className={styles.snapshotVal}>{selectedPassage?.mood ?? 'Neutral'}</span>
            </div>
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Identity Revealed Fact</span>
              <span className={styles.snapshotVal} style={{ color: isSelectedPassageRevealed ? 'var(--bt-accent)' : 'var(--bt-text-muted)' }}>
                {isSelectedPassageRevealed ? 'true' : 'false'}
              </span>
            </div>
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Active Audio Cues</span>
              <span className={styles.snapshotVal}>
                {selectedPassageId === 'P-003' && selectedRouteId === 'route_b' ? 'traitor_theme.wav (Violation)' : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cue Activation Trace ────────────────────────────────────── */}
      <div className={styles.tracePanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <Clock size={15} color="var(--bt-accent)" aria-hidden="true" />
            <span>Cue Activation Trace for {activeRoute?.name ?? 'Route'}</span>
          </div>
          <span className="demo-badge">Verification Trace</span>
        </div>

        {activeRouteCueEvents.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.traceTable}>
              <thead>
                <tr>
                  <th>Activation ID</th>
                  <th>Cue / Passage</th>
                  <th>Trigger Type</th>
                  <th>Required State</th>
                  <th>Actual State</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {activeRouteCueEvents.map((evt) => (
                  <tr key={evt.activation_id}>
                    <td>
                      <code style={{ fontSize: '11px' }}>{evt.activation_id}</code>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600 }}>traitor_theme.wav</span>
                        <span style={{ fontSize: '10px', color: 'var(--bt-text-muted)' }}>
                          Passage: {evt.passage_id} (Air Vent)
                        </span>
                      </div>
                    </td>
                    <td>Passage Entry</td>
                    <td>
                      <code>traitor_identity_revealed: true</code>
                    </td>
                    <td>
                      <code style={{ color: 'var(--bt-error)' }}>
                        traitor_identity_revealed: false
                      </code>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.clickableFindingBtn}
                        onClick={handleInspectFinding}
                        title="Click to deep-link to Finding BT-001 in Validation Centre"
                        aria-label="Inspect Issue BT-001 in Validation Centre"
                      >
                        <ShieldAlert size={12} aria-hidden="true" />
                        <span>Issue BT-001</span>
                        <ArrowRight size={11} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            background: 'var(--bt-surface-2)',
            padding: 'var(--bt-space-5)',
            borderRadius: 'var(--bt-radius-sm)',
            border: '1px solid var(--bt-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--bt-text-secondary)',
            fontSize: '13px',
          }}>
            <CheckCircle2 size={16} color="var(--bt-accent)" aria-hidden="true" />
            <span>No cue activation violations on {activeRoute?.name ?? 'this route'}. Expected absence satisfied.</span>
          </div>
        )}

        {/* Transport Disabled Notice */}
        <div className={styles.transportNotice}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <VolumeX size={16} aria-hidden="true" />
            <span>Multitrack route audition disabled — media assets are missing from local storage.</span>
          </div>
          <button
            type="button"
            disabled
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--bt-radius-sm)',
              background: 'var(--bt-surface-3)',
              border: '1px solid var(--bt-border)',
              color: 'var(--bt-text-muted)',
              fontSize: '11px',
              cursor: 'not-allowed',
            }}
          >
            Play Route (Disabled)
          </button>
        </div>
      </div>
    </div>
  );
}
