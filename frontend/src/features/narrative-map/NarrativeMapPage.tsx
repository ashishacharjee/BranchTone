import { useState } from 'react';
import {
  Heart,
  Activity,
  Layers,
  HelpCircle,
  FileCheck,
  Sparkles,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  getRoutes,
  getRoute,
  getPassage,
} from '../../services/fixtures';
import { useWorkspaceStore } from '../../stores/workspace';
import styles from './NarrativeMapPage.module.css';

export function NarrativeMapPage() {
  const routes = getRoutes();
  const selectedRouteId = useWorkspaceStore((s) => s.selectedRouteId) ?? 'route_b';
  const selectedPassageId = useWorkspaceStore((s) => s.selectedPassageId);
  const setSelectedRoute = useWorkspaceStore((s) => s.setSelectedRoute);
  const setSelectedPassage = useWorkspaceStore((s) => s.setSelectedPassage);

  const [pendingStatus, setPendingStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const activeRoute = getRoute(selectedRouteId);
  const passageIds = activeRoute ? activeRoute.passage_path : ['P-001', 'P-003', 'P-004', 'P-005'];

  return (
    <div className={styles.narrativeMap} role="region" aria-label="Narrative Map Workspace">
      <div className={styles.container}>
        {/* ── Top Bar: Route Selector ─────────────────────────────────── */}
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
            Path: {passageIds.join(' → ')}
          </span>
          <span className="demo-badge">Demo Data</span>
        </div>
      </div>

      {/* ── Chronological Fact & Intensity Plot ────────────────────── */}
      <div className={styles.plotPanel}>
        <div className={styles.plotHeader}>
          <div className={styles.plotTitle}>
            <Activity size={15} color="var(--bt-accent)" aria-hidden="true" />
            <span>Chronological Narrative Progression & Emotional Intensity</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--bt-text-muted)' }}>
            Scale: 1 (Calm) — 5 (Climax)
          </span>
        </div>

        <div className={styles.plotContainer}>
          {passageIds.map((pId, idx) => {
            const p = getPassage(pId);
            const isSelected = pId === selectedPassageId;
            const isAirVent = pId === 'P-003';
            const intensity = p?.intensity ?? (pId === 'P-001' ? 3 : 4);
            const intensityPercent = (intensity / 5) * 100;
            // Reveal occurs at Archives (P-002) on Route A, and Server Vault (P-004) on Route B
            const isIdentityRevealed = selectedRouteId === 'route_a'
              ? (pId === 'P-002' || pId === 'P-004' || pId === 'P-005')
              : (pId === 'P-004' || pId === 'P-005');

            return (
              <div
                key={pId}
                className={[
                  styles.passageStepCard,
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
                <div className={styles.stepTop}>
                  <span className={styles.stepIndex}>Step 0{(idx + 1).toString()}</span>
                  <span style={{ fontFamily: 'var(--bt-font-mono)', fontSize: '11px', color: 'var(--bt-text-muted)' }}>
                    {pId}
                  </span>
                </div>

                <div className={styles.stepTitle}>{p ? p.title : pId}</div>

                <div className={styles.stepMood}>
                  <Heart size={12} aria-hidden="true" />
                  <span>{p?.mood ?? 'Neutral'}</span>
                </div>

                <div className={styles.intensityRow}>
                  <div className={styles.intensityLabel}>
                    <span>Emotional Intensity</span>
                    <span className={styles.intensityValue}>{(intensity).toString()}/5</span>
                  </div>
                  <div className={styles.intensityBarBg}>
                    <div
                      className={styles.intensityBarFill}
                      style={{
                        width: `${intensityPercent.toString()}%`,
                        background: isAirVent && selectedRouteId === 'route_b' ? 'var(--bt-error)' : 'var(--bt-accent)',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <span
                    className={[
                      styles.stepFactBadge,
                      isIdentityRevealed ? styles.factReveal : styles.factNoReveal,
                    ].join(' ')}
                  >
                    <HelpCircle size={11} aria-hidden="true" />
                    <span>Identity Revealed: {isIdentityRevealed ? 'Yes' : 'No'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Annotation Review: Approved vs Candidate ───────────────── */}
      <div className={styles.annotationSection}>
        <div className={styles.plotHeader}>
          <div className={styles.plotTitle}>
            <FileCheck size={15} color="var(--bt-accent)" aria-hidden="true" />
            <span>Narrative Annotation Review (Creator Approval Model)</span>
          </div>
          <span className="demo-badge">Fixture Registry</span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--bt-text-secondary)', margin: 0 }}>
          Per PRD FR-013: AI-proposed annotations remain <code>pending</code>. Only creator-approved annotations update the authoritative narrative fact state for deterministic audio cue validation.
        </p>

        <div className={styles.annotationGrid}>
          {/* Card 1: Approved Annotation */}
          <div
            className={[styles.annotationCard, styles.annotationApproved].join(' ')}
            onClick={() => setSelectedPassage('P-003')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedPassage('P-003');
              }
            }}
            aria-label="Inspect authoritative annotation for Air Vent"
          >
            <div className={styles.annotationTop}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={14} color="var(--bt-accent)" aria-hidden="true" />
                <span style={{ fontWeight: 600, fontSize: '13px' }}>P-003 · Air Vent</span>
              </div>
              <span className={styles.badgeApproved}>Approved</span>
            </div>

            <div className={styles.annotationText}>
              <strong>Authoritative State:</strong> Mood <code>Suspense</code>, Emotional Intensity <code>4/5</code>, Identity Revealed <code>false</code>. Verified against original source text. Click to select in graph.
            </div>

            <div style={{ fontSize: '11px', color: 'var(--bt-text-muted)', display: 'flex', gap: '12px' }}>
              <span>ID: <code>ann_p003_demo</code></span>
              <span>Scope: Authoritative Demo</span>
            </div>
          </div>

          {/* Card 2: Candidate / Pending Annotation */}
          <div className={[styles.annotationCard, styles.annotationPending].join(' ')}>
            <div className={styles.annotationTop}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color="#EAB308" aria-hidden="true" />
                <span style={{ fontWeight: 600, fontSize: '13px' }}>P-004 · Server Vault (Identity Reveal Event)</span>
              </div>
              <span className={
                pendingStatus === 'approved'
                  ? styles.badgeApproved
                  : pendingStatus === 'rejected'
                    ? styles.stepIssue
                    : styles.badgePending
              }>
                {pendingStatus === 'approved' ? 'Approved (Demo)' : pendingStatus === 'rejected' ? 'Rejected (Demo)' : 'Pending Candidate'}
              </span>
            </div>

            <div className={styles.annotationText}>
              <strong>Candidate Mutation:</strong> <code>traitor_identity_revealed = true</code>. Unverified demonstration event; awaiting source evidence verification before promotion.
            </div>

            {/* Interactive Demo Review Action Buttons */}
            <div className={styles.actionRow}>
              {pendingStatus === 'pending' ? (
                <>
                  <button
                    type="button"
                    className={styles.approveBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingStatus('approved');
                    }}
                    aria-label="Approve candidate annotation"
                  >
                    <Check size={12} aria-hidden="true" />
                    <span>Approve (Demo)</span>
                  </button>
                  <button
                    type="button"
                    className={styles.rejectBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingStatus('rejected');
                    }}
                    aria-label="Reject candidate annotation"
                  >
                    <X size={12} aria-hidden="true" />
                    <span>Reject</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={styles.rejectBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingStatus('pending');
                  }}
                  aria-label="Reset candidate annotation to pending"
                >
                  <RotateCcw size={12} aria-hidden="true" />
                  <span>Reset Review State</span>
                </button>
              )}
            </div>

            {pendingStatus !== 'pending' && (
              <div className={styles.demoActionNotice}>
                Notice: Candidate status updated in local UI state. Live-sprint database persistence is gated per compliance rules.
              </div>
            )}

            <div style={{ fontSize: '11px', color: 'var(--bt-text-muted)', display: 'flex', gap: '12px' }}>
              <span>ID: <code>ann_p004_reveal_demo</code></span>
              <span>Status: <code>{pendingStatus}</code></span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
