import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Maximize2,
  Sparkles,
  Layers,
  Activity,
  FileCheck,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useWorkspaceStore } from '../../stores/workspace';
import { playAuditionTone, playCueTriggerSound } from '../../services/synth';
import { BackendControlModal } from '../../components/BackendControlModal';
import { StoryImportModal } from '../../components/StoryImportModal';
import styles from './MasterStudioShowcase.module.css';

export function MasterStudioShowcase() {
  const navigate = useNavigate();
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');

  const {
    selectedRouteId,
    selectedPassageId: _selectedPassageId,
    setSelectedRoute,
    setSelectedPassage,
    navigateToFinding,
  } = useWorkspaceStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCueId, setActiveCueId] = useState('traitor_theme.wav');
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Sound audition handler for transport
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const isRouteB = selectedRouteId === 'route_b';
      playAuditionTone(isRouteB ? 440 : 329.63, 2.0);
      playCueTriggerSound(isRouteB);
      setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
    }
  };

  const isRouteB = selectedRouteId === 'route_b';

  return (
    <div className={styles.showcaseWrap}>
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <header className={styles.topHeader}>
        <div className={styles.brandGroup}>
          <div className={styles.logoWaveform}>
            <div className={styles.waveformBar} style={{ height: '14px' }} />
            <div className={styles.waveformBar} style={{ height: '24px' }} />
            <div className={styles.waveformBar} style={{ height: '18px' }} />
            <div className={styles.waveformBar} style={{ height: '26px' }} />
            <div className={styles.waveformBar} style={{ height: '12px' }} />
          </div>
          <div className={styles.brandTitles}>
            <div className={styles.brandTitle}>
              <span>BranchTone</span>
            </div>
            <div className={styles.brandSubtitle}>Narrative Audio QA & Regression Testing Studio</div>
          </div>
        </div>

        <div className={styles.centerTagline}>
          Sound design you can <span className={styles.taglineHighlight}>test</span>, not just hear.
        </div>

        <div className={styles.headerRightPills}>
          <div className={styles.studioPill}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>7 Powerful Workspaces. One Intelligent Studio.</span>
          </div>

          <div className={styles.viewModeToggle}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${styles.toggleBtnActive}`}
              title="7-Workspace Master Studio Showcase"
            >
              ⊞ Studio Grid
            </button>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => navigate('/story-graph')}
              title="Focus single workspace"
            >
              🗖 Focused View
            </button>
          </div>
        </div>
      </header>

      {/* ── 7-Workspace Bento Grid ────────────────────────────────────────── */}
      <main className={styles.bentoGrid}>
        {/* ── 1. Project Overview ─────────────────────────────────────────── */}
        <section className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleLeft}>
              <div className={styles.badgeNum}>1</div>
              <div>
                <span className={styles.cardTitle}>Project Overview</span>
                <span className={styles.cardSubtitle}>Your project at a glance</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.cardExpandBtn}
              onClick={() => navigate('/overview')}
              title="Open Project Overview full workspace"
            >
              <span>Full View</span>
              <ExternalLink size={11} />
            </button>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.overviewLayout}>
              {/* Mini sidebar inside Card 1 */}
              <div className={styles.miniSidebar}>
                <div className={styles.miniSidebarBrand}>
                  <Sparkles size={11} />
                  <span>BranchTone</span>
                </div>
                <div style={{ color: '#EDF3F0', fontSize: '9px', fontWeight: 600 }}>The Last Signal</div>
                <div className={styles.miniNavList}>
                  <div className={`${styles.miniNavItem} ${styles.miniNavItemActive}`}>● Overview</div>
                  <div className={styles.miniNavItem} onClick={() => navigate('/story-graph')}>Story Graph</div>
                  <div className={styles.miniNavItem} onClick={() => navigate('/narrative-map')}>Narrative Map</div>
                  <div className={styles.miniNavItem} onClick={() => navigate('/cue-library')}>Cue Library</div>
                  <div className={styles.miniNavItem} onClick={() => navigate('/route-lab')}>Route Lab</div>
                  <div className={styles.miniNavItem} onClick={() => navigate('/validation-centre')}>Validation</div>
                  <div className={styles.miniNavItem} onClick={() => navigate('/reports')}>Reports</div>
                </div>
                <div className={styles.miniSidebarReady}>● Ready v0.4.0</div>
              </div>

              {/* Main Area inside Card 1 */}
              <div className={styles.overviewMain}>
                {/* Hero banner */}
                <div className={styles.lighthouseBanner}>
                  <div className={styles.lighthouseMeta}>
                    <div className={styles.storyTitle}>The Last Signal</div>
                    <div className={styles.storyTag}>Interactive Detective Story · v0.4</div>
                    <div className={styles.bannerBtns}>
                      <button
                        type="button"
                        className={styles.miniBtnOutline}
                        onClick={() => setIsImportModalOpen(true)}
                      >
                        Import Story
                      </button>
                      <button
                        type="button"
                        className={styles.miniBtnEmerald}
                        onClick={() => setIsBackendModalOpen(true)}
                      >
                        Run Validation
                      </button>
                    </div>
                  </div>

                  {/* Lighthouse Artistic SVG */}
                  <svg className={styles.lighthouseArtSvg} viewBox="0 0 100 70" fill="none">
                    <rect width="100" height="70" fill="#0A1316" rx="6" />
                    <path d="M 0,55 Q 35,45 70,58 T 100,62 L 100,70 L 0,70 Z" fill="#0F1F24" />
                    {/* Lighthouse tower */}
                    <polygon points="75,20 83,20 86,55 72,55" fill="#1C3036" />
                    <rect x="76" y="16" width="6" height="4" fill="#10B981" opacity="0.9" />
                    <circle cx="79" cy="18" r="1.5" fill="#FFFFFF" />
                    {/* Sweeping light beam */}
                    <polygon points="79,18 0,0 0,40" fill="url(#beamGrad)" opacity="0.35" />
                    {/* Moon */}
                    <circle cx="25" cy="20" r="7" fill="#10B981" opacity="0.15" />
                    <defs>
                      <linearGradient id="beamGrad" x1="1" y1="0.5" x2="0" y2="0.5">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* 4 Stat Tiles */}
                <div className={styles.statPillsRow}>
                  <div className={styles.statPill}>
                    <span className={styles.statPillNum}>5</span>
                    <span className={styles.statPillLabel}>Passages</span>
                  </div>
                  <div className={styles.statPill}>
                    <span className={styles.statPillNum}>2</span>
                    <span className={styles.statPillLabel}>Routes</span>
                  </div>
                  <div className={`${styles.statPill} ${styles.statPillAlert}`}>
                    <span className={`${styles.statPillNum} ${styles.statPillNumAlert}`}>1</span>
                    <span className={styles.statPillLabel}>Open Finding</span>
                  </div>
                  <div className={styles.statPill}>
                    <span className={styles.statPillNum} style={{ color: '#10B981' }}>100%</span>
                    <span className={styles.statPillLabel}>Coverage</span>
                  </div>
                </div>

                {/* Bottom Row: Health + Activity */}
                <div className={styles.overviewBottomRow}>
                  <div className={styles.healthMiniBox}>
                    <svg className={styles.radialGauge} viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="#1A282B" strokeWidth="4" />
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="4"
                        strokeDasharray="113.1"
                        strokeDashoffset="9.0"
                        strokeLinecap="round"
                        transform="rotate(-90 22 22)"
                      />
                      <text x="22" y="26" textAnchor="middle" fill="#EDF3F0" fontSize="11" fontWeight="700">
                        92%
                      </text>
                    </svg>
                    <div>
                      <div style={{ fontSize: '9px', color: '#87958F' }}>Project Health</div>
                      <svg width="60" height="16" viewBox="0 0 60 16">
                        <path d="M 0,12 L 12,10 L 24,14 L 36,6 L 48,8 L 60,3" fill="none" stroke="#10B981" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  <div className={styles.activityList}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#10B981' }}>●</span> Validation completed · 2m ago
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#F04F75' }}>●</span> Cue 'traitor_theme.wav' added · 5m
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#F59E0B' }}>●</span> Passage 'Air Vent' edited · 8m
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Story Graph ──────────────────────────────────────────────── */}
        <section className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleLeft}>
              <div className={styles.badgeNum}>2</div>
              <div>
                <span className={styles.cardTitle}>Story Graph</span>
                <span className={styles.cardSubtitle}>Visualise your narrative structure</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.cardExpandBtn}
              onClick={() => navigate('/story-graph')}
              title="Open Story Graph full workspace"
            >
              <span>Full View</span>
              <ExternalLink size={11} />
            </button>
          </div>

          <div className={styles.cardBody}>
            {/* Top Toolbar */}
            <div className={styles.graphToolbar}>
              <div className={styles.routeToggle}>
                <button
                  type="button"
                  className={`${styles.routePillBtn} ${!isRouteB ? styles.routePillBtnActive : ''}`}
                  onClick={() => {
                    setSelectedRoute('route_a');
                    playAuditionTone(329.63, 0.1);
                  }}
                >
                  Route A
                </button>
                <button
                  type="button"
                  className={`${styles.routePillBtn} ${isRouteB ? styles.routePillBtnActive : ''}`}
                  onClick={() => {
                    setSelectedRoute('route_b');
                    playAuditionTone(440, 0.1);
                  }}
                >
                  Route B
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#87958F' }}>
                <span style={{ fontFamily: 'monospace' }}>100%</span>
                <Maximize2 size={12} style={{ cursor: 'pointer' }} onClick={() => navigate('/story-graph')} />
              </div>
            </div>

            {/* Interactive Graph Canvas */}
            <div className={styles.graphArea}>
              <svg className={styles.graphSvgLayer} viewBox="0 0 350 155">
                {/* Route A Path: Lobby(50,75) -> Archives(135,38) -> ServerVault(225,75) -> SafeHouse(305,75) */}
                <path
                  d="M 68,75 C 95,75 105,38 135,38 C 165,38 195,75 225,75"
                  fill="none"
                  stroke={!isRouteB ? '#10B981' : 'rgba(16, 185, 129, 0.3)'}
                  strokeWidth={!isRouteB ? '2.5' : '1.5'}
                  strokeDasharray={!isRouteB ? undefined : '4 3'}
                />

                {/* Route B Path: Lobby(50,75) -> AirVent(135,115) -> ServerVault(225,75) -> SafeHouse(305,75) */}
                {/* The Lobby->Air Vent transition triggers defect BT-001 (Red indicator) */}
                <path
                  d="M 68,75 C 95,75 105,115 135,115"
                  fill="none"
                  stroke={isRouteB ? '#F04F75' : 'rgba(240, 79, 117, 0.35)'}
                  strokeWidth={isRouteB ? '2.5' : '1.5'}
                />
                <path
                  d="M 175,115 C 200,115 205,75 225,75"
                  fill="none"
                  stroke={isRouteB ? '#10B981' : 'rgba(16, 185, 129, 0.3)'}
                  strokeWidth={isRouteB ? '2.5' : '1.5'}
                />
                {/* ServerVault -> SafeHouse */}
                <path
                  d="M 265,75 L 290,75"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                />
              </svg>

              {/* Node 1: Lobby */}
              <div
                className={styles.nodeCard}
                style={{ left: '10px', top: '56px' }}
                onClick={() => {
                  setSelectedPassage('P-001');
                  playAuditionTone(329.63, 0.08);
                }}
              >
                <div className={styles.nodeThumbBox}>
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <rect width="22" height="22" fill="#132225" />
                    <line x1="11" y1="2" x2="11" y2="20" stroke="#10B981" strokeWidth="1" />
                    <rect x="5" y="8" width="12" height="10" fill="#1C383D" />
                  </svg>
                </div>
                <div>
                  <div>Lobby</div>
                  <div style={{ fontSize: '8px', color: '#10B981' }}>● Valid</div>
                </div>
              </div>

              {/* Node 2: Archives (Upper Branch) */}
              <div
                className={styles.nodeCard}
                style={{ left: '120px', top: '18px' }}
                onClick={() => {
                  setSelectedPassage('P-002');
                  playAuditionTone(392.0, 0.08);
                }}
              >
                <div className={styles.nodeThumbBox}>
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <rect width="22" height="22" fill="#18241D" />
                    <rect x="4" y="5" width="14" height="4" fill="#D9A65D" />
                    <rect x="4" y="11" width="14" height="4" fill="#D9A65D" />
                  </svg>
                </div>
                <div>
                  <div>Archives</div>
                  <div style={{ fontSize: '8px', color: '#10B981' }}>● Valid</div>
                </div>
              </div>

              {/* Node 3: Air Vent (Lower Branch - Issue!) */}
              <div
                className={`${styles.nodeCard} ${styles.nodeCardIssue}`}
                style={{ left: '120px', top: '96px' }}
                onClick={() => {
                  setSelectedPassage('P-003');
                  navigateToFinding({
                    findingId: 'fnd_bt001_route_b_p003_demo',
                    routeId: 'route_b',
                    passageId: 'P-003',
                  });
                  playAuditionTone(220, 0.15);
                }}
              >
                <div className={styles.nodeThumbBox} style={{ background: '#261117' }}>
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <rect width="22" height="22" fill="#241016" />
                    <line x1="3" y1="5" x2="19" y2="5" stroke="#F04F75" strokeWidth="1.5" />
                    <line x1="3" y1="11" x2="19" y2="11" stroke="#F04F75" strokeWidth="1.5" />
                    <line x1="3" y1="17" x2="19" y2="17" stroke="#F04F75" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: '#F04F75' }}>Air Vent</div>
                  <div style={{ fontSize: '8px', color: '#F04F75' }}>● 1 Issue</div>
                </div>
              </div>

              {/* Node 4: Server Vault */}
              <div
                className={styles.nodeCard}
                style={{ left: '215px', top: '56px' }}
                onClick={() => {
                  setSelectedPassage('P-004');
                  playAuditionTone(523.25, 0.08);
                }}
              >
                <div className={styles.nodeThumbBox}>
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <rect width="22" height="22" fill="#0E1B26" />
                    <rect x="4" y="4" width="14" height="6" fill="#0EA5E9" opacity="0.8" />
                    <rect x="4" y="12" width="14" height="6" fill="#0EA5E9" opacity="0.8" />
                  </svg>
                </div>
                <div>
                  <div>Server Vault</div>
                  <div style={{ fontSize: '8px', color: '#10B981' }}>● Valid</div>
                </div>
              </div>

              {/* Node 5: Safe House */}
              <div
                className={styles.nodeCard}
                style={{ left: '285px', top: '56px' }}
                onClick={() => {
                  setSelectedPassage('P-005');
                  playAuditionTone(659.25, 0.08);
                }}
              >
                <div className={styles.nodeThumbBox}>
                  <svg width="22" height="22" viewBox="0 0 22 22">
                    <rect width="22" height="22" fill="#1E281C" />
                    <polygon points="11,3 3,11 19,11" fill="#10B981" opacity="0.8" />
                    <rect x="6" y="11" width="10" height="8" fill="#10B981" opacity="0.6" />
                  </svg>
                </div>
                <div>
                  <div>Safe House</div>
                  <div style={{ fontSize: '8px', color: '#10B981' }}>● Valid</div>
                </div>
              </div>
            </div>

            {/* Legend & Audio Transport Scrubber */}
            <div className={styles.legendBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className={styles.legendDot} style={{ background: '#10B981' }} />
                <span>Valid</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div className={styles.legendDot} style={{ background: '#F04F75' }} />
                <span>Issue</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: '#10B981' }}>---</span>
                <span>Route path</span>
              </div>
            </div>

            <div className={styles.transportBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className={styles.transportPlayBtn}
                  onClick={handleTogglePlay}
                  title="Audition Route Traversal Audio"
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>01:24 / 04:32</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.14)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 700 }}>
                  Route B
                </span>
                <Volume2 size={13} color="#87958F" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Narrative Map ────────────────────────────────────────────── */}
        <section className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleLeft}>
              <div className={styles.badgeNum}>3</div>
              <div>
                <span className={styles.cardTitle}>Narrative Map</span>
                <span className={styles.cardSubtitle}>Track story progression</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.cardExpandBtn}
              onClick={() => navigate('/narrative-map')}
              title="Open Narrative Map full workspace"
            >
              <span>Full View</span>
              <ExternalLink size={11} />
            </button>
          </div>

          <div className={styles.cardBody}>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px' }}>
              <div className={styles.routeToggle}>
                <button
                  type="button"
                  className={`${styles.routePillBtn} ${styles.routePillBtnActive}`}
                >
                  Route A
                </button>
                <span style={{ color: '#87958F', padding: '3px 6px' }}>Timeline ▾</span>
              </div>
              <span style={{ color: '#87958F' }}>View Options ▾</span>
            </div>

            {/* Chronological Trajectory Chart */}
            <svg className={styles.timelineTracksSvg} viewBox="0 0 320 160">
              {/* Lane labels */}
              <text x="8" y="24" fill="#87958F" fontSize="8.5">Story Beats</text>
              <text x="8" y="52" fill="#87958F" fontSize="8.5">Characters</text>
              <text x="8" y="80" fill="#87958F" fontSize="8.5">Reveals</text>
              <text x="8" y="108" fill="#87958F" fontSize="8.5">Conflicts</text>
              <text x="8" y="136" fill="#87958F" fontSize="8.5">Mood</text>

              {/* Time grid lines */}
              <line x1="70" y1="10" x2="70" y2="145" stroke="#1A282B" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="130" y1="10" x2="130" y2="145" stroke="#1A282B" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="190" y1="10" x2="190" y2="145" stroke="#1A282B" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="250" y1="10" x2="250" y2="145" stroke="#1A282B" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Time labels */}
              <text x="65" y="155" fill="#586661" fontSize="7.5">00:00</text>
              <text x="125" y="155" fill="#586661" fontSize="7.5">00:30</text>
              <text x="185" y="155" fill="#586661" fontSize="7.5">01:00</text>
              <text x="245" y="155" fill="#586661" fontSize="7.5">01:30</text>

              {/* Story Beats trajectory (Cyan) */}
              <path d="M 70,22 Q 130,18 190,24 T 300,20" fill="none" stroke="#0EA5E9" strokeWidth="1.5" />
              <circle cx="70" cy="22" r="3" fill="#0EA5E9" />
              <circle cx="190" cy="24" r="3" fill="#0EA5E9" />

              {/* Characters trajectory (Purple) */}
              <path d="M 70,50 Q 140,58 200,48 T 300,52" fill="none" stroke="#A855F7" strokeWidth="1.5" />
              <circle cx="200" cy="48" r="3" fill="#A855F7" />

              {/* Reveals trajectory (Amber) with callout */}
              <path d="M 70,78 Q 150,85 210,65 T 300,78" fill="none" stroke="#F59E0B" strokeWidth="2" />
              <circle cx="210" cy="65" r="4.5" fill="#F59E0B" />
              {/* Callout box */}
              <rect x="175" y="44" width="70" height="15" rx="3" fill="#1C180E" stroke="#F59E0B" strokeWidth="1" />
              <text x="210" y="55" fill="#FDE68A" fontSize="7.5" fontWeight="700" textAnchor="middle">
                Identity Reveal
              </text>

              {/* Conflicts trajectory (Red) */}
              <path d="M 70,106 Q 160,115 220,95 T 300,106" fill="none" stroke="#F04F75" strokeWidth="1.5" />
              <circle cx="220" cy="95" r="3" fill="#F04F75" />

              {/* Mood wave (Emerald) */}
              <path d="M 70,138 C 110,125 150,145 200,130 C 240,118 270,140 300,132" fill="none" stroke="#10B981" strokeWidth="2" />
              <circle cx="200" cy="130" r="3" fill="#10B981" />
            </svg>

            {/* Event Details Card */}
            <div className={styles.eventDetailsBox}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={styles.eventTitle}>Identity Reveal</span>
                <span style={{ fontSize: '9px', color: '#10B981' }}>Passage: Archives</span>
              </div>
              <div style={{ color: '#AAB8B3', fontSize: '9.5px' }}>
                Route: A · Time: 01:12 · Character: Protagonist
              </div>
              <div style={{ fontStyle: 'italic', color: '#EDF3F0', marginTop: '2px' }}>
                "The protagonist learns the truth."
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Cue Library ──────────────────────────────────────────────── */}
        <section className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleLeft}>
              <div className={styles.badgeNum}>4</div>
              <div>
                <span className={styles.cardTitle}>Cue Library</span>
                <span className={styles.cardSubtitle}>Manage your audio assets</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.cardExpandBtn}
              onClick={() => navigate('/cue-library')}
              title="Open Cue Library full workspace"
            >
              <span>Full View</span>
              <ExternalLink size={11} />
            </button>
          </div>

          <div className={styles.cardBody}>
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <input
                type="text"
                placeholder="🔍 Search cues..."
                style={{
                  background: 'rgba(11, 16, 17, 0.85)',
                  border: '1px solid rgba(176, 198, 193, 0.16)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '10px',
                  color: '#EDF3F0',
                  flex: 1,
                  outline: 'none',
                }}
              />
              <button
                type="button"
                className={styles.miniBtnEmerald}
                onClick={() => navigate('/cue-library')}
              >
                + Import Audio
              </button>
            </div>

            {/* Cues Table */}
            <div className={styles.cueTableWrap}>
              <table className={styles.cueTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{ background: activeCueId === 'traitor_theme.wav' ? 'rgba(16, 185, 129, 0.12)' : undefined, cursor: 'pointer' }}
                    onClick={() => {
                      setActiveCueId('traitor_theme.wav');
                      playAuditionTone(440, 0.15);
                    }}
                  >
                    <td style={{ fontWeight: 600, color: '#10B981' }}>traitor_theme.wav</td>
                    <td>Music</td>
                    <td style={{ fontFamily: 'monospace' }}>00:32</td>
                    <td><span className={styles.okBadge}>● OK</span></td>
                  </tr>
                  <tr
                    style={{ background: activeCueId === 'ambient_cafe.wav' ? 'rgba(16, 185, 129, 0.12)' : undefined, cursor: 'pointer' }}
                    onClick={() => {
                      setActiveCueId('ambient_cafe.wav');
                      playAuditionTone(280, 0.15);
                    }}
                  >
                    <td>ambient_cafe.wav</td>
                    <td>Ambience</td>
                    <td style={{ fontFamily: 'monospace' }}>01:12</td>
                    <td><span className={styles.okBadge}>● OK</span></td>
                  </tr>
                  <tr>
                    <td>door_slam.wav</td>
                    <td>SFX</td>
                    <td style={{ fontFamily: 'monospace' }}>00:03</td>
                    <td><span className={styles.okBadge}>● OK</span></td>
                  </tr>
                  <tr>
                    <td>alarm.wav</td>
                    <td>SFX</td>
                    <td style={{ fontFamily: 'monospace' }}>00:05</td>
                    <td><span className={styles.okBadge}>● OK</span></td>
                  </tr>
                  <tr>
                    <td>footsteps.wav</td>
                    <td>SFX</td>
                    <td style={{ fontFamily: 'monospace' }}>00:08</td>
                    <td><span className={styles.okBadge}>● OK</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cue Preview Player */}
            <div className={styles.cuePlayerBox}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px' }}>
                <span style={{ fontWeight: 600, color: '#EDF3F0' }}>{activeCueId}</span>
                <span style={{ fontFamily: 'monospace', color: '#10B981' }}>0:00 / 0:32</span>
              </div>

              {/* Decoded Waveform SVG */}
              <svg className={styles.waveformWaveSvg} viewBox="0 0 280 38">
                <rect width="280" height="38" fill="#090E10" rx="4" />
                {Array.from({ length: 48 }).map((_, i) => {
                  const h = 6 + Math.sin(i * 0.4) * 12 + ((i * 7) % 11);
                  const y = (38 - h) / 2;
                  return (
                    <rect
                      key={`wf-bar-${id}-${i}`}
                      x={6 + i * 5.6}
                      y={y}
                      width="2.6"
                      height={h}
                      fill={i < 18 ? '#10B981' : 'rgba(16, 185, 129, 0.35)'}
                      rx="1"
                    />
                  );
                })}
              </svg>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', fontSize: '9px', color: '#87958F' }}>
                <div>Type: <strong style={{ color: '#EDF3F0' }}>Music</strong></div>
                <div>Format: <strong style={{ color: '#EDF3F0' }}>WAV</strong></div>
                <div>Loudness: <strong style={{ color: '#10B981' }}>-14.2 LUFS</strong></div>
                <div>Peak: <strong style={{ color: '#EDF3F0' }}>-1.0 dB</strong></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Route Lab ────────────────────────────────────────────────── */}
        <section className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleLeft}>
              <div className={styles.badgeNum}>5</div>
              <div>
                <span className={styles.cardTitle}>Route Lab</span>
                <span className={styles.cardSubtitle}>Simulate and test routes</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.cardExpandBtn}
              onClick={() => navigate('/route-lab')}
              title="Open Route Lab full workspace"
            >
              <span>Full View</span>
              <ExternalLink size={11} />
            </button>
          </div>

          <div className={styles.cardBody}>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Route B ▾
                </span>
              </div>
              <button
                type="button"
                className={styles.miniBtnEmerald}
                onClick={() => {
                  playAuditionTone(587.33, 0.15);
                  navigate('/route-lab');
                }}
              >
                ▷ Simulate
              </button>
            </div>

            {/* Route Sequence SVG */}
            <svg className={styles.routeSequenceSvg} viewBox="0 0 320 52">
              <line x1="30" y1="26" x2="290" y2="26" stroke="rgba(16, 185, 129, 0.35)" strokeWidth="2" />
              {/* Lobby */}
              <circle cx="35" cy="26" r="9" fill="#10B981" />
              <polyline points="32,26 34,28 38,23" fill="none" stroke="#04100B" strokeWidth="1.5" />
              <text x="35" y="44" fill="#EDF3F0" fontSize="8" textAnchor="middle">Lobby</text>

              {/* Archives */}
              <circle cx="95" cy="26" r="9" fill="#10B981" />
              <polyline points="92,26 94,28 98,23" fill="none" stroke="#04100B" strokeWidth="1.5" />
              <text x="95" y="44" fill="#EDF3F0" fontSize="8" textAnchor="middle">Archives</text>

              {/* Air Vent - Defect! */}
              <circle cx="160" cy="26" r="11" fill="#F04F75" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x="160" y="30" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle">!</text>
              <text x="160" y="44" fill="#F04F75" fontSize="8" fontWeight="700" textAnchor="middle">Air Vent</text>

              {/* Server Vault */}
              <circle cx="225" cy="26" r="9" fill="#10B981" />
              <polyline points="222,26 224,28 228,23" fill="none" stroke="#04100B" strokeWidth="1.5" />
              <text x="225" y="44" fill="#EDF3F0" fontSize="8" textAnchor="middle">Server Vault</text>

              {/* Safe House */}
              <circle cx="285" cy="26" r="9" fill="#10B981" />
              <polyline points="282,26 284,28 288,23" fill="none" stroke="#04100B" strokeWidth="1.5" />
              <text x="285" y="44" fill="#EDF3F0" fontSize="8" textAnchor="middle">Safe House</text>
            </svg>

            {/* Split Details: Current Passage vs Live State */}
            <div className={styles.routeLabSplit}>
              <div className={styles.passageSnapshotCard}>
                <div style={{ color: '#87958F', fontSize: '9px' }}>Current Passage</div>
                <div style={{ fontWeight: 700, color: '#EDF3F0', fontSize: '11px' }}>Air Vent · P-003</div>
                <div className={styles.issuePill}>Issue Detected</div>
              </div>

              <div className={styles.passageSnapshotCard}>
                <div style={{ color: '#87958F', fontSize: '9px' }}>Live State</div>
                <div>Mood: <strong style={{ color: '#EDF3F0' }}>Suspense</strong></div>
                <div>Intensity: <strong style={{ color: '#F59E0B' }}>4/5</strong> · Revealed: <strong style={{ color: '#F04F75' }}>No</strong></div>
              </div>
            </div>

            {/* Bottom Transport Scrubber */}
            <div className={styles.transportBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  className={styles.transportPlayBtn}
                  onClick={handleTogglePlay}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <span style={{ fontFamily: 'monospace' }}>01:24 / 04:32</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="31"
                style={{ width: '80px', accentColor: '#10B981' }}
              />
            </div>
          </div>
        </section>

        {/* ── 6. Validation Centre ────────────────────────────────────────── */}
        <section className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleLeft}>
              <div className={styles.badgeNum}>6</div>
              <div>
                <span className={styles.cardTitle}>Validation Centre</span>
                <span className={styles.cardSubtitle}>Find and fix issues</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.cardExpandBtn}
              onClick={() => navigate('/validation-centre')}
              title="Open Validation Centre full workspace"
            >
              <span>Full View</span>
              <ExternalLink size={11} />
            </button>
          </div>

          <div className={styles.cardBody}>
            {/* Top Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
              <button
                type="button"
                className={styles.miniBtnEmerald}
                onClick={() => setIsBackendModalOpen(true)}
              >
                ▷ Run Validation
              </button>
              <div style={{ display: 'flex', gap: '4px', fontSize: '9px' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 5px', borderRadius: '3px', fontWeight: 600 }}>All (12)</span>
                <span style={{ background: 'rgba(240, 79, 117, 0.2)', color: '#F04F75', padding: '2px 5px', borderRadius: '3px', fontWeight: 700 }}>High (1)</span>
                <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '2px 5px', borderRadius: '3px' }}>Med (3)</span>
                <span style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0EA5E9', padding: '2px 5px', borderRadius: '3px' }}>Low (8)</span>
              </div>
            </div>

            {/* Findings Table */}
            <div className={styles.validationTableWrap}>
              <table className={styles.findingsTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rule</th>
                    <th>Severity</th>
                    <th>Passage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{ background: 'rgba(240, 79, 117, 0.15)', cursor: 'pointer' }}
                    onClick={() => {
                      navigateToFinding({
                        findingId: 'fnd_bt001_route_b_p003_demo',
                        routeId: 'route_b',
                        passageId: 'P-003',
                      });
                      playAuditionTone(220, 0.15);
                    }}
                  >
                    <td style={{ color: '#F04F75', fontWeight: 700, fontFamily: 'monospace' }}>BT-001</td>
                    <td style={{ color: '#EDF3F0' }}>Reveal Protection</td>
                    <td><span style={{ color: '#F04F75', fontWeight: 700 }}>● High</span></td>
                    <td>Air Vent</td>
                    <td><span style={{ background: 'rgba(240, 79, 117, 0.2)', color: '#F04F75', padding: '1px 4px', borderRadius: '3px', fontSize: '8.5px', fontWeight: 700 }}>Open</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: '#F59E0B', fontWeight: 600, fontFamily: 'monospace' }}>BT-002</td>
                    <td>Missing Media Asset</td>
                    <td><span style={{ color: '#F59E0B' }}>● Medium</span></td>
                    <td>Safe House</td>
                    <td><span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: '1px 4px', borderRadius: '3px', fontSize: '8.5px' }}>Open</span></td>
                  </tr>
                  <tr>
                    <td style={{ color: '#0EA5E9', fontWeight: 600, fontFamily: 'monospace' }}>BT-003</td>
                    <td>Loudness Jump</td>
                    <td><span style={{ color: '#0EA5E9' }}>● Low</span></td>
                    <td>Server Vault</td>
                    <td><span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '1px 4px', borderRadius: '3px', fontSize: '8.5px' }}>Resolved</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Finding Detail Card */}
            <div className={styles.findingDetailCard}>
              <div className={styles.findingDetailTitle}>
                <AlertTriangle size={12} />
                <span>BT-001 — Reveal Protection</span>
              </div>
              <div style={{ color: '#EDF3F0', lineHeight: 1.4 }}>
                The traitor theme starts before the character's identity is established on this route.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ color: '#87958F', fontSize: '9px' }}>Affected: Air Vent · Route B</span>
                <button
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#F04F75',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    navigateToFinding({
                      findingId: 'fnd_bt001_route_b_p003_demo',
                      routeId: 'route_b',
                      passageId: 'P-003',
                    });
                    navigate('/story-graph');
                  }}
                >
                  <span>View in Graph</span>
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Reports (Full Width) ─────────────────────────────────────── */}
        <section className={`${styles.bentoCard} ${styles.reportsFullCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleLeft}>
              <div className={styles.badgeNum}>7</div>
              <div>
                <span className={styles.cardTitle}>Reports</span>
                <span className={styles.cardSubtitle}>Analyse and export results</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '4px', fontSize: '10px' }}>
                <span style={{ background: 'rgba(176, 198, 193, 0.08)', color: '#EDF3F0', padding: '3px 8px', borderRadius: '4px' }}>Last 5 Runs ▾</span>
                <span style={{ background: 'rgba(176, 198, 193, 0.08)', color: '#EDF3F0', padding: '3px 8px', borderRadius: '4px' }}>Nov 1 - Nov 30 ▾</span>
              </div>
              <button
                type="button"
                className={styles.miniBtnEmerald}
                onClick={() => navigate('/reports')}
              >
                Export Report
              </button>
              <button
                type="button"
                className={styles.cardExpandBtn}
                onClick={() => navigate('/reports')}
                title="Open Reports full workspace"
              >
                <span>Full View</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.reportsGrid}>
              {/* 1. Quality Overview */}
              <div className={styles.reportWidget}>
                <div className={styles.widgetTitle}>Project Quality Overview</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#1A282B" strokeWidth="5" />
                    <circle
                      cx="30"
                      cy="30"
                      r="24"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="5"
                      strokeDasharray="150.8"
                      strokeDashoffset="9.0"
                      strokeLinecap="round"
                      transform="rotate(-90 30 30)"
                    />
                    <text x="30" y="34" textAnchor="middle" fill="#EDF3F0" fontSize="14" fontWeight="800">
                      94%
                    </text>
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px' }}>
                    <div><span style={{ color: '#10B981' }}>✓</span> Routes Tested: <strong>2/2</strong></div>
                    <div><span style={{ color: '#10B981' }}>✓</span> Passages: <strong>5/5</strong></div>
                    <div><span style={{ color: '#10B981' }}>✓</span> Audio Assets: <strong>12/12</strong></div>
                    <div><span style={{ color: '#F04F75' }}>●</span> Open Findings: <strong style={{ color: '#F04F75' }}>1</strong></div>
                  </div>
                </div>
              </div>

              {/* 2. Findings by Severity */}
              <div className={styles.reportWidget}>
                <div className={styles.widgetTitle}>Findings by Severity</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="54" height="54" viewBox="0 0 54 54">
                    <circle cx="27" cy="27" r="18" fill="none" stroke="#261017" strokeWidth="8" />
                    <circle
                      cx="27"
                      cy="27"
                      r="18"
                      fill="none"
                      stroke="#F04F75"
                      strokeWidth="8"
                      strokeDasharray="113.1"
                      strokeDashoffset="85"
                      transform="rotate(-90 27 27)"
                    />
                    <circle
                      cx="27"
                      cy="27"
                      r="18"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="8"
                      strokeDasharray="113.1"
                      strokeDashoffset="95"
                      transform="rotate(30 27 27)"
                    />
                  </svg>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px' }}>
                    <div><span style={{ color: '#F04F75' }}>●</span> High: <strong>1</strong></div>
                    <div><span style={{ color: '#F59E0B' }}>●</span> Medium: <strong>3</strong></div>
                    <div><span style={{ color: '#0EA5E9' }}>●</span> Low: <strong>8</strong></div>
                  </div>
                </div>
              </div>

              {/* 3. Audio Health Progress */}
              <div className={styles.reportWidget}>
                <div className={styles.widgetTitle}>Audio Health</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className={styles.progressMeterRow}>
                    <div className={styles.meterLabelRow}>
                      <span>Loudness</span>
                      <strong style={{ color: '#10B981' }}>-14.2 LUFS</strong>
                    </div>
                    <div className={styles.meterTrack}>
                      <div className={styles.meterFill} style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className={styles.progressMeterRow}>
                    <div className={styles.meterLabelRow}>
                      <span>Clipping</span>
                      <strong style={{ color: '#10B981' }}>0.2%</strong>
                    </div>
                    <div className={styles.meterTrack}>
                      <div className={styles.meterFill} style={{ width: '4%' }} />
                    </div>
                  </div>

                  <div className={styles.progressMeterRow}>
                    <div className={styles.meterLabelRow}>
                      <span>Loops</span>
                      <strong style={{ color: '#10B981' }}>100%</strong>
                    </div>
                    <div className={styles.meterTrack}>
                      <div className={styles.meterFill} style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Validation History Chart */}
              <div className={styles.reportWidget}>
                <div className={styles.widgetTitle}>Validation History</div>
                <svg width="100%" height="45" viewBox="0 0 160 45">
                  <path
                    d="M 15,35 L 50,30 L 95,20 L 145,8"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  <circle cx="15" cy="35" r="3" fill="#10B981" />
                  <circle cx="50" cy="30" r="3" fill="#10B981" />
                  <circle cx="95" cy="20" r="3" fill="#10B981" />
                  <circle cx="145" cy="8" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
                  <text x="15" y="44" fill="#87958F" fontSize="8" textAnchor="middle">v0.1</text>
                  <text x="50" y="44" fill="#87958F" fontSize="8" textAnchor="middle">v0.2</text>
                  <text x="95" y="44" fill="#87958F" fontSize="8" textAnchor="middle">v0.3</text>
                  <text x="145" y="44" fill="#10B981" fontSize="8" fontWeight="700" textAnchor="middle">v0.4</text>
                </svg>
              </div>

              {/* 5. Overall Health Status */}
              <div className={styles.reportWidget} style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <CheckCircle2 size={24} color="#10B981" />
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>Excellent</div>
                <div style={{ fontSize: '9.5px', color: '#87958F' }}>1 issue requires attention</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Global Bottom Footer ────────────────────────────────────────── */}
      <footer className={styles.bottomFooter}>
        <div className={styles.featurePills}>
          <div className={styles.featurePill} onClick={() => navigate('/story-graph')}>
            <Layers size={13} color="#10B981" />
            <span>Story Analysis</span>
          </div>
          <div className={styles.featurePill} onClick={() => navigate('/cue-library')}>
            <Volume2 size={13} color="#0EA5E9" />
            <span>Audio QA</span>
          </div>
          <div className={styles.featurePill} onClick={() => navigate('/route-lab')}>
            <Compass size={13} color="#F59E0B" />
            <span>Route Exploration</span>
          </div>
          <div className={styles.featurePill} onClick={() => navigate('/overview')}>
            <Sparkles size={13} color="#A855F7" />
            <span>AI Copilot</span>
          </div>
          <div className={styles.featurePill} onClick={() => navigate('/reports')}>
            <FileCheck size={13} color="#10B981" />
            <span>Professional Reporting</span>
          </div>
        </div>

        <div className={styles.footerBrandRight}>
          <Activity size={13} />
          <span>Built for Creators. Powered by Intelligence.</span>
        </div>
      </footer>

      {/* Modals */}
      <BackendControlModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />

      <StoryImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
}
