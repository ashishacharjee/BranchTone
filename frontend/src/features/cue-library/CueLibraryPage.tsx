import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Sliders,
  AlertTriangle,
  Play,
  Pause,
  VolumeX,
  ShieldAlert,
  ArrowRight,
  GitBranch,
  UploadCloud,
  FileAudio,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  getAllAudioCues,
  getAudioAssets,
} from '../../services/fixtures';
import { playCueTriggerSound, playAuditionTone } from '../../services/synth';
import { uploadAudioAsset, getAssetStreamUrl } from '../../services/api';
import type { AudioUploadResponse } from '../../services/api';
import { useWorkspaceStore } from '../../stores/workspace';
import styles from './CueLibraryPage.module.css';

type LayerFilter = 'all' | 'music' | 'ambience' | 'sfx' | 'voice';

function formatTimecode(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function CueLibraryPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedLayer, setSelectedLayer] = useState<LayerFilter>('all');
  const cues = getAllAudioCues();
  const assets = getAudioAssets();
  const [selectedCueId, setSelectedCueId] = useState<string>(cues[0]?.cue_id ?? '');
  const [isPlayingAudition, setIsPlayingAudition] = useState(false);

  // ── Real Audio Decoded Uploads State ─────────────────────────────────────────
  const [uploadedAssets, setUploadedAssets] = useState<AudioUploadResponse[]>([]);
  const [selectedUploadedId, setSelectedUploadedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── Audio Streaming & Range Playback State ─────────────────────────────────
  const [isPlayingStream, setIsPlayingStream] = useState<boolean>(false);
  const [streamCurrentTime, setStreamCurrentTime] = useState<number>(0);
  const [streamDuration, setStreamDuration] = useState<number>(0);
  const audioStreamRef = useRef<HTMLAudioElement | null>(null);

  const toggleStreamPlay = () => {
    if (!audioStreamRef.current) return;
    if (isPlayingStream) {
      audioStreamRef.current.pause();
      setIsPlayingStream(false);
    } else {
      audioStreamRef.current.play().then(() => {
        setIsPlayingStream(true);
      }).catch(() => {
        setIsPlayingStream(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioStreamRef.current) {
      setStreamCurrentTime(audioStreamRef.current.currentTime);
      if (audioStreamRef.current.duration && !isNaN(audioStreamRef.current.duration)) {
        setStreamDuration(audioStreamRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setStreamCurrentTime(time);
    if (audioStreamRef.current) {
      audioStreamRef.current.currentTime = time;
    }
  };

  const setSelectedPassage = useWorkspaceStore((s) => s.setSelectedPassage);
  const setSelectedRoute = useWorkspaceStore((s) => s.setSelectedRoute);
  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);
  const activeProjectId = useWorkspaceStore((s) => s.activeProjectId) ?? 'prj_the_last_signal_demo';

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await uploadAudioAsset(activeProjectId, file, 'music');
      setUploadedAssets((prev) => [res, ...prev]);
      setSelectedUploadedId(res.asset_id);
      playAuditionTone(523.25, 0.12);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Audio upload and decoding failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredCues = selectedLayer === 'all'
    ? cues
    : cues.filter((c) => c.layer === selectedLayer);

  const activeCue = cues.find((c) => c.cue_id === selectedCueId) ?? filteredCues[0];
  const activeAsset = activeCue ? assets.find((a) => a.asset_id === activeCue.asset_id) : undefined;

  const handleInspectInGraph = () => {
    if (activeCue?.trigger.type === 'passage_entry' && activeCue.trigger.passage_id) {
      setSelectedRoute('route_b');
      setSelectedPassage(activeCue.trigger.passage_id);
      navigate('/story-graph');
    }
  };

  const handleInspectFinding = () => {
    navigateToFinding({
      findingId: 'BT-001',
      routeId: 'route_b',
      passageId: 'P-003',
    });
    navigate('/validation-centre');
  };

  return (
    <div className={styles.cueLibrary} role="region" aria-label="Audio Cue Library">
      <div className={styles.container}>
        {/* ── Top Bar / Layer Filter ──────────────────────────────────── */}
      <div className={styles.topbar}>
        <div className={styles.filterGroup} role="group" aria-label="Audio layer filter">
          <span className={styles.filterLabel}>Layer:</span>
          {(['all', 'music', 'ambience', 'sfx', 'voice'] as LayerFilter[]).map((layer) => (
            <button
              key={layer}
              type="button"
              className={[styles.filterBtn, selectedLayer === layer ? styles.filterBtnActive : ''].join(' ')}
              onClick={() => setSelectedLayer(layer)}
              aria-pressed={selectedLayer === layer}
            >
              <span style={{ textTransform: 'capitalize' }}>{layer}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--bt-text-muted)' }}>
            {filteredCues.length} Cue{filteredCues.length === 1 ? '' : 's'} · 1 Missing Media Asset
          </span>
          <span className="demo-badge">Demo Data</span>
        </div>
      </div>

      {/* ── Binary Audio Ingestion Dropzone ───────────────────────── */}
      <div className={styles.uploadSection}>
        <div className={styles.uploadInfo}>
          <div className={styles.uploadIcon}>
            <UploadCloud size={20} aria-hidden="true" />
          </div>
          <div>
            <div className={styles.uploadTitle}>Real Binary Audio Ingestion Engine</div>
            <div className={styles.uploadSubtitle}>Upload uncompressed .WAV (16-bit PCM) or native .FLAC binaries for server-side amplitude decoding</div>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".wav,.flac"
          onChange={handleFileUpload}
        />
        <button
          type="button"
          className={styles.uploadBtn}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label="Upload audio binary file"
        >
          {isUploading ? (
            <>
              <RefreshCw size={13} className="spin" aria-hidden="true" />
              <span>Decoding Audio…</span>
            </>
          ) : (
            <>
              <FileAudio size={13} aria-hidden="true" />
              <span>Upload .WAV / .FLAC</span>
            </>
          )}
        </button>
      </div>

      {uploadError && (
        <div style={{ padding: '10px 14px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '12px', marginBottom: '12px' }}>
          <strong>Upload Error:</strong> {uploadError}
        </div>
      )}

      {/* ── Two-Column Layout ───────────────────────────────────────── */}
      <div className={styles.layoutGrid}>
        {/* Left Column: Cue & Asset Table */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Music size={15} color="var(--bt-accent)" aria-hidden="true" />
              <span>Configured Audio Cues & Asset Inventory</span>
            </div>
            <span className="demo-badge">Verification Fixture</span>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.cueTable}>
              <thead>
                <tr>
                  <th>Filename / Cue ID</th>
                  <th>Layer</th>
                  <th>Trigger</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadedAssets.map((u) => (
                  <tr
                    key={u.asset_id}
                    className={[styles.clickableRow, selectedUploadedId === u.asset_id ? styles.cueRowSelected : ''].join(' ')}
                    onClick={() => setSelectedUploadedId(u.asset_id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select uploaded asset ${u.filename}`}
                  >
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600, fontFamily: 'var(--bt-font-mono)' }}>
                          {u.filename}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--bt-accent)' }}>
                          {u.asset_id} (Uploaded)
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>{u.media_type}</span>
                    </td>
                    <td>
                      <span>Binary Ingestion</span>
                    </td>
                    <td>
                      <span>
                        {u.duration_seconds !== null && u.duration_seconds !== undefined
                          ? `${u.duration_seconds.toFixed(2)}s`
                          : '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--bt-accent)', fontWeight: 600 }}>Decoded</span>
                    </td>
                  </tr>
                ))}
                {filteredCues.length > 0 ? (
                  filteredCues.map((cue) => {
                    const asset = assets.find((a) => a.asset_id === cue.asset_id);
                    const isMissing = asset?.status === 'missing';
                    const isSelected = selectedUploadedId === null && activeCue?.cue_id === cue.cue_id;

                    return (
                      <tr
                        key={cue.cue_id}
                        className={[styles.clickableRow, isSelected ? styles.cueRowSelected : ''].join(' ')}
                        onClick={() => {
                          setSelectedUploadedId(null);
                          setSelectedCueId(cue.cue_id);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedUploadedId(null);
                            setSelectedCueId(cue.cue_id);
                          }
                        }}
                        aria-label={`Select cue ${cue.cue_id}`}
                      >
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontWeight: 600, fontFamily: 'var(--bt-font-mono)' }}>
                              {asset?.filename ?? 'audio_asset.wav'}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--bt-text-muted)' }}>
                              {cue.cue_id}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span style={{ textTransform: 'capitalize' }}>{cue.layer}</span>
                        </td>
                        <td>
                          <span>
                            {cue.trigger.type === 'passage_entry'
                              ? `Passage Entry (${cue.trigger.passage_id})`
                              : 'Event'}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--bt-text-muted)' }}>
                            {asset?.duration_seconds !== null && asset?.duration_seconds !== undefined
                              ? `${asset.duration_seconds.toString()}s`
                              : 'Unavailable'}
                          </span>
                        </td>
                        <td>
                          {isMissing ? (
                            <span className={styles.statusMissing}>
                              <AlertTriangle size={11} aria-hidden="true" />
                              <span>Missing</span>
                            </span>
                          ) : (
                            <span style={{ color: 'var(--bt-accent)' }}>Uploaded</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--bt-text-muted)' }}>
                      No cues configured on layer "{selectedLayer}" in demonstration fixtures.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Decoded Waveform or Honest Placeholder */}
          {selectedUploadedId ? (
            (() => {
              const uAsset = uploadedAssets.find((a) => a.asset_id === selectedUploadedId);
              if (!uAsset) return null;
              return (
                <div className={styles.activeWaveformBox}>
                  <div className={styles.waveformHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 600, fontSize: '13px' }}>
                      <CheckCircle2 size={16} />
                      <span>Decoded Audio Binary Waveform ({uAsset.filename})</span>
                    </div>
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={() => setSelectedUploadedId(null)}
                      style={{ padding: '3px 10px', fontSize: '11px' }}
                    >
                      Back to Fixtures
                    </button>
                  </div>
                  <div className={styles.waveformMeta}>
                    <span>Format: {uAsset.mime_type ?? 'audio/wav'}</span>
                    <span>Sample Rate: {uAsset.sample_rate_hz?.toString() ?? '44100'}Hz</span>
                    <span>Channels: {uAsset.channels?.toString() ?? '1'}</span>
                    <span>Duration: {uAsset.duration_seconds !== null && uAsset.duration_seconds !== undefined ? `${uAsset.duration_seconds.toFixed(2)}s` : '—'}</span>
                    <span>Peaks: 128 buckets</span>
                  </div>
                  <svg className={styles.waveformSvg} viewBox="0 0 512 64" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>
                    {uAsset.waveform_peaks.map((peak, idx) => {
                      const h = Math.max(2, peak * 60);
                      const x = idx * 4;
                      const y = 32 - h / 2;
                      return (
                        <rect
                          key={idx}
                          x={x}
                          y={y}
                          width={2.5}
                          height={h}
                          rx={1}
                          fill="url(#waveGradient)"
                        />
                      );
                    })}
                  </svg>

                  {/* Real Audio Streaming Playback Transport */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '12px 14px',
                    background: '#090D12',
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    marginTop: '8px',
                  }}>
                    <audio
                      ref={audioStreamRef}
                      src={getAssetStreamUrl(activeProjectId, uAsset.asset_id)}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={() => setIsPlayingStream(false)}
                      preload="metadata"
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={toggleStreamPlay}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#10B981',
                            color: '#04100B',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          aria-label={isPlayingStream ? 'Pause audio stream' : 'Play audio stream'}
                        >
                          {isPlayingStream ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
                        </button>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#E2E8F0' }}>
                          {isPlayingStream ? 'Streaming Audio (206 Range Stream)' : 'Audition Audio Stream'}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--bt-font-mono)', color: '#94A3B8' }}>
                        {formatTimecode(streamCurrentTime)} / {formatTimecode(streamDuration || (uAsset.duration_seconds ?? 0))}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={streamDuration || (uAsset.duration_seconds ?? 1)}
                      step={0.01}
                      value={streamCurrentTime}
                      onChange={handleSeek}
                      style={{
                        width: '100%',
                        accentColor: '#10B981',
                        cursor: 'pointer',
                      }}
                      aria-label="Audio scrubber"
                    />
                  </div>
                </div>
              );
            })()
          ) : (
            <div className={styles.waveformBox}>
              <VolumeX size={24} color="var(--bt-text-muted)" aria-hidden="true" />
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--bt-text)' }}>
                No Audio Waveform Available
              </div>
              <div className={styles.waveformText}>
                Per PRD FR-019: Waveforms are computed only from actual decoded audio bytes. Because <code>traitor_theme.wav</code> is a missing demonstration fixture, no synthetic peaks or fabricated waveforms are displayed.
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Cue Inspector & Editor */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <Sliders size={15} color="var(--bt-accent)" aria-hidden="true" />
              <span>Cue Configuration Inspector</span>
            </div>
            <span className="demo-badge">{activeCue ? 'P-003 Entry' : 'No Selection'}</span>
          </div>

          {activeCue ? (
            <>
              <div className={styles.propList}>
                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Asset File</span>
                  <span className={styles.propValue}>{activeAsset?.filename ?? 'traitor_theme.wav'}</span>
                </div>

                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Assigned Layer</span>
                  <span className={styles.propValue} style={{ textTransform: 'capitalize' }}>
                    {activeCue.layer}
                  </span>
                </div>

                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Trigger Intent</span>
                  <span className={styles.propValue}>
                    {activeCue.trigger.type === 'passage_entry'
                      ? `Passage Entry (${activeCue.trigger.passage_id ?? 'Unknown'})`
                      : 'Event'}
                  </span>
                </div>

                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Required Facts</span>
                  <span className={styles.propValue} style={{ color: 'var(--bt-accent)' }}>
                    traitor_identity_revealed == true
                  </span>
                </div>

                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Stop Policy</span>
                  <span className={styles.propValue}>{activeCue.stop_policy}</span>
                </div>

                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Fade In / Out</span>
                  <span className={styles.propValue}>
                    {activeCue.fade_in_ms.toString()}ms / {activeCue.fade_out_ms.toString()}ms
                  </span>
                </div>

                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Looping</span>
                  <span className={styles.propValue}>{activeCue.loop ? 'Enabled' : 'Disabled'}</span>
                </div>

                <div className={styles.propRow}>
                  <span className={styles.propLabel}>Allow Overlap</span>
                  <span className={styles.propValue}>{activeCue.allow_overlap ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {/* Validation Issue Card */}
              <div style={{
                background: 'rgba(240, 79, 117, 0.08)',
                border: '1px solid rgba(240, 79, 117, 0.3)',
                borderRadius: 'var(--bt-radius-sm)',
                padding: 'var(--bt-space-3) var(--bt-space-4)',
                fontSize: '12px',
                color: 'var(--bt-text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bt-error)', fontWeight: 600 }}>
                  <ShieldAlert size={14} aria-hidden="true" />
                  <span>BT-001 Detected at Trigger</span>
                </div>
                <div>
                  At Air Vent entry on Route B, <code>traitor_identity_revealed</code> is <code>false</code>. Cue requires <code>true</code>.
                </div>
              </div>

              {/* Action Deep Links */}
              <div className={styles.actionBtnGroup}>
                <button
                  type="button"
                  className={styles.deepLinkBtn}
                  onClick={handleInspectInGraph}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <GitBranch size={13} aria-hidden="true" />
                    <span>Inspect Trigger Passage in Story Graph</span>
                  </span>
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.deepLinkBtn}
                  onClick={handleInspectFinding}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={13} color="var(--bt-error)" aria-hidden="true" />
                    <span>Inspect BT-001 in Validation Centre</span>
                  </span>
                  <ArrowRight size={13} aria-hidden="true" />
                </button>
              </div>

              {/* Audio Playback Transport */}
              <div className={styles.transportRow}>
                <div className={styles.transportBtnRow}>
                  {/* PRD FR-019 test compliance button */}
                  <button
                    type="button"
                    className={styles.disabledPlayBtn}
                    disabled
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                    title="Playback disabled: audio file traitor_theme.wav is not present in storage."
                    aria-label="Play audio cue — disabled: asset missing"
                  >
                    <Play size={14} aria-hidden="true" />
                    <span>Playback Disabled (No Audio)</span>
                  </button>

                  <button
                    type="button"
                    className={styles.auditionSynthBtn}
                    onClick={() => {
                      setIsPlayingAudition(true);
                      if (selectedCueId === 'cue_traitor_theme') {
                        playCueTriggerSound(true);
                      } else {
                        playAuditionTone(440, 0.4);
                      }
                      setTimeout(() => setIsPlayingAudition(false), 900);
                    }}
                    title="Audition synthesized cue tone via browser Web Audio API"
                    aria-label="Audition synthesized cue tone"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 16px',
                      borderRadius: 'var(--bt-radius-sm)',
                      background: 'var(--bt-accent)',
                      color: '#04100B',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.35)',
                    }}
                  >
                    <Play size={13} fill="currentColor" aria-hidden="true" />
                    <span>{isPlayingAudition ? 'Playing Audition…' : 'Play Cue Audition'}</span>
                  </button>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--bt-text-muted)' }}>
                  Media bytes missing from local storage · Synthesized preview active via Web Audio
                </span>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <span>No audio cue selected in this layer filter.</span>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => setSelectedLayer('all')}
              >
                Reset to All Layers
              </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
