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
} from 'lucide-react';
import {
  getDemoProject,
  getStoryVersion,
  getPassages,
  getStoryEdges,
  getAllFindings,
  getAudioAssets,
} from '../../services/fixtures';
import { useWorkspaceStore } from '../../stores/workspace';
import styles from './OverviewPage.module.css';

export function OverviewPage() {
  const navigate = useNavigate();
  const demoEnvelope = getDemoProject();
  const storyVersion = getStoryVersion();
  const passages = getPassages();
  const edges = getStoryEdges();
  const findings = getAllFindings();
  const audioAssets = getAudioAssets();

  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);

  const missingAssetsCount = audioAssets.filter((a) => a.status === 'missing').length;

  const handleInspectFinding = () => {
    // Navigate deeply to BT-001 in Story Graph
    navigateToFinding({
      findingId: 'fnd_bt001_route_b_p003_demo',
      routeId: 'route_b',
      passageId: 'P-003',
    });
    navigate('/story-graph');
  };

  return (
    <div className={styles.overview} role="region" aria-label="Project Overview">
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{demoEnvelope.project.name}</h1>
            <span className={styles.versionBadge}>{storyVersion.version_label}</span>
            <span className="demo-badge">Demo Fixture</span>
          </div>
          <p className={styles.subtitle}>{demoEnvelope.project.description}</p>
        </div>

        <div className={styles.headerMeta}>
          <span>Source: <code>{storyVersion.source_filename}</code></span>
          <span>•</span>
          <span>Format: <code>{storyVersion.story_format}</code></span>
        </div>
      </div>

      {/* ── Metrics Row ─────────────────────────────────────────────── */}
      <div className={styles.metricGrid}>
        <button
          type="button"
          className={styles.metricCard}
          onClick={() => navigate('/story-graph')}
          title="Open Story Graph workspace"
        >
          <div className={styles.metricHeader}>
            <span>Passages</span>
            <Layers size={14} aria-hidden="true" />
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
            <GitBranch size={14} aria-hidden="true" />
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
            <ShieldAlert size={14} color="var(--bt-error)" aria-hidden="true" />
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
            <CheckCircle2 size={14} aria-hidden="true" />
          </div>
          <div className={styles.metricValueNotEvaluated}>Not evaluated</div>
          <div className={styles.metricSubtext}>Requires route exploration engine</div>
        </button>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className={styles.contentGrid}>
        {/* Left Column: Latest Validation Findings */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <ShieldAlert size={15} color="var(--bt-error)" aria-hidden="true" />
              <span>Demonstration Validation Run</span>
            </div>
            <span className="demo-badge">Expected Findings Fixture</span>
          </div>

          <p style={{ fontSize: '12px', color: 'var(--bt-text-secondary)', margin: 0 }}>
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
                <span style={{ fontSize: '11px', color: 'var(--bt-text-muted)' }}>Status: Open</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bt-space-6)' }}>
          {/* Audio Health Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <Music size={15} aria-hidden="true" />
                <span>Audio Asset Inventory</span>
              </div>
              <span className="demo-badge">Demo Data</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--bt-text-secondary)' }}>Configured Cues:</span>
                <span style={{ fontWeight: 600 }}>1 (traitor_theme.wav)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--bt-text-secondary)' }}>Missing / Unuploaded Assets:</span>
                <span style={{ color: 'var(--bt-error)', fontWeight: 600 }}>
                  {missingAssetsCount} file missing
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--bt-text-secondary)' }}>Decoded Audio Duration:</span>
                <span style={{ color: 'var(--bt-text-muted)' }}>Unavailable (no audio bytes)</span>
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
                <Play size={14} aria-hidden="true" />
                <span>Workspace Navigation</span>
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
                  <span>Narrative Map & Mood Plot</span>
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
                  <span>Cue Library & Asset Inventory</span>
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
                  <span>Route Lab & Simulation Trace</span>
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
                  <span>Reports & Export</span>
                </div>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
