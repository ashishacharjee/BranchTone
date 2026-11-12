import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music,
  Sliders,
  AlertTriangle,
  Play,
  VolumeX,
  Volume2,
  ShieldAlert,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import {
  getAllAudioCues,
  getAudioAssets,
} from '../../services/fixtures';
import { playCueTriggerSound } from '../../services/synth';
import { useWorkspaceStore } from '../../stores/workspace';
import styles from './CueLibraryPage.module.css';

type LayerFilter = 'all' | 'music' | 'ambience' | 'sfx' | 'voice';

export function CueLibraryPage() {
  const navigate = useNavigate();
  const [selectedLayer, setSelectedLayer] = useState<LayerFilter>('all');
  const cues = getAllAudioCues();
  const assets = getAudioAssets();
  const [selectedCueId, setSelectedCueId] = useState<string>(cues[0]?.cue_id ?? '');
  const [isPlayingAudition, setIsPlayingAudition] = useState(false);

  const setSelectedPassage = useWorkspaceStore((s) => s.setSelectedPassage);
  const setSelectedRoute = useWorkspaceStore((s) => s.setSelectedRoute);
  const navigateToFinding = useWorkspaceStore((s) => s.navigateToFinding);

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
                {filteredCues.length > 0 ? (
                  filteredCues.map((cue) => {
                    const asset = assets.find((a) => a.asset_id === cue.asset_id);
                    const isMissing = asset?.status === 'missing';
                    const isSelected = activeCue?.cue_id === cue.cue_id;

                    return (
                      <tr
                        key={cue.cue_id}
                        className={[styles.clickableRow, isSelected ? styles.cueRowSelected : ''].join(' ')}
                        onClick={() => setSelectedCueId(cue.cue_id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
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

          {/* Honest Waveform Preview Placeholder */}
          <div className={styles.waveformBox}>
            <VolumeX size={24} color="var(--bt-text-muted)" aria-hidden="true" />
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--bt-text)' }}>
              No Audio Waveform Available
            </div>
            <div className={styles.waveformText}>
              Per PRD FR-019: Waveforms are computed only from actual decoded audio bytes. Because <code>traitor_theme.wav</code> is a missing demonstration fixture, no synthetic peaks or fabricated waveforms are displayed.
            </div>
          </div>
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
                  <button
                    type="button"
                    className={styles.disabledPlayBtn}
                    disabled
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
                      playCueTriggerSound(true);
                      setTimeout(() => setIsPlayingAudition(false), 900);
                    }}
                    title="Audition synthesized cue tone via browser Web Audio API"
                    aria-label="Audition synthesized cue tone"
                  >
                    <Volume2 size={13} aria-hidden="true" />
                    <span>{isPlayingAudition ? 'Auditioning Cue…' : 'Audition Synth Preview'}</span>
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
