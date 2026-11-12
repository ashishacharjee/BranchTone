import { useNavigate } from 'react-router-dom';
import { X, Heart, HelpCircle, Music, FileText, AlertCircle, ShieldAlert, GitBranch, ArrowRight } from 'lucide-react';
import type { PassageDisplayData } from '../../services/fixtures';
import { getFindingsForPassage, getAudioCuesForPassage, getRoute } from '../../services/fixtures';
import styles from './PassageInspector.module.css';

interface PassageInspectorProps {
  passage: PassageDisplayData | undefined;
  selectedRouteId: string | null;
  onClose?: () => void;
}

export function PassageInspector({
  passage,
  selectedRouteId,
  onClose,
}: PassageInspectorProps) {
  const navigate = useNavigate();

  if (!passage) {
    return (
      <aside className={styles.inspector} aria-label="Passage inspector">
        <div className={styles.header}>
          <span className={styles.headerTitle}>Passage Inspector</span>
        </div>
        <div className={styles.section}>
          <p className={styles.noFindings}>Select a passage on the story graph to inspect its narrative state, audio cues, and findings.</p>
        </div>
      </aside>
    );
  }

  const route = selectedRouteId ? getRoute(selectedRouteId) : undefined;
  const findings = getFindingsForPassage(passage.passage_id, selectedRouteId ?? undefined);
  const cues = getAudioCuesForPassage(passage.passage_id);

  const intensityPercent = passage.intensity ? (passage.intensity / 5) * 100 : 0;
  const identityRevealedText = passage.identity_revealed_at_entry ? 'Yes' : 'No';

  return (
    <aside className={styles.inspector} aria-label={`Passage inspector for ${passage.title}`}>
      {/* ── Top Header ──────────────────────────────────────────────── */}
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Passage Inspector</h2>
        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close inspector"
            title="Deselect passage"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Passage Title & Route Context ────────────────────────────── */}
      <div className={styles.passageSummary}>
        <div className={styles.summaryThumb} aria-hidden="true">
          <InspectorThumbnail passageId={passage.passage_id} />
        </div>
        <div className={styles.summaryInfo}>
          <h3 className={styles.summaryTitle}>{passage.title}</h3>
          <div className={styles.summaryMeta}>
            <span className={styles.summaryId}>{passage.passage_id}</span>
            {route && (
              <span className={styles.summaryRoute}>
                <GitBranch size={11} aria-hidden="true" />
                {route.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 1. NARRATIVE STATE ────────────────────────────────────────── */}
      <section className={styles.section} aria-label="Narrative state">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Narrative State</span>
          <span className="demo-badge">Demo Data</span>
        </div>
        <div className={styles.propList}>
          <div className={styles.propRow}>
            <span className={styles.propLabel}>
              <Heart size={12} aria-hidden="true" />
              Mood
            </span>
            <span className={styles.propValue}>{passage.mood ?? 'Neutral'}</span>
          </div>

          <div className={styles.propRow}>
            <span className={styles.propLabel}>Emotional Intensity</span>
            <div className={styles.intensityWrap}>
              <span className={styles.propValue}>
                {passage.intensity ? `${passage.intensity.toString()}/5` : 'Not set'}
              </span>
              <div
                className={styles.intensityBarBg}
                role="progressbar"
                aria-valuenow={passage.intensity ?? 0}
                aria-valuemin={1}
                aria-valuemax={5}
                aria-label="Emotional intensity"
              >
                <div
                  className={styles.intensityBarFill}
                  style={{ width: `${intensityPercent.toString()}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.propRow}>
            <span className={styles.propLabel}>
              <HelpCircle size={12} aria-hidden="true" />
              Identity Revealed
            </span>
            <span className={styles.propValue}>{identityRevealedText}</span>
          </div>
        </div>
      </section>

      {/* ── 2. AUDIO CUES ────────────────────────────────────────────── */}
      <section className={styles.section} aria-label="Audio cues">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Audio Cues</span>
          <span className="demo-badge">Demo Data</span>
        </div>
        {cues.length > 0 ? (
          cues.map((cue) => (
            <div key={cue.cue_id} className={styles.cueCard}>
              <div className={styles.cueHeader}>
                <Music size={13} aria-hidden="true" />
                <span>{cue.asset?.filename ?? 'audio_asset.wav'}</span>
              </div>
              <div className={styles.cueRow}>
                <span>Layer</span>
                <span className={styles.cueValue} style={{ textTransform: 'capitalize' }}>
                  {cue.layer}
                </span>
              </div>
              <div className={styles.cueRow}>
                <span>Trigger</span>
                <span className={styles.cueValue}>
                  {cue.trigger.type === 'passage_entry' ? 'Passage entry' : 'Narrative event'}
                </span>
              </div>

              <button
                type="button"
                className={styles.actionLinkBtn}
                onClick={() => navigate('/cue-library')}
                title="Inspect in Cue Library"
              >
                <span>Inspect in Cue Library</span>
                <ArrowRight size={12} aria-hidden="true" />
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noFindings}>No active audio cues attached to this passage.</div>
        )}
      </section>

      {/* ── 3. VALIDATION FINDINGS ────────────────────────────────────── */}
      <section className={styles.section} aria-label="Validation findings">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Validation Finding</span>
          <span className="demo-badge">Demo Data</span>
        </div>
        {findings.length > 0 ? (
          findings.map((f) => (
            <div key={f.finding_id} className={styles.findingCard}>
              <div className={styles.findingHeader}>
                <div className={styles.findingCodeWrap}>
                  <ShieldAlert size={15} color="var(--bt-error)" aria-hidden="true" />
                  <span className={styles.findingCode}>{f.finding_code}</span>
                </div>
                <span className={styles.findingAlertBadge}>
                  <AlertCircle size={12} aria-hidden="true" />
                  Issue
                </span>
              </div>

              <div className={styles.findingGrid}>
                <div className={styles.findingRow}>
                  <span className={styles.findingLabel}>Rule</span>
                  <span className={styles.findingValue}>
                    {f.rule_id === 'RULE_REVEAL_PROTECTION'
                      ? 'Reveal Protection'
                      : f.rule_id}
                  </span>
                </div>
                <div className={styles.findingRow}>
                  <span className={styles.findingLabel}>Severity</span>
                  <span className={styles.severityHigh}>
                    <span className={styles.severityDot} aria-hidden="true" />
                    High
                  </span>
                </div>
              </div>

              <div className={styles.findingExplanation}>
                {f.explanation}
              </div>

              <button
                type="button"
                className={styles.actionLinkBtn}
                onClick={() => navigate('/validation-centre')}
                title="View in Validation Centre"
              >
                <span>View in Validation Centre</span>
                <ArrowRight size={12} aria-hidden="true" />
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noFindings}>
            No validation issues detected on this route.
          </div>
        )}
      </section>

      {/* ── 4. SOURCE EVIDENCE ────────────────────────────────────────── */}
      <section className={styles.section} aria-label="Source evidence">
        <div className={styles.evidenceHeading}>
          <FileText size={13} aria-hidden="true" />
          <span>{`${passage.passage_id} · Original Passage Text`}</span>
        </div>

        <blockquote className={styles.quoteCard}>
          <p className={styles.quoteText}>
            "{passage.raw_text}"
          </p>
        </blockquote>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className={styles.demoFooter}>
        <span className={styles.demoFooterText}>The Last Signal · v0.4</span>
        <span className="demo-badge">Demo Fixture</span>
      </div>
    </aside>
  );
}

function InspectorThumbnail({ passageId }: { passageId: string }) {
  if (passageId === 'P-003') {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" fill="#15080C" />
        <rect x="4" y="4" width="40" height="40" stroke="#F04F75" strokeWidth="1.5" strokeOpacity="0.8" fill="#1C0D13" />
        <rect x="12" y="12" width="24" height="24" stroke="#853C65" strokeWidth="1" fill="#0C0407" />
        <line x1="4" y1="4" x2="16" y2="16" stroke="#F04F75" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="44" y1="4" x2="32" y2="16" stroke="#F04F75" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    );
  }
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" fill="#0E1817" />
      <rect x="6" y="6" width="36" height="36" stroke="#29C98A" strokeWidth="1.5" strokeOpacity="0.6" fill="#132321" />
      <line x1="6" y1="6" x2="16" y2="16" stroke="#29C98A" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="42" y1="6" x2="32" y2="16" stroke="#29C98A" strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}
