import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FileCode,
  X,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  GitBranch,
} from 'lucide-react';
import { importStory } from '../services/api';
import type { CanonicalStoryIRResponse } from '../services/api';
import { useWorkspaceStore } from '../stores/workspace';
import styles from './StoryImportModal.module.css';

interface StoryImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_STORIES = [
  {
    id: 'twee_demo',
    label: 'Twee / Harlowe (The Last Signal)',
    filename: 'the_last_signal.twee',
    text: `:: P-001 Lobby [entry]
Atrium entrance.
[[Search Archives->P-002 Archives]]
[[Climb Vent->P-003 Air Vent]]

:: P-002 Archives [stealth]
(set: $conspirator_revealed to true)
Found the traitor file.
[[Access Vault->P-004 Server Vault]]

:: P-003 Air Vent [suspense]
Crawl through the metal duct.
[[Drop into Vault->P-004 Server Vault]]

:: P-004 Server Vault [climax]
Data terminal.
[[Escape->P-005 Safe House]]

:: P-005 Safe House [resolution]
Mission success.`,
  },
  {
    id: 'ink_demo',
    label: 'Ink Engine (Conspiracy Infiltration)',
    filename: 'conspiracy_infiltration.ink',
    text: `VAR conspirator_revealed = false

=== Lobby ===
Sen steps into the rain-soaked atrium.
* [Search Archives] -> Archives
* [Climb Vent] -> Air_Vent

=== Archives ===
~ conspirator_revealed = true
Sen finds the traitor dossier in the locked filing cabinet.
-> Server_Vault

=== Air_Vent ===
Sen crawls through the humming air ducts.
-> Server_Vault

=== Server_Vault ===
The main server room is filled with cold blue lights.
-> Safe_House

=== Safe_House ===
Mission accomplished.
-> END`,
  },
];

export function StoryImportModal({ isOpen, onClose }: StoryImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('twee_demo');
  const [filename, setFilename] = useState<string>(PRESET_STORIES[0].filename);
  const [sourceText, setSourceText] = useState<string>(PRESET_STORIES[0].text);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [result, setResult] = useState<CanonicalStoryIRResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeProjectId = useWorkspaceStore((s) => s.activeProjectId) ?? 'prj_the_last_signal_demo';
  const setLoadedStoryIR = useWorkspaceStore((s) => s.setLoadedStoryIR);

  if (!isOpen) return null;

  const handleLoadIntoCanvas = () => {
    if (!result) return;
    setLoadedStoryIR(result);
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_STORIES[0]) => {
    setSelectedPresetId(preset.id);
    setFilename(preset.filename);
    setSourceText(preset.text);
    setResult(null);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilename(file.name);
    setSelectedPresetId('custom');
    const reader = new FileReader();
    reader.onload = (event) => {
      setSourceText((event.target?.result as string) ?? '');
      setResult(null);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setError(null);
    try {
      const res = await importStory(activeProjectId, {
        source_text: sourceText,
        filename,
        version_label: 'v1.0-imported',
      });
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Compilation failed');
    } finally {
      setIsCompiling(false);
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <FileCode size={18} color="var(--bt-accent)" aria-hidden="true" />
            <span>Dynamic Narrative AST Parser & Story Compiler</span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.presetBar}>
            <span className={styles.presetLabel}>Select Story Source or Sample</span>
            <div className={styles.presetBtns}>
              {PRESET_STORIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={[
                    styles.presetBtn,
                    selectedPresetId === p.id ? styles.presetBtnActive : '',
                  ].join(' ')}
                  onClick={() => handleSelectPreset(p)}
                >
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                className={[
                  styles.presetBtn,
                  selectedPresetId === 'custom' ? styles.presetBtnActive : '',
                ].join(' ')}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={13} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                Upload .twee / .ink
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".twee,.tw,.ink,.txt"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={styles.presetLabel}>Source Code ({filename})</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Supports Harlowe 3.x subset & Inkle Ink syntax
              </span>
            </div>
            <textarea
              className={styles.textArea}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              spellCheck={false}
              aria-label="Story source text"
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.compileBtn}
              onClick={handleCompile}
              disabled={isCompiling || !sourceText.trim()}
              aria-label="Compile story"
            >
              {isCompiling ? (
                <>
                  <RefreshCw size={14} className="spin" aria-hidden="true" />
                  <span>Compiling AST…</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} aria-hidden="true" />
                  <span>Compile & Ingest Story IR</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', color: '#DC2626', fontSize: '12px' }}>
              <strong>Compilation Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className={styles.resultBox}>
              <div className={styles.resultTitle}>
                <CheckCircle2 size={16} />
                <span>Compilation Successful — Canonical Story IR Emitted</span>
              </div>

              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Passages Parsed</span>
                  <span className={styles.metricValue}>{result.passages.length}</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>Directed Edges</span>
                  <span className={styles.metricValue}>{result.edges.length}</span>
                </div>
                <div className={styles.metricCard}>
                  <span className={styles.metricLabel}>State Mutations</span>
                  <span className={styles.metricValue}>{result.mutations.length}</span>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#166534', fontFamily: 'var(--bt-font-mono)' }}>
                Format: {result.story_version.story_format} · SHA-256: {result.story_version.source_sha256.slice(0, 16)}…
              </div>

              {result.story_version.story_format === 'ink_subset' && (
                <div style={{
                  background: '#FEF3C7',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  color: '#92400E',
                }}>
                  <strong>Inkle Ink Core Structural Subset:</strong> Knots, stitches, global VARs, diverts (<code>-&gt;</code>), choices (<code>*</code>), and mutations (<code>~</code>) compiled. Advanced multi-branch gathers are flagged as sequential prose.
                </div>
              )}

              <button
                type="button"
                className={styles.loadCanvasBtn}
                onClick={handleLoadIntoCanvas}
                aria-label="Load Into Story Graph Canvas"
              >
                <GitBranch size={15} aria-hidden="true" />
                <span>Load Into Story Graph Canvas</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
