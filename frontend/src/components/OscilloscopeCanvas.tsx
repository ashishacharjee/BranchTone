import { useEffect, useRef, memo } from 'react';
import { getAudioAnalyser } from '../services/synth';
import styles from './OscilloscopeCanvas.module.css';

interface OscilloscopeCanvasProps {
  height?: number;
  isAlert?: boolean;
  activePassage?: string;
  routeId?: string;
}

export const OscilloscopeCanvas = memo(function OscilloscopeCanvas({
  height = 56,
  isAlert = false,
  activePassage = 'P-003',
  routeId = 'route_b',
}: OscilloscopeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      const analyser = getAudioAnalyser();

      ctx.clearRect(0, 0, width, h);

      // ── Draw CRT Grid Lines ──────────────────────────────────────
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += 14) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Center baseline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(width, h / 2);
      ctx.stroke();

      // ── Sample Audio Data or Synthetic Carrier Wave ─────────────
      const bufferLength = analyser ? analyser.frequencyBinCount : 128;
      const dataArray = new Uint8Array(bufferLength);
      let hasRealAudio = false;

      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
        // Check if there's actual signal deviation from silence (128)
        for (let i = 0; i < bufferLength; i++) {
          if (Math.abs(dataArray[i] - 128) > 3) {
            hasRealAudio = true;
            break;
          }
        }
      }

      // ── Draw Glow & Waveform ──────────────────────────────────────
      const lineColor = isAlert ? '#EF4444' : '#10B981';
      const glowColor = isAlert ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.35)';

      ctx.lineWidth = 1.75;
      ctx.strokeStyle = lineColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isAlert ? 8 : 5;

      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v: number;
        if (hasRealAudio) {
          v = dataArray[i] / 128.0; // 0 to 2
        } else {
          // Subtle organic ambient sine carrier wave
          const baseFreq = isAlert ? 0.08 : 0.04;
          const harmonic = Math.sin(i * baseFreq + phase) * (isAlert ? 0.28 : 0.16);
          const secondHarmonic = Math.cos(i * (baseFreq * 2.3) - phase * 0.7) * (isAlert ? 0.12 : 0.06);
          v = 1.0 + harmonic + secondHarmonic;
        }

        const y = (v * h) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, h / 2);
      ctx.stroke();

      // Reset shadow
      ctx.shadowBlur = 0;

      phase += isAlert ? 0.08 : 0.03;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isAlert]);

  return (
    <div className={styles.oscilloscopeWrap} style={{ height }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={height}
        className={styles.canvas}
        aria-hidden="true"
      />
      <div className={styles.telemetryOverlay}>
        <div className={styles.telemetryLeft}>
          <span className={styles.liveIndicator}>
            <span className={[styles.statusDot, isAlert ? styles.statusDotAlert : ''].join(' ')} />
            {isAlert ? 'DEFECT SPIKE DETECTED' : 'MONITORING REALTIME OSC'}
          </span>
          <span className={styles.metaDim}>44.1 kHz // 24-BIT // {routeId.toUpperCase()}</span>
        </div>
        <div className={styles.telemetryRight}>
          <span className={styles.passageTag}>{activePassage}</span>
          <span className={styles.metaDim}>CH 1+2 STEREO</span>
        </div>
      </div>
    </div>
  );
});
