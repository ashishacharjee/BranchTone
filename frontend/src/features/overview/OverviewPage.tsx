import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Check,
  RotateCcw,
  Volume2,
  Clock,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import {
  getDemoProject,
  getStoryVersion,
  getPassages,
  getStoryEdges,
  getAllFindings,
  getAudioAssets,
} from '../../services/fixtures';
import { playAuditionTone, playCueTriggerSound } from '../../services/synth';
import { useWorkspaceStore } from '../../stores/workspace';
import { PixelMatrixNumber } from '../../components/PixelMatrixNumber';
import { AdaptionLabsModal } from '../../components/AdaptionLabsModal';
import styles from './OverviewPage.module.css';

export function OverviewPage() {
  const navigate = useNavigate();
  const demoEnvelope = getDemoProject();
  const storyVersion = getStoryVersion();
  const passages = getPassages();
  const edges = getStoryEdges();
  const findings = getAllFindings();
  const audioAssets = getAudioAssets();

  const [isPlayingAudition, setIsPlayingAudition] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isHoveringAirVent, setIsHoveringAirVent] = useState(false);
  const [isAdaptionModalOpen, setIsAdaptionModalOpen] = useState(false);

  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);
  const setSelectedRoute = useWorkspaceStore((s) => s.setSelectedRoute);
  const setSelectedPassage = useWorkspaceStore((s) => s.setSelectedPassage);

  const missingAssetsCount = audioAssets.filter((a) => a.status === 'missing').length;

  const handleInspectFinding = () => {
    navigateToFinding({
      findingId: 'fnd_bt001_route_b_p003_demo',
      routeId: 'route_b',
      passageId: 'P-003',
    });
    navigate('/story-graph');
  };

  const handleAuditionRouteB = () => {
    setIsPlayingAudition(true);
    // Play sequential route traversal simulation:
    // P-001 (Lobby tone 440Hz) -> P-003 (Air Vent 493.88Hz) -> BT-001 tritone defect chord!
    playAuditionTone(440, 0.18);
    setTimeout(() => {
      playAuditionTone(493.88, 0.18);
    }, 220);
    setTimeout(() => {
      playCueTriggerSound(true);
      setIsPlayingAudition(false);
    }, 460);
  };

  const handleApprove = () => {
    setIsApproved(true);
    setToastMessage('✓ Defect BT-001 acknowledged for live sprint verification');
    setShowToast(true);
  };

  const handleUndo = () => {
    setIsApproved(false);
    setShowToast(false);
  };

  const handleJumpToRoute = (routeId: string, passageId: string) => {
    setSelectedRoute(routeId);
    setSelectedPassage(passageId);
    navigate('/route-lab');
  };

  return (
    <div className={styles.overview} role="region" aria-label="Project Overview">
      <div className={styles.container}>
        {/* ── Row 1: Studio Brief Hero (Span 8) + Approval Card (Span 4) ─── */}
        <div className={styles.bentoRow}>
          {/* Card 1: Studio Brief / Morning Brief Bento */}
          <div className={[styles.briefCard, styles.col8].join(' ')}>
            <div className={styles.briefHeader}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className={styles.briefTitleRow}>
                  <h1 className={styles.briefTitle}>
                    {demoEnvelope.project.name}
                  </h1>
                  <span className={styles.versionBadge}>{storyVersion.version_label}</span>
                  <span className="demo-badge">Demo Fixture</span>
                </div>
                <p className={styles.briefDesc}>
                  Automated narrative-audio QA &amp; regression-testing workbench. Audits branching interactive fiction to ensure music and cues never spoil narrative twists before key story choices.
                </p>
              </div>

              <div className={styles.sparkleIconWrap} aria-hidden="true">
                <Sparkles size={22} />
              </div>
            </div>

            <div className={styles.briefFooter}>
              <div className={styles.briefChips}>
                <span className={styles.chip}>Source: <code>{storyVersion.source_filename}</code></span>
                <span className={styles.chip}>Format: <code>{storyVersion.story_format}</code></span>
                <span className={styles.chip}>Engine: <code>Deterministic Rule Suite (BT-001)</code></span>
              </div>

              <button
                type="button"
                className={styles.talkBtn}
                onClick={handleAuditionRouteB}
                disabled={isPlayingAudition}
                title="Audition Route B traversal and defect alert via browser Web Audio synth"
              >
                <Volume2 size={15} aria-hidden="true" />
                <span>{isPlayingAudition ? 'Auditioning Traversal...' : 'Talk to BranchTone'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Needs your approval finding card */}
          <div className={[styles.approvalCard, styles.col4].join(' ')}>
            <div className={styles.approvalHeader}>
              <div className={styles.approvalTagGroup}>
                <div className={styles.purpleIconWrap} aria-hidden="true">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className={styles.approvalTitle}>Needs your approval</h3>
                  <span className={styles.findingBadgeRed}>BT-001 Reveal Protection (High)</span>
                </div>
              </div>
              <span className="demo-badge">{findings.length} Open Issue</span>
            </div>

            <div className={styles.findingText}>
              <strong>BT-001</strong>: The traitor theme starts when entering Air Vent (P-003) on Route B before the conspirator dossier is read in Server Vault.
            </div>

            <div className={styles.approvalActions}>
              <button
                type="button"
                className={styles.approvePillBtn}
                onClick={handleApprove}
                disabled={isApproved}
              >
                <Check size={14} aria-hidden="true" />
                <span>{isApproved ? 'Approved' : 'Approve Suppression'}</span>
              </button>

              <button
                type="button"
                className={styles.inspectPillBtn}
                onClick={handleInspectFinding}
              >
                <span>Inspect in Graph</span>
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Row 2: Video Signature Gradient Cards (Green & Orange) ─────── */}
        <div className={styles.bentoRow}>
          {/* Card 3: Green Gradient Bento Card (Pixel Matrix Number) */}
          <div
            className={[styles.greenCard, styles.col6].join(' ')}
            onClick={() => navigate('/route-lab')}
            title="Open Route Lab to inspect structural story transitions"
          >
            <div className={styles.cardTopBadgeRow}>
              <span className={styles.cardTitleLight}>Story Transitions</span>
              <span className={styles.whiteTranslucentBadge}>
                Graph integrity ↗
              </span>
            </div>

            <div className={styles.numberArea}>
              <PixelMatrixNumber value="82" label="Integrity Score" color="#FFFFFF" />
              <div className={styles.numberSubtext}>
                <strong>All structural edges valid</strong>
                <br />
                <span>{passages.length} nodes mapped across {edges.length > 0 ? 2 : 0} routes</span>
              </div>
            </div>

            <div className={styles.equalizerWave} aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className={styles.eqBar}
                  style={{
                    height: `${10 + ((i * 7) % 18)}px`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 4: Peach / Orange Gradient Bento Card (Pixel Matrix Number) */}
          <div
            className={[styles.orangeCard, styles.col6].join(' ')}
            onClick={() => navigate('/story-graph')}
            title="Inspect Air Vent (P-003) in Story Graph"
          >
            <div className={styles.cardTopBadgeRow}>
              <span className={styles.cardTitleLight}>Air Vent (P-003)</span>
              <span className={styles.whiteTranslucentBadge}>
                Air Vent intensity ↗
              </span>
            </div>

            <div className={styles.numberArea}>
              <PixelMatrixNumber value="14" label="Intensity Level" color="#FFFFFF" />
              <div className={styles.numberSubtext}>
                <strong>Intensity: 4/5 (Suspense)</strong>
                <br />
                <span>Required Cue: traitor_theme.wav</span>
              </div>
            </div>

            <div className={styles.equalizerWave} aria-hidden="true">
              {Array.from({ length: 16 }).map((_, i) => (
                <span
                  key={i}
                  className={styles.eqBar}
                  style={{
                    height: `${12 + ((i * 9) % 16)}px`,
                    animationDelay: `${i * 0.06}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 3: Schedule / Route Traversal Card (Frame 06 Match) ─────── */}
        <div className={styles.bentoRow}>
          <div className={[styles.scheduleCard, styles.col12].join(' ')}>
            <div className={styles.scheduleHeader}>
              <div className={styles.scheduleTitle}>
                <Clock size={16} color="var(--bt-ink)" aria-hidden="true" />
                <span>Route Traversal Timeline &amp; Scrubber</span>
              </div>
              <span className={styles.scheduleSubtitle}>Interactive traversal analysis along story depth</span>
            </div>

            <div className={styles.timelineTrack}>
              {/* Interactive Tooltip matching Frame 06 */}
              {isHoveringAirVent && (
                <div className={styles.scheduleTooltip} role="tooltip">
                  <div className={styles.tooltipTitle}>Passage: Air Vent (P-003)</div>
                  <div className={styles.tooltipMeta}>
                    • Scene Intensity: <strong>4/5 (Suspense)</strong><br />
                    • Defect: <code>traitor_theme.wav</code> fires prematurely!<br />
                    • Conspirator reveal spoiled 1 step before Server Vault
                  </div>
                </div>
              )}

              {/* Scrubber vertical line */}
              <div className={styles.scrubberLine} aria-hidden="true">
                <span className={styles.scrubberThumb} />
              </div>

              {/* Top Ruler Markers */}
              <div className={styles.timelineRuler}>
                <span className={styles.timeMarker}>09:00 (Scene 1)</span>
                <span className={styles.timeMarker}>11:00 (Choice 1)</span>
                <span className={styles.timeMarker}>13:00 (Vent Entry)</span>
                <span className={styles.timeMarker}>15:00 (Vault Confrontation)</span>
                <span className={styles.timeMarker}>17:00 (Finale)</span>
              </div>

              {/* Route Tracks */}
              <div className={styles.routeTracksContainer}>
                {/* Route A Track */}
                <div className={styles.routeTrackRow}>
                  <span className={styles.routeTrackLabel}>Route A</span>
                  <div className={styles.routeSegments}>
                    <button
                      type="button"
                      className={styles.sceneBlockClean}
                      onClick={() => handleJumpToRoute('route_a', 'P-001')}
                    >
                      P-001 Lobby
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={styles.sceneBlockClean}
                      onClick={() => handleJumpToRoute('route_a', 'P-002')}
                    >
                      P-002 Archives (Dossier Read)
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={styles.sceneBlockClean}
                      onClick={() => handleJumpToRoute('route_a', 'P-004')}
                    >
                      P-004 Server Vault (Valid Theme)
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={styles.sceneBlockClean}
                      onClick={() => handleJumpToRoute('route_a', 'P-005')}
                    >
                      P-005 Safe House
                    </button>
                  </div>
                </div>

                {/* Route B Track */}
                <div className={styles.routeTrackRow}>
                  <span className={styles.routeTrackLabel}>Route B</span>
                  <div className={styles.routeSegments}>
                    <button
                      type="button"
                      className={styles.sceneBlockClean}
                      onClick={() => handleJumpToRoute('route_b', 'P-001')}
                    >
                      P-001 Lobby
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={styles.sceneBlockAlert}
                      onMouseEnter={() => setIsHoveringAirVent(true)}
                      onMouseLeave={() => setIsHoveringAirVent(false)}
                      onClick={handleInspectFinding}
                      title="Hover to inspect defect tooltip, click to open Story Graph"
                    >
                      ⚠ P-003 Air Vent [BT-001 Premature Cue]
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={styles.sceneBlockClean}
                      onClick={() => handleJumpToRoute('route_b', 'P-004')}
                    >
                      P-004 Server Vault
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={styles.sceneBlockClean}
                      onClick={() => handleJumpToRoute('route_b', 'P-005')}
                    >
                      P-005 Safe House
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 4: Priorities Checklist (Span 6) + AI Team (Span 6) ─────── */}
        <div className={styles.bentoRow}>
          {/* Card 6: Priorities Checklist */}
          <div className={[styles.prioritiesCard, styles.col6].join(' ')}>
            <div className={styles.scheduleHeader}>
              <div className={styles.scheduleTitle}>
                <CheckCircle2 size={16} color="var(--bt-ink)" aria-hidden="true" />
                <span>Today's QA Priorities</span>
              </div>
              <span className={styles.versionBadge}>Sprint Checkpoint</span>
            </div>

            <div className={styles.priorityList}>
              <div className={styles.priorityItem}>
                <span>Validate Route B traversal against BT-001</span>
                <span className={styles.statusPillReview}>• Review</span>
              </div>
              <div className={styles.priorityItem}>
                <span>Confirm 4/5 intensity on Air Vent (P-003)</span>
                <span className={styles.statusPillDone}>• Done</span>
              </div>
              <div className={styles.priorityItem}>
                <span>Audit traitor_theme.wav missing media asset ({missingAssetsCount} unuploaded)</span>
                <span className={styles.statusPillWorking}>• Working</span>
              </div>
              <div className={styles.priorityItem}>
                <span>Benchmark Adaption Labs fine-tuned emotion classifier</span>
                <span className={styles.statusPillDecision}>• Decision</span>
              </div>
            </div>
          </div>

          {/* Card 7: AI Team & Adaption Labs Sponsor Agent */}
          <div className={[styles.aiTeamCard, styles.col6].join(' ')}>
            <div className={styles.scheduleHeader}>
              <div className={styles.scheduleTitle}>
                <Cpu size={16} color="var(--bt-ink)" aria-hidden="true" />
                <span>AI Team &amp; Fine-Tuned Models</span>
              </div>
              <button
                type="button"
                className="sponsor-pill"
                onClick={() => setIsAdaptionModalOpen(true)}
                title="Open Adaption Labs Model Benchmark"
              >
                <Sparkles size={11} aria-hidden="true" />
                <span>Adaption Labs Tuner</span>
              </button>
            </div>

            <div className={styles.teamGrid}>
              <div className={styles.teamMiniCard}>
                <span className={styles.teamMiniRole}>Parser AST</span>
                <span className={styles.teamMiniName}>Twee / SugarCube</span>
                <span className={styles.teamMiniStatus}>Passage extractor active</span>
              </div>

              <div className={styles.teamMiniCard}>
                <span className={styles.teamMiniRole}>Rule Engine</span>
                <span className={styles.teamMiniName}>BT-001 Reveal</span>
                <span className={styles.teamMiniStatus}>Deterministic validator</span>
              </div>

              <div
                className={styles.teamMiniCard}
                style={{ cursor: 'pointer', borderColor: '#C084FC', background: '#FAF5FF' }}
                onClick={() => setIsAdaptionModalOpen(true)}
              >
                <span className={styles.teamMiniRole} style={{ color: '#9333EA' }}>Fine-Tuned Model</span>
                <span className={styles.teamMiniName}>Adaption 7B LoRA</span>
                <span className={styles.teamMiniStatus}>94.2% tone accuracy ↗</span>
              </div>
            </div>

            {/* Validation Coverage indicator required by domain rules and tests */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--bt-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--bt-text-muted)' }}>Validation Coverage:</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: 'var(--bt-font-mono)', fontSize: '12px', fontWeight: 700, color: '#DC2626' }}>
                  Not evaluated
                </span>
                <div style={{ fontSize: '11px', color: 'var(--bt-text-muted)' }}>
                  Requires route exploration engine
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Floating Toast Notification (Matching Video) ──────────────── */}
        {showToast && (
          <div className={styles.floatingToast} role="alert">
            <span>{toastMessage}</span>
            <button
              type="button"
              className={styles.undoBtn}
              onClick={handleUndo}
            >
              <RotateCcw size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
              Undo
            </button>
          </div>
        )}
      </div>

      {/* ── Adaption Labs Modal ────────────────────────────────────────── */}
      <AdaptionLabsModal
        isOpen={isAdaptionModalOpen}
        onClose={() => setIsAdaptionModalOpen(false)}
      />
    </div>
  );
}
