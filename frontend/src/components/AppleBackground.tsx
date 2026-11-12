import { useEffect, useRef } from 'react';
import styles from './AppleBackground.module.css';

/**
 * Apple-grade Cinematic Ambient Background with Breathing Aurora Mesh & Interactive Spotlight.
 * Fully GPU-accelerated, pointer-events: none, respects prefers-reduced-motion.
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
      // Smooth spring-damped interpolation (Apple fluid follow)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

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
      {/* ── Base Obsidian Deep Field ───────────────────────────────── */}
      <div className={styles.deepField} />

      {/* ── Animated Apple Aurora Mesh Blobs ──────────────────────── */}
      <div className={styles.auroraLayer}>
        <div className={[styles.auroraBlob, styles.blobEmerald].join(' ')} />
        <div className={[styles.auroraBlob, styles.blobCyan].join(' ')} />
        <div className={[styles.auroraBlob, styles.blobBurgundy].join(' ')} />
      </div>

      {/* ── Interactive Cursor Spotlight ──────────────────────────── */}
      <div ref={spotlightRef} className={styles.spotlight} />

      {/* ── Apple Technical Dot Grid Mask ─────────────────────────── */}
      <div className={styles.dotGrid} />

      {/* ── Top Subtle Specular Vignette ───────────────────────────── */}
      <div className={styles.vignette} />
    </div>
  );
}
