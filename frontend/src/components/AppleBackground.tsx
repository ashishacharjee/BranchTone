import { useEffect, useRef } from 'react';
import styles from './AppleBackground.module.css';

/**
 * Awwwards-Grade Cinematic Audio Studio Background.
 * Combines deep obsidian chassis, tactile film-grain texture,
 * interactive spring-damped pointer glow, and precision architectural corner crosshairs.
 */
export function AppleBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;

    function handlePointerMove(e: PointerEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function updateSpotlight() {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spotlight-x', `${currentX.toFixed(1)}px`);
        spotlightRef.current.style.setProperty('--spotlight-y', `${currentY.toFixed(1)}px`);
      }

      animationFrameId = requestAnimationFrame(updateSpotlight);
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.backgroundContainer} aria-hidden="true">
      {/* ── Deep Obsidian Studio Ground ───────────────────────────── */}
      <div className={styles.deepField} />

      {/* ── Interactive Ambient Glow ──────────────────────────────── */}
      <div ref={spotlightRef} className={styles.spotlight} />

      {/* ── Technical Micro Dot-Grid ──────────────────────────────── */}
      <div className={styles.dotGrid} />

      {/* ── Tactile Micro-Film Grain Texture ──────────────────────── */}
      <div className={styles.grainOverlay} />

      {/* ── Architectural Studio Corner Crosshairs ────────────────── */}
      <div className={styles.cornerCrosshairTL}>+</div>
      <div className={styles.cornerCrosshairTR}>+</div>
      <div className={styles.cornerCrosshairBL}>+</div>
      <div className={styles.cornerCrosshairBR}>+</div>

      {/* ── Subtle Studio Chassis Vignette ────────────────────────── */}
      <div className={styles.vignette} />
    </div>
  );
}
