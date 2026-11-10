import {
  FileText,
  Download,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  getDemoProject,
  getStoryVersion,
  getReportExportPayload,
} from '../../services/fixtures';
import styles from './ReportsPage.module.css';

export function ReportsPage() {
  const demoEnvelope = getDemoProject();
  const storyVersion = getStoryVersion();
  const reportPayload = getReportExportPayload();

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `branchtone_report_${demoEnvelope.project.project_id}_v04.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={styles.reports} role="region" aria-label="Validation Reports Workspace">
      {/* ── Topbar / Export ─────────────────────────────────────────── */}
      <div className={styles.topbar}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--bt-text)' }}>
              QA Run & Compliance Report
            </h1>
            <span className="demo-badge">Demo Fixture Preview</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--bt-text-secondary)', margin: '4px 0 0 0' }}>
            Structured verification report preview based on typed demo fixtures.
          </p>
        </div>

        <button
          type="button"
          className={styles.exportBtn}
          onClick={handleExportJson}
          aria-label="Export JSON report"
        >
          <Download size={14} aria-hidden="true" />
          <span>Export JSON Report</span>
        </button>
      </div>

      {/* ── Run Identifiers ─────────────────────────────────────────── */}
      <div className={styles.idCard}>
        <div className={styles.idItem}>
          <span className={styles.idLabel}>Project Identifier</span>
          <span className={styles.idValue}>{demoEnvelope.project.project_id}</span>
        </div>

        <div className={styles.idItem}>
          <span className={styles.idLabel}>Story Version</span>
          <span className={styles.idValue}>{storyVersion.version_label} ({storyVersion.version_id})</span>
        </div>

        <div className={styles.idItem}>
          <span className={styles.idLabel}>Fixture Run ID</span>
          <span className={styles.idValue}>run_the_last_signal_demo_v1</span>
        </div>

        <div className={styles.idItem}>
          <span className={styles.idLabel}>Source SHA-256</span>
          <span className={styles.idValue} title={storyVersion.source_sha256}>
            {storyVersion.source_sha256.substring(0, 16)}…
          </span>
        </div>
      </div>

      {/* ── Rules & Findings Summary ────────────────────────────────── */}
      <div className={styles.layoutGrid}>
        {/* Left: Deterministic Rules Evaluation */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <ShieldAlert size={15} color="var(--bt-accent)" aria-hidden="true" />
              <span>Deterministic Rule Suite Results</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--bt-text-muted)' }}>
              4 Rules Evaluated in Fixture
            </span>
          </div>

          <div className={styles.rulesList}>
            <div className={[styles.ruleItem, styles.ruleItemIssue].join(' ')}>
              <div className={styles.ruleLeft}>
                <span className={styles.ruleName}>Reveal Protection</span>
                <span className={styles.ruleCode}>RULE_REVEAL_PROTECTION</span>
              </div>
              <span className={styles.badgeIssue}>1 Finding (BT-001)</span>
            </div>

            <div className={styles.ruleItem}>
              <div className={styles.ruleLeft}>
                <span className={styles.ruleName}>Required Cue Coverage</span>
                <span className={styles.ruleCode}>RULE_REQUIRED_CUE_COVERAGE</span>
              </div>
              <span className={styles.badgePass}>Pass (0 Issues)</span>
            </div>

            <div className={styles.ruleItem}>
              <div className={styles.ruleLeft}>
                <span className={styles.ruleName}>Tension Lifecycle</span>
                <span className={styles.ruleCode}>RULE_TENSION_LIFECYCLE</span>
              </div>
              <span className={styles.badgePass}>Pass (0 Issues)</span>
            </div>

            <div className={styles.ruleItem}>
              <div className={styles.ruleLeft}>
                <span className={styles.ruleName}>Emotional Continuity</span>
                <span className={styles.ruleCode}>RULE_EMOTIONAL_CONTINUITY</span>
              </div>
              <span className={styles.badgePass}>Pass (0 Issues)</span>
            </div>
          </div>
        </div>

        {/* Right: Exploration Scope & Honest Coverage */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <FileText size={15} color="var(--bt-accent)" aria-hidden="true" />
              <span>Exploration Scope & Metrics</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--bt-text-secondary)' }}>Exploration Scope:</span>
              <span style={{ fontWeight: 600 }}>Bounded Demo (2 Routes)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--bt-text-secondary)' }}>Evaluated Routes:</span>
              <span style={{ fontWeight: 600 }}>Route A, Route B</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--bt-text-secondary)' }}>Total Mapped Passages:</span>
              <span style={{ fontWeight: 600 }}>5 Passages</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--bt-text-secondary)' }}>Audio Cues Evaluated:</span>
              <span style={{ fontWeight: 600 }}>1 (traitor_theme.wav)</span>
            </div>
          </div>

          {/* Honest Coverage Metric Box */}
          <div className={styles.coverageBox}>
            <div className={styles.coverageHeader}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--bt-text)' }}>
                Graph Coverage Score
              </span>
              <span className={styles.coverageVal}>Not evaluated</span>
            </div>
            <div className={styles.coverageDesc}>
              Per AGENTS.md §3 & PRD FR-026: Never claim exhaustive coverage unless full route exploration proves it. Quality and coverage metrics are not fabricated.
            </div>
          </div>

          {/* Fixture Preview Warning */}
          <div style={{
            background: 'rgba(234, 179, 8, 0.08)',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            borderRadius: 'var(--bt-radius-sm)',
            padding: 'var(--bt-space-3)',
            fontSize: '11px',
            color: 'var(--bt-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Info size={14} color="#EAB308" style={{ flexShrink: 0 }} aria-hidden="true" />
            <span>Real validation reports are generated by the backend engine in Phase 2.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
