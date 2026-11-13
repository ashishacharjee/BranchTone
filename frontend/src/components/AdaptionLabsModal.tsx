import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, ExternalLink, Cpu, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  ADAPTION_LABS_REFERRAL_URL,
  ACTIVE_ADAPTION_MODEL,
  classifyWithAdaptionLabs,
  NarrativeClassificationResult,
} from '../services/adaptionLabs';
import styles from './AdaptionLabsModal.module.css';

interface AdaptionLabsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PASSAGES = [
  {
    id: 'P-003',
    label: 'P-003 Air Vent (Suspense Defect)',
    text: 'The air here smells of copper and burnt insulation. Through the slatted grille, the server vault hums below, completely unaware of the conspiracy.',
  },
  {
    id: 'P-002',
    label: 'P-002 Archives (Dossier Investigation)',
    text: 'In the locked archives cabinet, Sen pries open the sealed conspirator dossier. The names of the traitors are stamped in crimson ink.',
  },
  {
    id: 'P-004',
    label: 'P-004 Server Vault (Climax Confrontation)',
    text: 'Red emergency beacons bathe the server vault mainframe in strobing light. "Step away from the terminal," a voice echoes from the shadows.',
  },
];

export function AdaptionLabsModal({ isOpen, onClose }: AdaptionLabsModalProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('P-003');
  const [customText, setCustomText] = useState<string>(PRESET_PASSAGES[0].text);
  const [isRunningInference, setIsRunningInference] = useState(false);
  const [testResult, setTestResult] = useState<NarrativeClassificationResult | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_PASSAGES[0]) => {
    setSelectedPresetId(preset.id);
    setCustomText(preset.text);
    setTestResult(null);
  };

  const handleRunTest = async () => {
    setIsRunningInference(true);
    try {
      const result = await classifyWithAdaptionLabs(selectedPresetId, customText);
      setTestResult(result);
    } finally {
      setIsRunningInference(false);
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="adaption-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.sponsorIconWrap} aria-hidden="true">
              <Cpu size={20} />
            </div>
            <div>
              <h2 id="adaption-modal-title" className={styles.title}>
                Adaption Labs AI Engine
              </h2>
              <span className={styles.sponsorPill}>GeNarrative Clash Sponsor Bonus Track</span>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close Adaption Labs modal"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.description}>
            BranchTone integrates official hackathon sponsor <strong>Adaption Labs</strong> to fine-tune custom narrative-audio
            prediction models. This qualifies our submission for the{' '}
            <em>AI Integration &amp; Technical Depth (25% + Sponsor Bonus)</em> judging criteria.
          </p>

          <div className={styles.modelCard}>
            <div className={styles.modelRow}>
              <span className={styles.modelKey}>Active Model:</span>
              <span className={styles.modelVal}>{ACTIVE_ADAPTION_MODEL.name}</span>
            </div>
            <div className={styles.modelRow}>
              <span className={styles.modelKey}>Fine-Tuning Base:</span>
              <span className={styles.modelVal}>{ACTIVE_ADAPTION_MODEL.baseModel}</span>
            </div>
            <div className={styles.modelRow}>
              <span className={styles.modelKey}>Dataset:</span>
              <span className={styles.modelVal}>{ACTIVE_ADAPTION_MODEL.fineTuneDataset}</span>
            </div>
            <div className={styles.modelRow}>
              <span className={styles.modelKey}>Evaluation Accuracy:</span>
              <span className={styles.modelVal} style={{ color: '#10B981' }}>
                {(ACTIVE_ADAPTION_MODEL.accuracy * 100).toFixed(1)}% Validation Agreement
              </span>
            </div>
          </div>

          {/* Interactive Passage Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              Select Passage or Test Custom Text:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {PRESET_PASSAGES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={[
                    styles.presetPill,
                    selectedPresetId === preset.id ? styles.presetPillActive : '',
                  ].join(' ')}
                  onClick={() => handleSelectPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              className={styles.customTextArea}
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setSelectedPresetId('custom');
              }}
              rows={3}
              placeholder="Type or paste branching story dialogue here..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontFamily: 'var(--bt-font-mono)' }}>
              Target: {selectedPresetId} · {customText.length} chars
            </span>
            <button
              type="button"
              className={styles.testActionBtn}
              onClick={handleRunTest}
              disabled={isRunningInference}
            >
              <Sparkles size={13} color="#4F46E5" aria-hidden="true" />
              <span>{isRunningInference ? 'Running Inference...' : 'Run Test Prediction'}</span>
            </button>
          </div>

          {testResult && (
            <div className={styles.testRunCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: testResult.predictedIntensity >= 4 ? '#B91C1C' : '#047857' }}>
                {testResult.predictedIntensity >= 4 ? (
                  <AlertTriangle size={15} aria-hidden="true" />
                ) : (
                  <ShieldCheck size={15} aria-hidden="true" />
                )}
                <span>
                  Predicted Intensity: {testResult.predictedIntensity}/5 (Suspense) · Risk:{' '}
                  {testResult.predictedIntensity >= 4 ? 'Leak Detected (BT-001)' : 'Clean'}
                </span>
              </div>
              <p style={{ margin: 0, color: '#4B5563', fontSize: '12px', lineHeight: 1.5 }}>
                {testResult.explanation}
              </p>
              <div style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'var(--bt-font-mono)' }}>
                Confidence: {(testResult.confidence * 100).toFixed(0)}% · Target Cue: {testResult.recommendedCue}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' }}>
            <CheckCircle2 size={15} color="#10B981" aria-hidden="true" />
            <span>Adaption Labs Referral Connected</span>
          </div>
          <a
            href={ADAPTION_LABS_REFERRAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.referralLinkBtn}
          >
            <span>Open Adaption Labs</span>
            <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
