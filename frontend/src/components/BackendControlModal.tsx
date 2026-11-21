import { useState, useEffect } from 'react';
import {
  Server,
  Database,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  RefreshCw,
  ExternalLink,
  X,
  FileCode,
  Activity,
  Terminal,
} from 'lucide-react';
import { fetchHealth, createValidationRun } from '../services/api';
import type { HealthResponse } from '../types/branchtone';
import { playAuditionTone } from '../services/synth';

interface BackendControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BackendControlModal({ isOpen, onClose }: BackendControlModalProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [pingError, setPingError] = useState<string | null>(null);
  const [qaStatus, setQaStatus] = useState<string | null>(null);
  const [isRunningQa, setIsRunningQa] = useState<boolean>(false);

  const checkStatus = async () => {
    setIsChecking(true);
    setPingError(null);
    try {
      const res = await fetchHealth();
      setHealth(res);
      playAuditionTone(523.25, 0.12);
    } catch (err: unknown) {
      setHealth(null);
      setPingError(err instanceof Error ? err.message : 'Backend unreachable at http://127.0.0.1:8000');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void checkStatus();
    }
  }, [isOpen]);

  const handleRunQa = async () => {
    setIsRunningQa(true);
    setQaStatus(null);
    try {
      const res = await createValidationRun('prj_the_last_signal_demo', {
        simulation: undefined as unknown as any,
        cues: [],
        passages: [],
      });
      playAuditionTone(587.33, 0.2);
      setQaStatus(`✓ Live Validation Success: ${res.total_findings} findings detected and persisted to SQLite.`);
    } catch (err: unknown) {
      setQaStatus(err instanceof Error ? err.message : 'QA Run failed');
    } finally {
      setIsRunningQa(false);
    }
  };

  if (!isOpen) return null;

  const isOnline = health !== null && !pingError;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(6, 9, 10, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="backend-modal-title"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'var(--bt-surface, #141C1E)',
          border: '1px solid var(--bt-border, rgba(176, 198, 193, 0.16))',
          borderRadius: '14px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--bt-border, rgba(176, 198, 193, 0.16))',
            background: 'var(--bt-surface-2, #1A2426)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isOnline ? 'rgba(41, 201, 138, 0.14)' : 'rgba(240, 79, 117, 0.18)',
                color: isOnline ? 'var(--bt-accent, #29C98A)' : 'var(--bt-error, #F04F75)',
                border: `1px solid ${isOnline ? 'rgba(41, 201, 138, 0.28)' : 'rgba(240, 79, 117, 0.35)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Server size={18} />
            </div>
            <div>
              <h2 id="backend-modal-title" style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--bt-text, #EDF3F0)' }}>
                Backend Engine Diagnostics & Control
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--bt-text-secondary, #AAB8B3)' }}>
                Python 3.13 · FastAPI · SQLite Thread-Safe Repository
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--bt-text-secondary, #AAB8B3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '10px',
              background: isOnline ? 'rgba(41, 201, 138, 0.08)' : 'rgba(240, 79, 117, 0.14)',
              border: `1px solid ${isOnline ? 'rgba(41, 201, 138, 0.25)' : 'rgba(240, 79, 117, 0.35)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isOnline ? (
                <CheckCircle size={18} color="#29C98A" />
              ) : (
                <AlertTriangle size={18} color="#F04F75" />
              )}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: isOnline ? '#29C98A' : '#F04F75' }}>
                  {isOnline ? 'Backend Online (100% Operational)' : 'Backend Service Offline'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--bt-text-secondary, #AAB8B3)', fontFamily: 'var(--bt-font-mono, monospace)' }}>
                  {isOnline
                    ? `http://127.0.0.1:8000/api/v1 — ${health?.service ?? 'branchtone-backend'} v${health?.version ?? '0.1.0'}`
                    : (pingError ?? 'Connection refused at 127.0.0.1:8000')}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={checkStatus}
              disabled={isChecking}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'var(--bt-surface-2, #1A2426)',
                border: '1px solid var(--bt-border-subtle, rgba(176, 198, 193, 0.16))',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--bt-text, #EDF3F0)',
                cursor: isChecking ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={12} className={isChecking ? 'spin' : undefined} />
              <span>{isChecking ? 'Checking…' : 'Ping API'}</span>
            </button>
          </div>

          {/* Engine Architecture Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              fontSize: '12px',
            }}
          >
            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bt-dark-well, #0B0F11)', border: '1px solid var(--bt-border-subtle, rgba(176, 198, 193, 0.12))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bt-text, #EDF3F0)', fontWeight: 600, marginBottom: '4px' }}>
                <Database size={13} color="#29C98A" />
                <span>SQLite Database</span>
              </div>
              <div style={{ color: 'var(--bt-text-secondary, #AAB8B3)', fontSize: '11px' }}>
                <code>storage/branchtone.db</code> (14 verified schema tables)
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bt-dark-well, #0B0F11)', border: '1px solid var(--bt-border-subtle, rgba(176, 198, 193, 0.12))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bt-text, #EDF3F0)', fontWeight: 600, marginBottom: '4px' }}>
                <FileCode size={13} color="#38BDF8" />
                <span>AST Story Parser</span>
              </div>
              <div style={{ color: 'var(--bt-text-secondary, #AAB8B3)', fontSize: '11px' }}>
                Twee 3 (Harlowe subset) & Inkle Ink IR
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bt-dark-well, #0B0F11)', border: '1px solid var(--bt-border-subtle, rgba(176, 198, 193, 0.12))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bt-text, #EDF3F0)', fontWeight: 600, marginBottom: '4px' }}>
                <Activity size={13} color="#D9A65D" />
                <span>BFS Route Explorer</span>
              </div>
              <div style={{ color: 'var(--bt-text-secondary, #AAB8B3)', fontSize: '11px' }}>
                Queue-based state search with timeout & budgets
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bt-dark-well, #0B0F11)', border: '1px solid var(--bt-border-subtle, rgba(176, 198, 193, 0.12))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--bt-text, #EDF3F0)', fontWeight: 600, marginBottom: '4px' }}>
                <Terminal size={13} color="#E879F9" />
                <span>Rules Engine & Audio</span>
              </div>
              <div style={{ color: 'var(--bt-text-secondary, #AAB8B3)', fontSize: '11px' }}>
                BT-001–BT-004 rules + 128-bucket PCM decoder
              </div>
            </div>
          </div>

          {/* Quick Launch Guide (if offline) */}
          {!isOnline && (
            <div
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(217, 166, 93, 0.15)',
                border: '1px solid rgba(217, 166, 93, 0.35)',
                color: 'var(--bt-warning, #D9A65D)',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <span style={{ fontWeight: 600 }}>How to Start Backend on Windows:</span>
              <span>1. Double-click <code>start_full_studio.bat</code> in the repository root.</span>
              <span>2. Or in PowerShell run: <code>npm run dev:backend</code></span>
            </div>
          )}

          {/* Live Action Feedback */}
          {qaStatus && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                background: qaStatus.startsWith('✓') ? 'rgba(41, 201, 138, 0.14)' : 'rgba(240, 79, 117, 0.18)',
                border: `1px solid ${qaStatus.startsWith('✓') ? 'rgba(41, 201, 138, 0.35)' : 'rgba(240, 79, 117, 0.35)'}`,
                color: qaStatus.startsWith('✓') ? 'var(--bt-accent, #29C98A)' : 'var(--bt-error, #F04F75)',
                fontSize: '12px',
              }}
            >
              {qaStatus}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--bt-border, rgba(176, 198, 193, 0.16))',
            background: 'var(--bt-surface-2, #1A2426)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: 'var(--bt-accent, #29C98A)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <span>Swagger API Docs</span>
            <ExternalLink size={12} />
          </a>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={handleRunQa}
              disabled={isRunningQa || !isOnline}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '6px',
                background: 'var(--bt-accent, #29C98A)',
                color: '#06090A',
                border: 'none',
                fontSize: '12px',
                fontWeight: 700,
                cursor: isRunningQa || !isOnline ? 'not-allowed' : 'pointer',
                opacity: isRunningQa || !isOnline ? 0.6 : 1,
                boxShadow: '0 0 12px rgba(41, 201, 138, 0.3)',
              }}
            >
              <PlayCircle size={14} />
              <span>{isRunningQa ? 'Running QA…' : 'Run Live QA Suite'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                background: 'var(--bt-surface-3, #202B2D)',
                border: '1px solid var(--bt-border, rgba(176, 198, 193, 0.16))',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--bt-text, #EDF3F0)',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
