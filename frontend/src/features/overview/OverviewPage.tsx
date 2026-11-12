import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitBranch,
  ShieldAlert,
  Layers,
  ArrowRight,
  AlertTriangle,
  Play,
  FileText,
  Music,
  CheckCircle2,
  FolderGit2,
  Volume2,
  Sparkles,
  Check,
  Terminal,
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
import { JudgeTourModal } from '../../components/JudgeTourModal';
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
  const [isJudgeTourOpen, setIsJudgeTourOpen] = useState(false);
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
    // P-001 (Lobby tone 440Hz) -> P-003 (Air Vent 493.88Hz) -> BT-001 dissonance tritone chord!
    playAuditionTone(440, 0.18);
    setTimeout(() => {
      playAuditionTone(493.88, 0.18);
    }, 220);
    setTimeout(() => {
      // Air Vent entry: premature cue tritone alert
      playCueTriggerSound(true);
      setIsPlayingAudition(false);
    }, 460);
  };

  const handleJumpToRoute = (routeId: string, passageId: string) => {
    setSelectedRoute(routeId);
    setSelectedPassage(passageId);
    navigate('/route-lab');
  };

  return (
    <div className={styles.overview} role="region" aria-label="Project Overview">
      <div className={styles.container}>
        {/* ── Top Bento Row: Hero Cockpit + Music Glass Widget ─────────── */}
        <div className={styles.bentoRow}>
          {/* Bento Hero Card (Span 8) */}
          <div className={[styles.header, styles.bentoCol8].join(' ')}>
            <div className={styles.terminalPrompt}>
              <Terminal size={12} aria-hidden="true" />
              <span>let session = workspace.current(); &gt; BranchTone Studio active._</span>
              <span className="terminal-cursor" aria-hidden="true" />
            </div>

            <div className={styles.headerLeft}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>
                  <FolderGit2 size={26} color="var(--bt-accent)" aria-hidden="true" />
                  {demoEnvelope.project.name}
                </h1>
                <span className={styles.versionBadge}>{storyVersion.version_label}</span>
                <span className="demo-badge">Demo Fixture</span>
                <span className="demo-badge" style={{ borderColor: 'rgba(3, 195, 123, 0.35)' }}>
                  GeNarrative Clash 2026 Showcase
                </span>
              </div>
              <p className={styles.subtitle}>
                Automated narrative-audio QA & regression-testing workbench. Audits branching interactive fiction to ensure music and cues never spoil narrative twists before key story choices.
              </p>
            </div>

            <div className={styles.headerMetaPills}>
              <span className={styles.headerMetaPill}>Source: <code>{storyVersion.source_filename}</code></span>
              <span className={styles.headerMetaPill}>Format: <code>{storyVersion.story_format}</code></span>
              <span className={styles.headerMetaPill}>Engine: <code>Deterministic Rule Suite (BT-001)</code></span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={styles.findingActionBtn}
                onClick={() => setIsJudgeTourOpen(true)}
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, rgba(3, 195, 123, 0.25) 0%, rgba(3, 195, 123, 0.08) 100%)',
                  borderColor: 'var(--bt-accent)',
                  color: 'var(--bt-text)',
                  boxShadow: '0 0 16px rgba(3, 195, 123, 0.25)',
                }}
              >
                <Sparkles size={14} color="var(--bt-accent)" aria-hidden="true" />
                <span>Start 60s Judge Walkthrough</span>
              </button>
              <button
                type="button"
                className={styles.findingActionBtn}
                onClick={handleInspectFinding}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                <span>Explore Story Graph</span>
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Bento Music Glass Audition Widget (Span 4) */}
          <div className={[styles.musicGlassCard, styles.bentoCol4].join(' ')}>
            <div className={styles.musicGlassHeader}>
              <span className={styles.musicGlassTag}>[ AUDIO AUDITION ]</span>
              <div
                className={[styles.musicGlassEqualizer, isPlayingAudition ? 'equalizer-playing' : ''].join(' ')}
                aria-hidden="true"
              >
                <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '6px' }} />
                <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '12px' }} />
                <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '8px' }} />
                <span className="equalizer-bar" style={{ height: isPlayingAudition ? undefined : '14px' }} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--bt-text)', marginBottom: '4px' }}>
                Route B Dissonance Synthesizer
              </div>
              <p className={styles.musicGlassNote}>
                Live browser Web Audio engine auditions the path traversal and fires the tritone dissonance alert chord at Air Vent.
              </p>
            </div>

            <button
              type="button"
              className={styles.auditionActionBtn}
              onClick={handleAuditionRouteB}
              disabled={isPlayingAudition}
              title="Audition Route B traversal and defect alert via browser Web Audio synth"
            >
              <Volume2 size={16} aria-hidden="true" />
              <span>{isPlayingAudition ? 'Auditioning Traversal...' : 'Audition Route B Defect Tone 🔊'}</span>
            </button>
          </div>
        </div>

        {/* ── Key Metrics Bento Row (Span 12) ─────────────────────────── */}
        <div className={styles.metricGrid}>
          <button
            type="button"
            className={styles.metricCard}
            onClick={() => navigate('/story-graph')}
            title="Open Story Graph workspace"
          >
            <div className={styles.metricHeader}>
              <span>Passages</span>
              <div className={styles.metricIconWrap}>
                <Layers size={14} aria-hidden="true" />
              </div>
            </div>
            <div className={styles.metricValue}>{passages.length}</div>
            <div className={styles.metricSubtext}>5 nodes mapped across 2 routes</div>
          </button>

          <button
            type="button"
            className={styles.metricCard}
            onClick={() => navigate('/route-lab')}
            title="Open Route Lab workspace"
          >
            <div className={styles.metricHeader}>
              <span>Story Transitions</span>
              <div className={styles.metricIconWrap}>
                <GitBranch size={14} aria-hidden="true" />
              </div>
            </div>
            <div className={styles.metricValue}>{edges.length}</div>
            <div className={styles.metricSubtext}>All structural edges valid</div>
          </button>

          <button
            type="button"
            className={styles.metricCard}
            onClick={() => navigate('/validation-centre')}
            title="Open Validation Centre workspace"
          >
            <div className={styles.metricHeader}>
              <span>Active Issues</span>
              <div className={styles.metricIconWrap} style={{ background: 'rgba(240, 79, 117, 0.12)', borderColor: 'rgba(240, 79, 117, 0.35)' }}>
                <ShieldAlert size={14} color="var(--bt-error)" aria-hidden="true" />
              </div>
            </div>
            <div className={styles.metricValue} style={{ color: 'var(--bt-error)' }}>
              {findings.length}
            </div>
            <div className={styles.metricSubtext}>BT-001 Reveal Protection (High)</div>
          </button>

          <button
            type="button"
            className={styles.metricCard}
            onClick={() => navigate('/reports')}
            title="Open Reports & Export workspace"
          >
            <div className={styles.metricHeader}>
              <span>Validation Coverage</span>
              <div className={styles.metricIconWrap}>
                <CheckCircle2 size={14} aria-hidden="true" />
              </div>
            </div>
            <div className={styles.metricValueNotEvaluated}>Not evaluated</div>
            <div className={styles.metricSubtext}>Requires route exploration engine</div>
          </button>
        </div>

        {/* ── Traversal Comparison & Telemetry Bento Row ──────────────── */}
        <div className={styles.bentoRow}>
          {/* Side-by-Side Traversal Comparison Matrix (Span 7) */}
          <div className={[styles.conceptCard, styles.bentoCol7].join(' ')}>
            <div className={styles.conceptTitle}>
              <Sparkles size={16} color="var(--bt-accent)" aria-hidden="true" />
              <span>Side-by-Side Traversal Comparison Matrix</span>
            </div>
            <p className={styles.conceptExplanation}>
              In branching narratives, players reach scenes through different decision paths. If an ominous “Traitor Revealed” theme plays before the player discovers the conspiracy, the dramatic twist is ruined.
            </p>

            <div className={styles.routeComparisonGrid}>
              <div className={[styles.routeComparisonCard, styles.routeClean].join(' ')}>
                <div className={styles.routeCardHeader}>
                  <span className={styles.routeName}>
                    <Check size={14} color="var(--bt-accent)" aria-hidden="true" />
                    Route A: Archives Investigation
                  </span>
                  <span className={styles.routeStatusBadgeClean}>✓ Verified Clean</span>
                </div>
                <div className={styles.routePathSteps}>
                  Lobby (P-001) → Archives (P-002) → Server Vault (P-004) → Safe House (P-005)
                </div>
                <div className={styles.routeSummaryText}>
                  Detective Sen investigates archives, reads the conspirator dossier, and learns the traitor identity before Server Vault. Traitor theme fires legitimately.
                </div>
                <button
                  type="button"
                  className={styles.findingActionBtn}
                  style={{ marginTop: 'auto', padding: '6px 12px', fontSize: '11px' }}
                  onClick={() => handleJumpToRoute('route_a', 'P-002')}
                >
                  <span>Simulate Route A in Route Lab</span>
                  <ArrowRight size={12} aria-hidden="true" />
                </button>
              </div>

              <div className={[styles.routeComparisonCard, styles.routeDefect].join(' ')}>
                <div className={styles.routeCardHeader}>
                  <span className={styles.routeName}>
                    <AlertTriangle size={14} color="var(--bt-error)" aria-hidden="true" />
                    Route B: Stealth Ductwork
                  </span>
                  <span className={styles.routeStatusBadgeDefect}>⚠ BT-001 Premature Cue</span>
                </div>
                <div className={styles.routePathSteps}>
                  Lobby (P-001) → Air Vent (P-003) → Server Vault (P-004) → Safe House (P-005)
                </div>
                <div className={styles.routeSummaryText}>
                  Sen crawls through the metal air duct to bypass guards, unaware of the traitor. But <code>traitor_theme.wav</code> triggers at Air Vent, spoiling the reveal 1 scene early!
                </div>
                <button
                  type="button"
                  className={styles.findingActionBtn}
                  style={{ marginTop: 'auto', padding: '6px 12px', fontSize: '11px', background: 'rgba(240, 79, 117, 0.15)', borderColor: 'var(--bt-error)', color: 'var(--bt-error)' }}
                  onClick={handleInspectFinding}
                >
                  <span>Inspect BT-001 in Story Graph</span>
                  <ArrowRight size={12} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Telemetry Coordinates & Fixture Details Bento (Span 5) */}
          <div className={[styles.bentoCard, styles.bentoCol5].join(' ')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--bt-font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--bt-accent)', letterSpacing: '0.1em' }}>
                [ SCENE TELEMETRY &amp; INTENSITY ]
              </span>
              <span className="demo-badge">P-003 Telemetry</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--bt-text)' }}>
                Passage: Air Vent (P-003)
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="liquid-pill">Intensity: 4/5 (Suspense)</span>
                <span className="liquid-pill">Identity Revealed: No</span>
                <span className="liquid-pill">Required Cue: traitor_theme.wav</span>
              </div>
              <blockquote style={{
                margin: '8px 0 0 0',
                padding: '10px 14px',
                borderLeft: '3px solid var(--bt-error)',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.5,
              }}>
                “The air here smells of copper and burnt insulation. Through the slatted grille, the server vault hums below. One false move and the entire garrison will hear.”
              </blockquote>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'var(--bt-font-mono)' }}>
                Rule: BT-001 Reveal Protection
              </span>
              <button
                type="button"
                className={styles.findingActionBtn}
                onClick={() => navigate('/narrative-map')}
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                <span>View Map</span>
                <ArrowRight size={11} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid: Findings + Audio Inventory ──────────── */}
        <div className={styles.contentGrid}>
          {/* Left Column: Latest Validation Findings */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <ShieldAlert size={16} color="var(--bt-error)" aria-hidden="true" />
                <span>Demonstration Validation Run</span>
              </div>
              <span className="demo-badge">Expected Findings Fixture</span>
            </div>

            <p className={styles.panelDesc}>
              Run ID: <code>run_the_last_signal_demo_v1</code>. Demonstrates deterministic detection of premature traitor theme playback on Route B.
            </p>

            {findings.map((f) => (
              <div key={f.finding_id} className={styles.findingCard}>
                <div className={styles.findingTop}>
                  <div className={styles.findingIdGroup}>
                    <ShieldAlert size={14} color="var(--bt-error)" aria-hidden="true" />
                    <span className={styles.findingCode}>{f.finding_code}</span>
                    <span className={styles.findingBadge}>High Severity</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--bt-text-muted)', fontFamily: 'var(--bt-font-mono)' }}>Status: Open</span>
                </div>

                <div className={styles.findingDesc}>
                  {f.explanation}
                </div>

                <div className={styles.findingMeta}>
                  <span>Rule: <strong>Reveal Protection</strong></span>
                  <span>Passage: <strong>P-003 (Air Vent)</strong></span>
                  <span>Route: <strong>Route B</strong></span>
                </div>

                <button
                  type="button"
                  className={styles.findingActionBtn}
                  onClick={handleInspectFinding}
                >
                  <span>Inspect in Story Graph</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>
            ))}

            {/* Compilation warning box */}
            <div className={styles.warningBox}>
              <AlertTriangle size={16} color="var(--bt-error)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <div>
                <strong>Fixture Notice:</strong> Original narrative text is missing for P-001, P-002, P-004, and P-005. P-003 contains exact user-provided text. Structural placeholders are not production story content.
              </div>
            </div>
          </div>

          {/* Right Column: Audio Assets & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Audio Health Panel */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>
                  <Music size={16} color="var(--bt-accent)" aria-hidden="true" />
                  <span>Audio Asset Inventory</span>
                </div>
                <span className="demo-badge">Demo Data</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className={styles.inventoryRow}>
                  <span style={{ color: 'var(--bt-text-secondary)' }}>Configured Cues:</span>
                  <span style={{ fontWeight: 600, color: 'var(--bt-text)', fontFamily: 'var(--bt-font-mono)' }}>1 (traitor_theme.wav)</span>
                </div>
                <div className={styles.inventoryRow}>
                  <span style={{ color: 'var(--bt-text-secondary)' }}>Missing Media File:</span>
                  <span style={{ color: 'var(--bt-error)', fontWeight: 600, fontFamily: 'var(--bt-font-mono)' }}>
                    {missingAssetsCount} file unuploaded
                  </span>
                </div>
                <div className={styles.inventoryRow}>
                  <span style={{ color: 'var(--bt-text-secondary)' }}>Decoded Audio Duration:</span>
                  <span style={{ color: 'var(--bt-text-muted)', fontStyle: 'italic' }}>Unavailable (no audio bytes)</span>
                </div>

                <button
                  type="button"
                  className={styles.findingActionBtn}
                  style={{ marginTop: '6px' }}
                  onClick={() => navigate('/cue-library')}
                >
                  <span>Inspect in Cue Library</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>
                  <Play size={15} color="var(--bt-accent)" aria-hidden="true" />
                  <span>Workbench Workspaces</span>
                </div>
              </div>

              <div className={styles.actionList}>
                <button
                  type="button"
                  className={styles.actionItem}
                  onClick={() => navigate('/story-graph')}
                >
                  <div className={styles.actionLeft}>
                    <GitBranch size={15} color="var(--bt-accent)" aria-hidden="true" />
                    <span>Story Graph Workspace</span>
                  </div>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={styles.actionItem}
                  onClick={() => navigate('/narrative-map')}
                >
                  <div className={styles.actionLeft}>
                    <Layers size={15} color="var(--bt-accent)" aria-hidden="true" />
                    <span>Narrative Map &amp; Mood Plot</span>
                  </div>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={styles.actionItem}
                  onClick={() => navigate('/cue-library')}
                >
                  <div className={styles.actionLeft}>
                    <Music size={15} color="var(--bt-accent)" aria-hidden="true" />
                    <span>Cue Library &amp; Asset Inventory</span>
                  </div>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={styles.actionItem}
                  onClick={() => navigate('/route-lab')}
                >
                  <div className={styles.actionLeft}>
                    <Play size={15} color="var(--bt-accent)" aria-hidden="true" />
                    <span>Route Lab &amp; Simulation Trace</span>
                  </div>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={styles.actionItem}
                  onClick={() => navigate('/validation-centre')}
                >
                  <div className={styles.actionLeft}>
                    <ShieldAlert size={15} color="var(--bt-error)" aria-hidden="true" />
                    <span>Validation Centre</span>
                  </div>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className={styles.actionItem}
                  onClick={() => navigate('/reports')}
                >
                  <div className={styles.actionLeft}>
                    <FileText size={15} color="var(--bt-text-secondary)" aria-hidden="true" />
                    <span>Reports &amp; Export</span>
                  </div>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Judge 60s Walkthrough Modal ────────────────────────────────── */}
      <JudgeTourModal
        isOpen={isJudgeTourOpen}
        onClose={() => setIsJudgeTourOpen(false)}
      />
    </div>
  );
}
