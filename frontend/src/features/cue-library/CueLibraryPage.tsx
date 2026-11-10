import { useState } from 'react';
import {
  Music,
  Sliders,
  AlertTriangle,
  Play,
  VolumeX,
  ShieldAlert,
} from 'lucide-react';
import {
  getAllAudioCues,
  getAudioAssets,
} from '../../services/fixtures';
import styles from './CueLibraryPage.module.css';

type LayerFilter = 'all' | 'music' | 'ambience' | 'sfx' | 'voice';

export function CueLibraryPage() {
  const [selectedLayer, setSelectedLayer] = useState<LayerFilter>('all');
  const cues = getAllAudioCues();
  const assets = getAudioAssets();

  const filteredCues = selectedLayer === 'all'
    ? cues
    : cues.filter((c) => c.layer === selectedLayer);

  const activeCue = cues[0];
  const activeAsset = assets.find((a) => a.asset_id === activeCue.asset_id);

  return (
    <div className={styles.cueLibrary} role="region" aria-label="Audio Cue Library">
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
            1 Configured Cue · 1 Missing Media Asset
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
                {filteredCues.map((cue) => {
                  const asset = assets.find((a) => a.asset_id === cue.asset_id);
                  const isMissing = asset?.status === 'missing';

                  return (
                    <tr key={cue.cue_id}>
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
                })}
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
            <span className="demo-badge">P-003 Entry</span>
          </div>

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
              <span className={styles.propValue}>Passage Entry (P-003 · Air Vent)</span>
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

          {/* Disabled Audio Playback Transport */}
          <div className={styles.transportRow}>
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
            <span style={{ fontSize: '11px', color: 'var(--bt-text-muted)' }}>
              Upload audio asset to enable audition
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
