import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertCircle,
  FileText,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Filter,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import {
  getAllFindings,
  getExpectedAbsenceCases,
} from '../../services/fixtures';
import { playCueTriggerSound } from '../../services/synth';
import { useWorkspaceStore } from '../../stores/workspace';
import styles from './ValidationCentrePage.module.css';

export function ValidationCentrePage() {
  const navigate = useNavigate();
  const findings = getAllFindings();
  const absenceCases = getExpectedAbsenceCases();

  const [ruleFilter, setRuleFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFindingId, setSelectedFindingId] = useState<string>(findings[0]?.finding_id ?? '');
  const [statusOverrides, setStatusOverrides] = useState<Record<string, string>>({});

  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);

  const filteredFindings = findings.filter((f) => {
    const effectiveStatus = statusOverrides[f.finding_id] ?? f.status;
    if (ruleFilter !== 'all' && f.rule_id !== ruleFilter) return false;
    if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;
    return true;
  });

  const selectedFinding = filteredFindings.find((f) => f.finding_id === selectedFindingId) ?? filteredFindings[0];
  const effectiveSelectedStatus = selectedFinding ? (statusOverrides[selectedFinding.finding_id] ?? selectedFinding.status) : 'open';

  const handleResetFilters = () => {
    setRuleFilter('all');
    setSeverityFilter('all');
    setStatusFilter('all');
  };

  const handleInspectInGraph = () => {
    if (!selectedFinding) return;
    navigateToFinding({
      findingId: selectedFinding.finding_id,
      routeId: selectedFinding.affected_route_ids[0] ?? 'route_b',
      passageId: selectedFinding.passage_id,
    });
    navigate('/story-graph');
  };

  return (
    <div className={styles.validationCentre} role="region" aria-label="Validation Centre Workspace">
      <div className={styles.container}>
        {/* ── Topbar / Filter Row ─────────────────────────────────────── */}
      <div className={styles.topbar}>
        <div className={styles.filterControls}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--bt-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            <Filter size={13} aria-hidden="true" />
            <span>Filters:</span>
          </div>

          <select
            className={styles.filterSelect}
            value={ruleFilter}
            onChange={(e) => setRuleFilter(e.target.value)}
            aria-label="Filter by validation rule"
          >
            <option value="all">All Rules</option>
            <option value="RULE_REVEAL_PROTECTION">Reveal Protection</option>
            <option value="RULE_REQUIRED_CUE_COVERAGE">Required Cue Coverage</option>
            <option value="RULE_TENSION_LIFECYCLE">Tension Lifecycle</option>
            <option value="RULE_EMOTIONAL_CONTINUITY">Emotional Continuity</option>
          </select>

          <select
            className={styles.filterSelect}
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            aria-label="Filter by severity"
          >
            <option value="all">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_review">In Review</option>
            <option value="resolved">Resolved</option>
          </select>

          {(ruleFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              className={styles.clearFilterBtn}
              onClick={handleResetFilters}
              aria-label="Reset all filters"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--bt-text-muted)' }}>
            Showing {filteredFindings.length} of {findings.length} findings
          </span>
          <span className="demo-badge">Expected Findings Fixture</span>
        </div>
      </div>

      {/* ── Main Two-Column Layout ──────────────────────────────────── */}
      <div className={styles.layoutGrid}>
        {/* Left Column: Findings Table & Negative Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--bt-space-6)' }}>
          {/* Findings Table Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <ShieldAlert size={15} color="var(--bt-error)" aria-hidden="true" />
                <span>Deterministic Validation Findings</span>
              </div>
              <span className="demo-badge">Demo Data</span>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.findingsTable}>
                <thead>
                  <tr>
                    <th>Finding Code</th>
                    <th>Rule Name</th>
                    <th>Passage</th>
                    <th>Affected Route</th>
                    <th>Severity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFindings.length > 0 ? (
                    filteredFindings.map((f) => {
                      const isSelected = selectedFinding?.finding_id === f.finding_id;
                      return (
                        <tr
                          key={f.finding_id}
                          className={[styles.clickableFindingRow, isSelected ? styles.findingRowSelected : ''].join(' ')}
                          onClick={() => setSelectedFindingId(f.finding_id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedFindingId(f.finding_id);
                            }
                          }}
                          aria-label={`Select finding ${f.finding_code}`}
                        >
                          <td>
                            <span className={styles.findingCode}>{f.finding_code}</span>
                          </td>
                          <td>
                            <span>
                              {f.rule_id === 'RULE_REVEAL_PROTECTION'
                                ? 'Reveal Protection'
                                : f.rule_id}
                            </span>
                          </td>
                          <td>
                            <span>P-003 (Air Vent)</span>
                          </td>
                          <td>
                            <span style={{ fontFamily: 'var(--bt-font-mono)' }}>Route B</span>
                          </td>
                          <td>
                            <span className={styles.severityBadge}>
                              <AlertCircle size={11} aria-hidden="true" />
                              <span>High</span>
                            </span>
                          </td>
                          <td>
                            <span style={{
                              textTransform: 'capitalize',
                              color: (statusOverrides[f.finding_id] ?? f.status) === 'resolved' ? 'var(--bt-accent)' : 'var(--bt-text-secondary)',
                              fontWeight: 600,
                            }}>
                              {statusOverrides[f.finding_id] ?? f.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--bt-text-muted)' }}>
                        No findings match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Negative Controls / Expected Absence Panel */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <CheckCircle2 size={15} color="var(--bt-accent)" aria-hidden="true" />
                <span>Negative Controls & Expected Absence</span>
              </div>
              <span className="demo-badge">Verification Integrity</span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--bt-text-secondary)', margin: 0 }}>
              Negative controls prove the validator does not emit false positives on valid story routes or misidentify cue activation issues as broken graph transitions.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {absenceCases.map((c, i) => (
                <div key={i} className={styles.absenceCard}>
                  <CheckCircle2 size={15} color="var(--bt-accent)" style={{ flexShrink: 0 }} aria-hidden="true" />
                  <span>{c.case}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Finding Detail Drawer */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <ShieldAlert size={15} color="var(--bt-error)" aria-hidden="true" />
              <span>Finding Detail · {selectedFinding ? selectedFinding.finding_code : 'No Finding'}</span>
            </div>
            <span className="demo-badge">{selectedFinding ? 'High Severity' : 'Empty Filter'}</span>
          </div>

          {selectedFinding ? (
            <>
              {/* Violation Description */}
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>Violation Explanation</div>
                <div style={{ fontSize: '13px', color: 'var(--bt-text)', lineHeight: 1.5 }}>
                  {selectedFinding.explanation}
                </div>
              </div>

              {/* State Comparison */}
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>Narrative State Snapshot at Trigger</div>
                <div className={styles.stateComparison}>
                  <div className={styles.stateBox}>
                    <span className={styles.stateBoxLabel}>Expected Fact State</span>
                    <span className={styles.stateBoxVal} style={{ color: 'var(--bt-accent)' }}>
                      traitor_identity_revealed: true
                    </span>
                  </div>
                  <div className={styles.stateBox}>
                    <span className={styles.stateBoxLabel}>Actual Fact State</span>
                    <span className={styles.stateBoxVal} style={{ color: 'var(--bt-error)' }}>
                      traitor_identity_revealed: false
                    </span>
                  </div>
                </div>
              </div>

              {/* Source Evidence */}
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>Verified Source Evidence</div>
                <div style={{ fontSize: '11px', color: 'var(--bt-text-muted)', display: 'flex', gap: '8px' }}>
                  <FileText size={12} aria-hidden="true" />
                  <span>Passage P-003 · Verbatim Sentence</span>
                </div>
                <blockquote className={styles.quoteBox}>
                  "{selectedFinding.evidence_quote}"
                </blockquote>
              </div>

              {/* Route Trace & Suggested Action */}
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>Route Trace & Suggested Remediation</div>
                <div style={{ fontSize: '12px', color: 'var(--bt-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GitBranch size={13} aria-hidden="true" />
                  <span>Trace: {selectedFinding.route_trace.join(' → ')}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--bt-text-muted)', lineHeight: 1.5, marginTop: '4px' }}>
                  Action: {selectedFinding.suggested_action}
                </div>
              </div>

              {/* Finding Triage Controls */}
              <div className={styles.detailSection}>
                <div className={styles.detailTitle}>Finding Triage (Local Workflow State)</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {(['open', 'in_review', 'resolved'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={effectiveSelectedStatus === s ? styles.statusBtnActive : styles.statusBtn}
                      onClick={() => setStatusOverrides((prev) => ({ ...prev, [selectedFinding.finding_id]: s }))}
                      aria-pressed={effectiveSelectedStatus === s}
                    >
                      {s === 'open' ? 'Open' : s === 'in_review' ? 'In Review' : 'Mark Resolved'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ paddingTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={styles.auditionBtn}
                  onClick={() => playCueTriggerSound(true)}
                  title="Audition synthesized cue trigger violation"
                >
                  <Volume2 size={13} aria-hidden="true" />
                  <span>Audition Trigger Defect Tone</span>
                </button>

                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={handleInspectInGraph}
                >
                  <span>Inspect in Story Graph Workspace</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyFindingsBox}>
              <span>No findings match the current filter selection.</span>
              <button
                type="button"
                className={styles.clearFilterBtn}
                onClick={handleResetFilters}
              >
                <RotateCcw size={12} style={{ marginRight: '6px' }} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
