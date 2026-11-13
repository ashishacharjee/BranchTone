import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  Check,
  RotateCcw,
  Volume2,
  Clock,
  CheckCircle2,
  Cpu,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sliders,
} from 'lucide-react';
import {
  getDemoProject,
  getStoryVersion,
  getPassages,
  getStoryEdges,
  getAllFindings,
  getAudioAssets,
} from '../../services/fixtures';
import { playAuditionTone, playCueTriggerSound, playMechanicalClick } from '../../services/synth';
import { useWorkspaceStore } from '../../stores/workspace';
import { PixelMatrixNumber } from '../../components/PixelMatrixNumber';
import { AdaptionLabsModal } from '../../components/AdaptionLabsModal';
import { OscilloscopeCanvas } from '../../components/OscilloscopeCanvas';
import { HardwareVuMeter } from '../../components/HardwareVuMeter';
import styles from './OverviewPage.module.css';

interface ScrubberSceneInfo {
  passageId: string;
  name: string;
  intensity: number;
  simulatedTime: string;
  tone: number;
  isAlert: boolean;
  alertText?: string;
}

const getScrubberScene = (progress: number, route: 'route_a' | 'route_b'): ScrubberSceneInfo => {
  if (progress < 25) {
    return {
      passageId: 'P-001',
      name: 'P-001 Lobby',
      intensity: 2,
      simulatedTime: '09:00',
      tone: 440,
      isAlert: false,
    };
  } else if (progress < 55) {
    if (route === 'route_b') {
      return {
        passageId: 'P-003',
        name: 'P-003 Air Vent',
        intensity: 4,
        simulatedTime: '12:30',
        tone: 493.88,
        isAlert: true,
        alertText: 'BT-001 Premature traitor_theme.wav cue fired!',
      };
    } else {
      return {
        passageId: 'P-002',
        name: 'P-002 Archives',
        intensity: 3,
        simulatedTime: '11:15',
        tone: 493.88,
        isAlert: false,
      };
    }
  } else if (progress < 80) {
    return {
      passageId: 'P-004',
      name: 'P-004 Server Vault',
      intensity: 5,
      simulatedTime: '14:45',
      tone: 523.25,
      isAlert: false,
    };
  } else {
    return {
      passageId: 'P-005',
      name: 'P-005 Safe House',
      intensity: 2,
      simulatedTime: '17:00',
      tone: 587.33,
      isAlert: false,
    };
  }
};

const getFormattedTime = (progress: number): string => {
  const startMinutes = 9 * 60; // 09:00
  const totalMinutes = 8 * 60; // 8 hours until 17:00
  const currentMinutes = Math.round(startMinutes + (progress / 100) * totalMinutes);
  const hours = Math.floor(currentMinutes / 60);
  const minutes = currentMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

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

  // ── Interactive Timeline Scrubber & Route State ────────────────────────────
  const [scrubberProgress, setScrubberProgress] = useState(38);
  const [activeScrubberRoute, setActiveScrubberRoute] = useState<'route_a' | 'route_b'>('route_b');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const lastPassageRef = useRef<string>('P-003');

  // ── Adaption Labs Copilot Workbench State ─────────────────────────────────
  const [selectedCopilotPassage, setSelectedCopilotPassage] = useState<'P-001' | 'P-002' | 'P-003' | 'P-004' | 'P-005'>('P-003');
  const [isAiFixApplied, setIsAiFixApplied] = useState(false);

  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);
  const setSelectedRoute = useWorkspaceStore((s) => s.setSelectedRoute);
  const setSelectedPassage = useWorkspaceStore((s) => s.setSelectedPassage);

  const missingAssetsCount = audioAssets.filter((a) => a.status === 'missing').length;

  const currentScrubberScene = getScrubberScene(scrubberProgress, activeScrubberRoute);
  const currentSimulatedTime = getFormattedTime(scrubberProgress);

  // Audio & Store Synchronization on Scrubber Scrub
  useEffect(() => {
    const scene = getScrubberScene(scrubberProgress, activeScrubberRoute);
    if (scene.passageId !== lastPassageRef.current) {
      lastPassageRef.current = scene.passageId;
      setSelectedPassage(scene.passageId);
      if (scene.isAlert) {
        playCueTriggerSound(true);
      } else {
        playAuditionTone(scene.tone, 0.12);
      }
    }
  }, [scrubberProgress, activeScrubberRoute, setSelectedPassage]);

  // Auto-play Traversal Animation at 60fps
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setScrubberProgress((prev) => {
        if (prev >= 100) {
          setIsAutoPlaying(false);
          playAuditionTone(587.33, 0.3);
          return 100;
        }
        const next = prev + 1.25;
        return next > 100 ? 100 : next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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
    setIsAiFixApplied(false);
    setShowToast(false);
  };

  const handleJumpToRoute = (routeId: string, passageId: string) => {
    setSelectedRoute(routeId);
    setSelectedPassage(passageId);
    navigate('/route-lab');
  };

  const handleJumpScrubberToPassage = (progressVal: number, routeId: 'route_a' | 'route_b', passageId: string) => {
    playMechanicalClick();
    setActiveScrubberRoute(routeId);
    setScrubberProgress(progressVal);
    setSelectedRoute(routeId);
    setSelectedPassage(passageId);
  };

  const handleApplyAiProposal = () => {
    setIsAiFixApplied(true);
    setIsApproved(true);
    playAuditionTone(523.25, 0.25);
    setToastMessage('✓ Adaption Labs AI proposal applied: traitor_theme.wav deferred to post-dossier variable check');
    setShowToast(true);
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
                <Sliders size={20} />
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
                title="Audition Route B traversal and defect alert via browser Web Audio synth (Space)"
              >
                <Volume2 size={15} aria-hidden="true" />
                <span>{isPlayingAudition ? 'Auditioning Traversal...' : 'Audition Traversal (Space)'}</span>
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

        {/* ── Row 3: Interactive Traversal Scrubber & Timeline ─────────────── */}
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
              {/* ── Precision Audio Telemetry Bridge (Awwwards Studio Engine) ─── */}
              <div className={styles.audioTelemetryBridge}>
                <div className={styles.oscilloscopeSection}>
                  <OscilloscopeCanvas
                    height={64}
                    isAlert={currentScrubberScene.isAlert}
                    activePassage={currentScrubberScene.passageId}
                    routeId={activeScrubberRoute}
                  />
                </div>
                <div className={styles.vuMeterSection}>
                  <HardwareVuMeter isAlert={currentScrubberScene.isAlert} />
                </div>
              </div>

              {/* Interactive Transport & Route Switcher Bar */}
              <div className={styles.scrubberControlsBar}>
                {/* Route Switcher Toggle */}
                <div className={styles.routeToggleGroup}>
                  <button
                    type="button"
                    className={[
                      styles.routeToggleBtn,
                      activeScrubberRoute === 'route_b' ? styles.routeToggleBtnActiveAlert : '',
                    ].join(' ')}
                    onClick={() => {
                      playMechanicalClick();
                      setActiveScrubberRoute('route_b');
                      setSelectedRoute('route_b');
                    }}
                    title="Audit Route B: Stealth route containing BT-001 premature cue defect"
                  >
                    <span>● Route B (Stealth · BT-001 Defect)</span>
                  </button>

                  <button
                    type="button"
                    className={[
                      styles.routeToggleBtn,
                      activeScrubberRoute === 'route_a' ? styles.routeToggleBtnActive : '',
                    ].join(' ')}
                    onClick={() => {
                      playMechanicalClick();
                      setActiveScrubberRoute('route_a');
                      setSelectedRoute('route_a');
                    }}
                    title="Audit Route A: Investigation route where conspirator dossier is legitimately uncovered"
                  >
                    <span>● Route A (Investigation · Clean)</span>
                  </button>
                </div>

                {/* Transport Controls */}
                <div className={styles.transportGroup}>
                  <button
                    type="button"
                    className={[
                      styles.transportBtn,
                      styles.transportBtnPlay,
                      isAutoPlaying ? styles.transportBtnActive : '',
                    ].join(' ')}
                    onClick={() => {
                      playMechanicalClick();
                      if (scrubberProgress >= 100) setScrubberProgress(0);
                      setIsAutoPlaying(!isAutoPlaying);
                    }}
                    title={isAutoPlaying ? 'Pause traversal playback' : 'Play 60fps route traversal simulation with real Web Audio feedback'}
                  >
                    {isAutoPlaying ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
                    <span>{isAutoPlaying ? 'Playing Traversal...' : 'Auto Traversal'}</span>
                  </button>

                  <button
                    type="button"
                    className={styles.transportBtn}
                    onClick={() => {
                      playMechanicalClick();
                      setScrubberProgress(Math.max(0, scrubberProgress - 25));
                    }}
                    title="Step backward to previous story node"
                  >
                    <SkipBack size={12} aria-hidden="true" />
                    <span>Prev Scene</span>
                  </button>

                  <button
                    type="button"
                    className={styles.transportBtn}
                    onClick={() => {
                      playMechanicalClick();
                      setScrubberProgress(Math.max(0, scrubberProgress - 5));
                    }}
                    title="Nudge scrubber backward by 5% along narrative timeline"
                  >
                    <span>-5s</span>
                  </button>

                  <button
                    type="button"
                    className={styles.transportBtn}
                    onClick={() => {
                      playMechanicalClick();
                      setScrubberProgress(Math.min(100, scrubberProgress + 5));
                    }}
                    title="Nudge scrubber forward by 5% along narrative timeline"
                  >
                    <span>+5s</span>
                  </button>

                  <button
                    type="button"
                    className={styles.transportBtn}
                    onClick={() => {
                      playMechanicalClick();
                      setScrubberProgress(Math.min(100, scrubberProgress + 25));
                    }}
                    title="Step forward to next story node"
                  >
                    <span>Next Scene</span>
                    <SkipForward size={12} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    className={styles.transportBtn}
                    onClick={() => {
                      playMechanicalClick();
                      setIsAutoPlaying(false);
                      setScrubberProgress(0);
                    }}
                    title="Reset scrubber to Scene 1 (09:00)"
                  >
                    <RotateCcw size={12} aria-hidden="true" />
                  </button>
                </div>

                {/* Real-time Status Badge */}
                <div className={styles.scrubberLiveBadge}>
                  <span className={styles.liveTimeText}>{currentSimulatedTime}</span>
                  <span className={styles.liveNodeText}>· {currentScrubberScene.name}</span>
                  {currentScrubberScene.isAlert ? (
                    <span className={styles.liveAlertBadge}>⚠ BT-001 DEFECT DETECTED</span>
                  ) : (
                    <span className={styles.liveCleanBadge}>✓ VALID TRANSITION</span>
                  )}
                </div>
              </div>

              {/* Interactive Range Scrubber Slider */}
              <div className={styles.sliderTrackArea}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scrubberProgress}
                  onChange={(e) => {
                    setIsAutoPlaying(false);
                    setScrubberProgress(Number(e.target.value));
                  }}
                  className={styles.rangeSlider}
                  aria-label="Story Traversal Scrubber"
                />
              </div>

              {/* Floating Tooltip over Air Vent when hovered or active */}
              {(isHoveringAirVent || (activeScrubberRoute === 'route_b' && scrubberProgress >= 25 && scrubberProgress <= 54)) && (
                <div className={styles.scheduleTooltip} role="tooltip">
                  <div className={styles.tooltipTitle}>Passage: Air Vent (P-003)</div>
                  <div className={styles.tooltipMeta}>
                    • Scene Intensity: <strong>4/5 (Suspense)</strong><br />
                    • Defect: <code>traitor_theme.wav</code> fires prematurely!<br />
                    • Conspirator reveal spoiled 1 step before Server Vault
                  </div>
                </div>
              )}

              {/* Scrubber vertical line synced with slider position */}
              <div
                className={styles.scrubberLine}
                style={{ left: `${scrubberProgress}%` }}
                aria-hidden="true"
              >
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
                  <button
                    type="button"
                    className={styles.routeTrackLabel}
                    onClick={() => handleJumpToRoute('route_a', 'P-001')}
                    title="Open Route A in Route Lab"
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    Route A ↗
                  </button>
                  <div className={styles.routeSegments}>
                    <button
                      type="button"
                      className={[
                        styles.sceneBlockClean,
                        activeScrubberRoute === 'route_a' && scrubberProgress < 25 ? styles.sceneBlockActiveClean : '',
                      ].join(' ')}
                      onClick={() => handleJumpScrubberToPassage(10, 'route_a', 'P-001')}
                    >
                      P-001 Lobby
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={[
                        styles.sceneBlockClean,
                        activeScrubberRoute === 'route_a' && scrubberProgress >= 25 && scrubberProgress < 55 ? styles.sceneBlockActiveClean : '',
                      ].join(' ')}
                      onClick={() => handleJumpScrubberToPassage(40, 'route_a', 'P-002')}
                    >
                      P-002 Archives (Dossier Read)
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={[
                        styles.sceneBlockClean,
                        activeScrubberRoute === 'route_a' && scrubberProgress >= 55 && scrubberProgress < 80 ? styles.sceneBlockActiveClean : '',
                      ].join(' ')}
                      onClick={() => handleJumpScrubberToPassage(68, 'route_a', 'P-004')}
                    >
                      P-004 Server Vault (Valid Theme)
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={[
                        styles.sceneBlockClean,
                        activeScrubberRoute === 'route_a' && scrubberProgress >= 80 ? styles.sceneBlockActiveClean : '',
                      ].join(' ')}
                      onClick={() => handleJumpScrubberToPassage(90, 'route_a', 'P-005')}
                    >
                      P-005 Safe House
                    </button>
                  </div>
                </div>

                {/* Route B Track */}
                <div className={styles.routeTrackRow}>
                  <button
                    type="button"
                    className={styles.routeTrackLabel}
                    onClick={() => handleJumpToRoute('route_b', 'P-003')}
                    title="Open Route B in Route Lab"
                    style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    Route B ↗
                  </button>
                  <div className={styles.routeSegments}>
                    <button
                      type="button"
                      className={[
                        styles.sceneBlockClean,
                        activeScrubberRoute === 'route_b' && scrubberProgress < 25 ? styles.sceneBlockActiveClean : '',
                      ].join(' ')}
                      onClick={() => handleJumpScrubberToPassage(10, 'route_b', 'P-001')}
                    >
                      P-001 Lobby
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={[
                        styles.sceneBlockAlert,
                        activeScrubberRoute === 'route_b' && scrubberProgress >= 25 && scrubberProgress < 55 ? styles.sceneBlockActiveAlert : '',
                      ].join(' ')}
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
                      className={[
                        styles.sceneBlockClean,
                        activeScrubberRoute === 'route_b' && scrubberProgress >= 55 && scrubberProgress < 80 ? styles.sceneBlockActiveClean : '',
                      ].join(' ')}
                      onClick={() => handleJumpScrubberToPassage(68, 'route_b', 'P-004')}
                    >
                      P-004 Server Vault
                    </button>
                    <span>→</span>
                    <button
                      type="button"
                      className={[
                        styles.sceneBlockClean,
                        activeScrubberRoute === 'route_b' && scrubberProgress >= 80 ? styles.sceneBlockActiveClean : '',
                      ].join(' ')}
                      onClick={() => handleJumpScrubberToPassage(90, 'route_b', 'P-005')}
                    >
                      P-005 Safe House
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 4: Priorities Checklist (Span 6) + Adaption Labs AI (Span 6) ─ */}
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
                title="Open Adaption Labs Model Benchmark (Sponsor Bonus)"
              >
                <Cpu size={11} aria-hidden="true" />
                <span>Adaption Labs Tuner</span>
              </button>
            </div>

            {/* Interactive Passage Selector for AI Copilot */}
            <div className={styles.aiPassageSelector}>
              {(['P-001', 'P-002', 'P-003', 'P-004', 'P-005'] as const).map((pid) => (
                <button
                  key={pid}
                  type="button"
                  className={[
                    styles.aiPassagePill,
                    selectedCopilotPassage === pid ? styles.aiPassagePillActive : '',
                    pid === 'P-003' ? styles.aiPassagePillAlert : '',
                  ].join(' ')}
                  onClick={() => setSelectedCopilotPassage(pid)}
                >
                  <span>{pid}</span>
                  {pid === 'P-003' && <span>⚠</span>}
                </button>
              ))}
            </div>

            {/* Live Copilot Inference Card */}
            <div className={styles.copilotBox}>
              <div className={styles.copilotHeader}>
                <span className={styles.copilotTitle}>
                  <Cpu size={13} color="#0F172A" aria-hidden="true" />
                  <span>Adaption 7B Copilot: {selectedCopilotPassage}</span>
                </span>
                <span style={{ fontSize: '11px', fontFamily: 'var(--bt-font-mono)', color: selectedCopilotPassage === 'P-003' ? '#DC2626' : '#047857', fontWeight: 600 }}>
                  {selectedCopilotPassage === 'P-003'
                    ? 'Trigger Defect: High Confidence'
                    : selectedCopilotPassage === 'P-002'
                    ? 'Verified Valid: Dossier Read'
                    : 'Verified Valid: Clean State'}
                </span>
              </div>

              {/* Tension Level Visualizer */}
              <div className={styles.tensionBarWrapper}>
                <span style={{ color: '#64748B', minWidth: '70px' }}>Tension:</span>
                <div className={styles.tensionBarBg}>
                  <div
                    className={styles.tensionBarFill}
                    style={{
                      width:
                        selectedCopilotPassage === 'P-003'
                          ? '80%'
                          : selectedCopilotPassage === 'P-004'
                          ? '100%'
                          : selectedCopilotPassage === 'P-002'
                          ? '60%'
                          : '40%',
                      background:
                        selectedCopilotPassage === 'P-003'
                          ? '#EF4444'
                          : selectedCopilotPassage === 'P-004'
                          ? '#EF4444'
                          : '#10B981',
                    }}
                  />
                </div>
                <strong style={{ minWidth: '35px', textAlign: 'right' }}>
                  {selectedCopilotPassage === 'P-003'
                    ? '4/5'
                    : selectedCopilotPassage === 'P-004'
                    ? '5/5'
                    : selectedCopilotPassage === 'P-002'
                    ? '3/5'
                    : '2/5'}
                </strong>
              </div>

              {/* AI Recommendation Box */}
              <div className={styles.copilotProposal}>
                {selectedCopilotPassage === 'P-003' ? (
                  <div>
                    <strong>AI Recommendation:</strong> Defer cue trigger <code>traitor_theme.wav</code> until variable <code>$conspirator_revealed</code> evaluates to true. Prevents spoiling the conspirator reveal 1 node early!
                  </div>
                ) : selectedCopilotPassage === 'P-002' ? (
                  <div>
                    <strong>Analysis:</strong> Player reads the conspirator dossier here. Validly enables character knowledge for Server Vault climax.
                  </div>
                ) : (
                  <div>
                    <strong>Analysis:</strong> Ambient audio balance conforms to tension curve specifications.
                  </div>
                )}
              </div>

              {selectedCopilotPassage === 'P-003' && (
                <button
                  type="button"
                  className={styles.applyFixBtn}
                  onClick={handleApplyAiProposal}
                  disabled={isAiFixApplied}
                >
                  <Check size={13} aria-hidden="true" />
                  <span>{isAiFixApplied ? '✓ Proposed Rule Delay Applied' : 'Apply Proposed Delay Rule'}</span>
                </button>
              )}
            </div>

            {/* Model Architecture Mini Cards */}
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
