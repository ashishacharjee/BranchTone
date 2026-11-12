import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  Volume2,
  AlertTriangle,
  GitBranch,
} from 'lucide-react';
import { playAuditionTone, playCueTriggerSound } from '../services/synth';
import { useWorkspaceStore } from '../stores/workspace';
import styles from './JudgeTourModal.module.css';

interface JudgeTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JudgeTourModal({ isOpen, onClose }: JudgeTourModalProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlayingAudition, setIsPlayingAudition] = useState(false);
  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);

  if (!isOpen) return null;

  const handleAuditionStep = () => {
    setIsPlayingAudition(true);
    playAuditionTone(440, 0.18);
    setTimeout(() => {
      playAuditionTone(493.88, 0.18);
    }, 220);
    setTimeout(() => {
      playCueTriggerSound(true);
      setIsPlayingAudition(false);
    }, 460);
  };

  const handleFinishAndInspect = () => {
    navigateToFinding({
      findingId: 'fnd_bt001_route_b_p003_demo',
      routeId: 'route_b',
      passageId: 'P-003',
    });
    onClose();
    navigate('/story-graph');
  };

  const steps = [
    {
      title: '1. The Problem in Branching Game Audio',
      badge: 'Core Problem',
      description:
        'In non-linear interactive fiction and narrative games, players take distinct routes through scenes. Naive audio triggers attached to passages often trigger premature cues — playing an ominous traitor theme before the player has uncovered the conspiracy!',
      content: (
        <div className={styles.interactiveCard}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
            <AlertTriangle size={16} color="var(--bt-error)" />
            <span>Story Fact vs Cue Synchronization</span>
          </div>
          <div className={styles.codeSnippet}>
            <code>RULE_REVEAL_PROTECTION: Cues must not trigger before required narrative facts (identity_revealed) are established on the active route.</code>
          </div>
        </div>
      ),
    },
    {
      title: '2. Route A (Clean) vs Route B (Defect)',
      badge: 'Traversal Comparison',
      description:
        'BranchTone simulates all playable routes simultaneously to pinpoint exact moments of narrative dissonance.',
      content: (
        <div className={styles.interactiveCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(3, 195, 123, 0.1)', border: '1px solid rgba(3, 195, 123, 0.3)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--bt-accent)', fontWeight: 600 }}>Route A (Archives):</span>
              <span style={{ color: '#fff' }}>Sen reads dossier → Learns traitor identity → Valid Cue</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(240, 79, 117, 0.12)', border: '1px solid rgba(240, 79, 117, 0.4)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--bt-error)', fontWeight: 600 }}>Route B (Air Vent):</span>
              <span style={{ color: '#fff' }}>Sen bypasses hallway in ductwork → Unaware → Premature Cue!</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '3. Real-Time Auditory Dissonance Proof',
      badge: 'Auditory Proof',
      description:
        'Listen to how Route B sounds in player experience. BranchTone synthesizes the passage traversal tones, followed by the dark tritone dissonance alert chord firing prematurely at Air Vent.',
      content: (
        <div className={styles.interactiveCard}>
          <button
            type="button"
            onClick={handleAuditionStep}
            disabled={isPlayingAudition}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(3, 195, 123, 0.25) 0%, rgba(3, 195, 123, 0.08) 100%)',
              border: '1px solid var(--bt-accent)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 0 16px rgba(3, 195, 123, 0.3)',
            }}
          >
            <Volume2 size={18} color="var(--bt-accent)" />
            <span>{isPlayingAudition ? 'Synthesizing Traversal...' : 'Click to Play Route B Defect Chord 🔊'}</span>
          </button>
        </div>
      ),
    },
    {
      title: '4. Deep Inspection in Story Graph',
      badge: 'Interactive Workspace',
      description:
        'Ready to inspect the defect in the visual workbench? Jump directly into the Story Graph with Route B active, Air Vent P-003 selected, and the BT-001 inspector open.',
      content: (
        <div className={styles.interactiveCard}>
          <div style={{ fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>
            • Passage: <strong>Air Vent (P-003)</strong><br />
            • Emotional Intensity: <strong>4/5 (Suspense)</strong><br />
            • Finding: <strong>BT-001 Reveal Protection (High Severity)</strong><br />
            • Rule Engine: <strong>Deterministic Verification</strong>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="judge-tour-title">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Sparkles size={18} color="var(--bt-accent)" aria-hidden="true" />
            <h2 id="judge-tour-title" className={styles.title}>
              GeNarrative Clash — 60s Judge Walkthrough
            </h2>
            <span className={styles.badge}>{current.badge}</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close tour">
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.stepIndicator}>
            {steps.map((_, i) => (
              <span
                key={i}
                className={[styles.stepDot, i === currentStep ? styles.stepDotActive : ''].join(' ')}
              />
            ))}
          </div>

          <div className={styles.stepTitle}>{current.title}</div>
          <p className={styles.stepDescription}>{current.description}</p>
          {current.content}
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={[styles.navBtn, styles.prevBtn].join(' ')}
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              className={[styles.navBtn, styles.nextBtn].join(' ')}
              onClick={() => setCurrentStep((s) => s + 1)}
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              className={[styles.navBtn, styles.primaryActionBtn].join(' ')}
              onClick={handleFinishAndInspect}
            >
              <span>Open in Story Graph</span>
              <GitBranch size={14} />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
