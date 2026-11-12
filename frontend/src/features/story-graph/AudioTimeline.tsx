import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Activity, Radio } from 'lucide-react';
import { getRoute, getPassage } from '../../services/fixtures';
import { setMasterVolume, playAuditionTone, playCueTriggerSound } from '../../services/synth';
import styles from './AudioTimeline.module.css';

interface AudioTimelineProps {
  selectedRouteId: string | null;
  selectedPassageId: string | null;
  onSelectPassage?: (passageId: string) => void;
  onSelectCueMarker?: () => void;
}

export const AudioTimeline = memo(function AudioTimeline({
  selectedRouteId,
  selectedPassageId,
  onSelectPassage,
  onSelectCueMarker,
}: AudioTimelineProps) {
  const currentRouteId = selectedRouteId ?? 'route_b';
  const route = getRoute(currentRouteId);
  const passageIds = route ? route.passage_path : ['P-001', 'P-003', 'P-004', 'P-005'];

  const [volume, setVolume] = useState(70);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);
  const [playheadPercent, setPlayheadPercent] = useState(30.88); // 84s / 272s ≈ 30.88%
  const simulationTimerRef = useRef<number | null>(null);

  const currentPassageIndex = passageIds.indexOf(selectedPassageId ?? '');
  const canSkipBackward = currentPassageIndex > 0;
  const canSkipForward = currentPassageIndex < passageIds.length - 1;

  // Total design fixture duration = 272s (04:32)
  const totalDurationSeconds = 272;
  const currentSeconds = Math.round((playheadPercent / 100) * totalDurationSeconds);
  const displayCurrentMinutes = Math.floor(currentSeconds / 60).toString().padStart(2, '0');
  const displayCurrentSecs = (currentSeconds % 60).toString().padStart(2, '0');
  const displayCurrentTime = `${displayCurrentMinutes}:${displayCurrentSecs}`;

  const segmentWidths: Record<string, number> = currentRouteId === 'route_b'
    ? {
        'P-001': 28, // Lobby: 0 to ~76s (28%)
        'P-003': 22, // Air Vent: ~76s to ~136s (28% to 50%)
        'P-004': 26, // Server Vault: ~136s to ~206s (50% to 76%)
        'P-005': 24, // Safe House: ~206s to 272s (76% to 100%)
      }
    : {
        'P-001': 28,
        'P-002': 22,
        'P-004': 26,
        'P-005': 24,
      };

  // Air Vent entry boundary on Route B is at exactly 28%
  const cueMarkerPercent = 28;

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    setMasterVolume(newVal);
  };

  const jumpToPassage = useCallback((pId: string) => {
    onSelectPassage?.(pId);
    // Find passage segment start percent
    let startPercent = 0;
    for (const id of passageIds) {
      if (id === pId) break;
      startPercent += segmentWidths[id] ?? 25;
    }
    setPlayheadPercent(startPercent + 1);
    playAuditionTone(523.25, 0.15); // C5 chime
  }, [passageIds, segmentWidths, onSelectPassage]);

  const handleSkipBackward = useCallback(() => {
    if (canSkipBackward) {
      jumpToPassage(passageIds[currentPassageIndex - 1]);
    }
  }, [canSkipBackward, currentPassageIndex, passageIds, jumpToPassage]);

  const handleSkipForward = useCallback(() => {
    if (canSkipForward) {
      jumpToPassage(passageIds[currentPassageIndex + 1]);
    } else if (currentPassageIndex === -1 && passageIds.length > 0) {
      jumpToPassage(passageIds[0]);
    }
  }, [canSkipForward, currentPassageIndex, passageIds, jumpToPassage]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setPlayheadPercent(clickPercent);

    // Determine which passage this percent corresponds to
    let accumulated = 0;
    for (const pId of passageIds) {
      const width = segmentWidths[pId] ?? 25;
      if (clickPercent >= accumulated && clickPercent < accumulated + width) {
        onSelectPassage?.(pId);
        break;
      }
      accumulated += width;
    }
    playAuditionTone(440, 0.1);
  };

  // Traversal simulation loop
  useEffect(() => {
    if (isPlayingSimulation) {
      simulationTimerRef.current = window.setInterval(() => {
        setPlayheadPercent((prev) => {
          if (prev >= 99.5) {
            setIsPlayingSimulation(false);
            return 0;
          }
          const next = prev + 0.6;

          // Check if crossed cue marker boundary (28%) on Route B
          if (currentRouteId === 'route_b' && prev < 28 && next >= 28) {
            playCueTriggerSound(true); // Violation sound
          }

          // Check passage boundaries
          let acc = 0;
          for (const pId of passageIds) {
            const width = segmentWidths[pId] ?? 25;
            if (next >= acc && next < acc + width) {
              if (selectedPassageId !== pId) {
                onSelectPassage?.(pId);
              }
              break;
            }
            acc += width;
          }

          return next;
        });
      }, 100);
    } else if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
    }

    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, [isPlayingSimulation, currentRouteId, passageIds, segmentWidths, selectedPassageId, onSelectPassage]);

  return (
    <div className={styles.timeline} role="region" aria-label="Audio timeline and transport">
      {/* ── Transport Bar ───────────────────────────────────────────── */}
      <div className={styles.transportBar}>
        <div className={styles.playbackButtons} role="group" aria-label="Audio playback controls">
          <button
            type="button"
            className={styles.transportBtn}
            onClick={handleSkipBackward}
            disabled={!canSkipBackward}
            title={
              canSkipBackward
                ? `Skip backward to ${passageIds[currentPassageIndex - 1]}`
                : 'At start of route sequence'
            }
            aria-label="Skip backward"
          >
            <SkipBack size={13} aria-hidden="true" />
          </button>

          {/* Media Play Button — strictly disabled with reason per PRD & AGENTS.md §8 */}
          <button
            type="button"
            className={`${styles.transportBtn} ${styles.playBtn}`}
            disabled
            title="Playback disabled — traitor_theme.wav is a missing asset fixture. See Cue Library."
            aria-label="Play / Pause — Playback disabled: no audio loaded"
          >
            <Play size={15} aria-hidden="true" fill="currentColor" />
          </button>

          <button
            type="button"
            className={styles.transportBtn}
            onClick={handleSkipForward}
            disabled={!canSkipForward}
            title={
              canSkipForward
                ? `Skip forward to ${passageIds[currentPassageIndex + 1]}`
                : 'At end of route sequence'
            }
            aria-label="Skip forward"
          >
            <SkipForward size={13} aria-hidden="true" />
          </button>

          {/* Interactive Route Audition Simulation Button */}
          <button
            type="button"
            className={[styles.transportBtn, isPlayingSimulation ? styles.playBtnActive : ''].join(' ')}
            onClick={() => {
              const nextState = !isPlayingSimulation;
              setIsPlayingSimulation(nextState);
              if (nextState) {
                playAuditionTone(440, 0.2);
              }
            }}
            title={isPlayingSimulation ? 'Pause route audition traversal' : 'Audition route timeline traversal with Web Audio synthesis'}
            aria-label={isPlayingSimulation ? 'Pause route traversal' : 'Audition route traversal'}
            style={{ width: 'auto', padding: '0 10px', borderRadius: 'var(--bt-radius-full)', gap: '6px' }}
          >
            {isPlayingSimulation ? <Pause size={12} aria-hidden="true" /> : <Radio size={12} aria-hidden="true" />}
            <span style={{ fontSize: '11px', fontWeight: 600 }}>
              {isPlayingSimulation ? 'Pause Traversal' : 'Audition Route'}
            </span>
          </button>
        </div>

        {/* Time display */}
        <div
          className={styles.timeDisplay}
          title="Reference design-fixture values until real decoded audio is loaded"
        >
          <span className={styles.timeCurrent}>
            {isPlayingSimulation || playheadPercent !== 30.88 ? displayCurrentTime : '01:24'}
          </span>
          <span className={styles.timeSep}>/</span>
          <span className={styles.timeTotal}>04:32</span>
          <span className="demo-badge" style={{ fontSize: '9px', padding: '1px 4px' }}>
            Demo Data
          </span>
        </div>

        {/* Route sequence display */}
        <div className={styles.routeSequence}>
          <span className={styles.routeBadge}>{route ? route.name : 'Route B'}</span>
          <span className={styles.sequenceFlow}>
            {passageIds.map((pId, idx) => {
              const p = getPassage(pId);
              const isSelected = pId === selectedPassageId;
              const isAirVent = pId === 'P-003';
              return (
                <span key={pId}>
                  <span
                    className={
                      isAirVent
                        ? styles.sequenceAirVent
                        : isSelected
                        ? styles.sequenceHighlight
                        : ''
                    }
                  >
                    {p ? p.title : pId}
                  </span>
                  {idx < passageIds.length - 1 && ' → '}
                </span>
              );
            })}
          </span>
        </div>

        {/* Volume & tools */}
        <div className={styles.volumeControls}>
          <Volume2 size={14} aria-hidden="true" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className={styles.volumeSlider}
            aria-label="Master volume"
            title={`Audition Volume: ${volume.toString()}%`}
          />
          <span title="Waveform monitor">
            <Activity size={14} aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* ── Track Area ──────────────────────────────────────────────── */}
      <div className={styles.trackArea}>
        {/* Left lane labels */}
        <div className={styles.laneLabels}>
          <div className={styles.laneLabelSpacer} />
          <div className={styles.laneLabel}>Music</div>
          <div className={styles.laneLabel}>Ambience</div>
          <div className={styles.laneLabel}>SFX</div>
        </div>

        {/* Right timeline tracks container */}
        <div
          className={styles.trackContainer}
          onClick={handleTrackClick}
          role="region"
          aria-label="Scrubbable timeline tracks"
          title="Click anywhere to scrub playhead position"
        >
          {/* Time ruler */}
          <div className={styles.timeRuler} aria-hidden="true">
            <span>00:00</span>
            <span>00:30</span>
            <span>01:00</span>
            <span>01:30</span>
            <span>02:00</span>
            <span>02:30</span>
            <span>03:00</span>
            <span>03:30</span>
            <span>04:00</span>
            <span>04:32</span>
          </div>

          {/* Passage segment markers row */}
          <div className={styles.passageSegments}>
            {passageIds.map((pId) => {
              const p = getPassage(pId);
              const width = segmentWidths[pId] ?? 25;
              const isAirVent = pId === 'P-003';
              const isSelected = pId === selectedPassageId;

              return (
                <div
                  key={pId}
                  className={[
                    styles.passageSegment,
                    isAirVent ? styles.segmentIssue : styles.segmentNormal,
                    isSelected ? styles.segmentSelected : '',
                  ].join(' ')}
                  style={{ width: `${width.toString()}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToPassage(pId);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      jumpToPassage(pId);
                    }
                  }}
                  title={`Passage ${p ? p.title : pId} (${pId}) — click to select and scrub`}
                >
                  {p ? p.title : pId}
                </div>
              );
            })}
          </div>

          {/* Lane 1: MUSIC */}
          <div className={`${styles.laneRow} ${styles.laneMusic}`}>
            <span className={styles.demoWaveformBadge}>Demo Waveform</span>
            <svg className={styles.waveformSvg} viewBox="0 0 1000 38" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0,19 Q50,9 100,19 T200,19 T280,12 T380,26 T480,14 T580,24 T700,10 T850,22 T1000,19"
                fill="none"
                stroke="var(--bt-accent)"
                strokeWidth="1.5"
                strokeOpacity="0.75"
              />
              <path
                d="M0,19 Q60,14 120,19 T240,19 T280,16 T400,22 T520,16 T640,21 T760,14 T880,20 T1000,19"
                fill="none"
                stroke="var(--bt-accent-soft)"
                strokeWidth="1"
                strokeOpacity="0.35"
              />
            </svg>

            {/* Red Diamond Cue Marker at Air Vent boundary on Route B (28%) */}
            {currentRouteId === 'route_b' && (
              <div
                className={styles.cueMarkerWrap}
                style={{ left: `${cueMarkerPercent.toString()}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  playCueTriggerSound(true);
                  onSelectCueMarker?.();
                }}
                title="Cue: traitor_theme.wav triggers at Air Vent entry (~01:10 estimated demo position · timing unavailable without measured media)"
                aria-label="Cue trigger: traitor_theme.wav at Air Vent entry (~01:10 estimated demo position) — finding BT-001"
                role="button"
                tabIndex={0}
              >
                <div className={styles.cueMarkerDiamond} />
              </div>
            )}
          </div>

          {/* Lane 2: AMBIENCE */}
          <div className={styles.laneRow}>
            <svg className={styles.waveformSvg} viewBox="0 0 1000 38" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0,19 Q40,16 80,19 T160,19 T240,18 T320,20 T400,18 T500,21 T600,18 T750,20 T900,18 T1000,19"
                fill="none"
                stroke="rgba(176, 198, 193, 0.4)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Lane 3: SFX */}
          <div className={styles.laneRow}>
            <svg className={styles.waveformSvg} viewBox="0 0 1000 38" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0,19 L200,19 L210,14 L220,24 L230,19 L600,19 L610,15 L620,23 L630,19 L1000,19"
                fill="none"
                stroke="rgba(176, 198, 193, 0.3)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Dynamic Playhead */}
          <div
            className={styles.playheadLine}
            style={{ left: `${playheadPercent.toString()}%` }}
            aria-hidden="true"
          >
            <div className={styles.playheadThumb} />
          </div>
        </div>
      </div>
    </div>
  );
});
