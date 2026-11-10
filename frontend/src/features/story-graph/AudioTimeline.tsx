import { memo } from 'react';
import { Play, SkipBack, SkipForward, Volume2, Activity } from 'lucide-react';
import { getRoute, getPassage } from '../../services/fixtures';
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

  // Calculate passage segment widths (in percentage) along the timeline
  // Total design fixture duration = 272s (04:32). Air Vent entry boundary is at ~84s (01:24 / ~30.8%).
  const segmentWidths: Record<string, number> = currentRouteId === 'route_b'
    ? {
        'P-001': 28, // Lobby: 0 to ~76s
        'P-003': 22, // Air Vent: ~76s to ~136s
        'P-004': 26, // Server Vault: ~136s to ~206s
        'P-005': 24, // Safe House: ~206s to 272s
      }
    : {
        'P-001': 28,
        'P-002': 22,
        'P-004': 26,
        'P-005': 24,
      };

  // Playhead at 84s / 272s ≈ 30.88%
  const playheadPercent = 30.88;

  // Air Vent entry boundary on Route B is at the boundary of P-001 -> P-003, exactly 28%
  const cueMarkerPercent = 28;

  return (
    <div className={styles.timeline} role="region" aria-label="Audio timeline and transport">
      {/* ── Transport Bar ───────────────────────────────────────────── */}
      <div className={styles.transportBar}>
        <div className={styles.playbackButtons} role="group" aria-label="Audio playback controls">
          <button
            type="button"
            className={styles.transportBtn}
            disabled
            title="Skip backward — disabled: no audio loaded"
            aria-label="Skip backward"
          >
            <SkipBack size={13} aria-hidden="true" />
          </button>
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
            disabled
            title="Skip forward — disabled: no audio loaded"
            aria-label="Skip forward"
          >
            <SkipForward size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Time display — design fixture values */}
        <div
          className={styles.timeDisplay}
          title="Reference design-fixture values only until actual audio is imported (PRD FR-019)"
        >
          <span className={styles.timeCurrent}>01:24</span>
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
            defaultValue="70"
            className={styles.volumeSlider}
            disabled
            aria-label="Master volume"
            title="Volume slider (disabled in demo mode)"
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
        <div className={styles.trackContainer}>
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
                  onClick={() => onSelectPassage?.(pId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPassage?.(pId);
                    }
                  }}
                  title={`Passage ${p ? p.title : pId} (${pId})`}
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

            {/* Red Diamond Cue Marker at Air Vent boundary on Route B (aligned precisely at boundary, 28% / ~01:10 estimated demo position) */}
            {currentRouteId === 'route_b' && (
              <div
                className={styles.cueMarkerWrap}
                style={{ left: `${cueMarkerPercent.toString()}%` }}
                onClick={(e) => {
                  e.stopPropagation();
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
            <span className={styles.demoWaveformBadge}>Demo Waveform</span>
            <svg className={styles.waveformSvg} viewBox="0 0 1000 38" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M0,19 Q70,12 140,19 T280,19 T420,15 T560,23 T700,13 T840,21 T1000,19"
                fill="none"
                stroke="var(--bt-text-muted)"
                strokeWidth="1.2"
                strokeOpacity="0.4"
              />
            </svg>
          </div>

          {/* Lane 3: SFX */}
          <div className={styles.laneRow}>
            <span className={styles.demoWaveformBadge}>Demo SFX</span>
            <svg className={styles.waveformSvg} viewBox="0 0 1000 38" preserveAspectRatio="none" aria-hidden="true">
              {/* Discrete SFX trigger bursts */}
              <circle cx="280" cy="19" r="3" fill="var(--bt-text-muted)" opacity="0.6" />
              <line x1="280" y1="10" x2="280" y2="28" stroke="var(--bt-text-muted)" strokeWidth="1.5" opacity="0.6" />

              <circle cx="560" cy="19" r="3" fill="var(--bt-text-muted)" opacity="0.6" />
              <line x1="560" y1="11" x2="560" y2="27" stroke="var(--bt-text-muted)" strokeWidth="1.5" opacity="0.6" />

              <circle cx="820" cy="19" r="3" fill="var(--bt-text-muted)" opacity="0.6" />
              <line x1="820" y1="8" x2="820" y2="30" stroke="var(--bt-text-muted)" strokeWidth="1.5" opacity="0.6" />
            </svg>
          </div>

          {/* Vertical Playhead at 01:24 */}
          <div
            className={styles.playheadLine}
            style={{ left: `${playheadPercent.toString()}%` }}
            title="Playhead: 01:24 (design fixture value)"
          >
            <div className={styles.playheadThumb} />
          </div>
        </div>
      </div>
    </div>
  );
});
