import { useEffect, useState, memo } from 'react';
import { getAudioAnalyser, playAuditionTone } from '../services/synth';
import styles from './HardwareVuMeter.module.css';

interface HardwareVuMeterProps {
  isAlert?: boolean;
}

export const HardwareVuMeter = memo(function HardwareVuMeter({ isAlert = false }: HardwareVuMeterProps) {
  const [levelL, setLevelL] = useState(38);
  const [levelR, setLevelR] = useState(34);
  const [peakHoldL, setPeakHoldL] = useState(42);
  const [peakHoldR, setPeakHoldR] = useState(38);

  useEffect(() => {
    let animId: number;
    let tick = 0;

    const updateMeter = () => {
      const analyser = getAudioAnalyser();
      tick++;

      let calculatedL = 0;
      let calculatedR = 0;

      if (analyser) {
        const buffer = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buffer);

        // Sum lower & upper frequencies
        let sumL = 0;
        let sumR = 0;
        const half = Math.floor(buffer.length / 2);

        for (let i = 0; i < half; i++) sumL += buffer[i];
        for (let i = half; i < buffer.length; i++) sumR += buffer[i];

        const avgL = sumL / half;
        const avgR = sumR / half;

        if (avgL > 5 || avgR > 5) {
          calculatedL = Math.min(100, (avgL / 255) * 120);
          calculatedR = Math.min(100, (avgR / 255) * 115);
        }
      }

      // If no active sound, supply subtle ambient room noise
      if (calculatedL === 0) {
        const noise = Math.sin(tick * 0.1) * 8 + (isAlert ? 65 : 28);
        calculatedL = Math.max(12, Math.min(95, noise + Math.random() * 4));
        calculatedR = Math.max(10, Math.min(90, noise * 0.92 + Math.random() * 4));
      }

      setLevelL((prev) => prev * 0.7 + calculatedL * 0.3);
      setLevelR((prev) => prev * 0.7 + calculatedR * 0.3);

      setPeakHoldL((prev) => (calculatedL > prev ? calculatedL : prev * 0.96));
      setPeakHoldR((prev) => (calculatedR > prev ? calculatedR : prev * 0.96));

      animId = requestAnimationFrame(updateMeter);
    };

    animId = requestAnimationFrame(updateMeter);
    return () => cancelAnimationFrame(animId);
  }, [isAlert]);

  const handleTestChime = () => {
    playAuditionTone(isAlert ? 293.66 : 523.25, 0.2);
  };

  return (
    <div
      className={styles.vuMeterContainer}
      onClick={handleTestChime}
      title="Hardware Stereo VU Meter (Click to send 1kHz calibration tone)"
      role="region"
      aria-label="Stereo VU Meter"
    >
      <div className={styles.meterHeader}>
        <span className={styles.meterTitle}>VU METERS</span>
        <span className={styles.meterScale}>-∞ · -18 · -6 · 0 · +3</span>
      </div>

      {/* Channel L */}
      <div className={styles.channelRow}>
        <span className={styles.channelLabel}>L</span>
        <div className={styles.ledTrack}>
          <div className={styles.ledFill} style={{ width: `${levelL}%` }} />
          <div className={styles.peakIndicator} style={{ left: `${peakHoldL}%` }} />
        </div>
        <span className={styles.dbValue}>{(levelL * 0.4 - 24).toFixed(0)} dB</span>
      </div>

      {/* Channel R */}
      <div className={styles.channelRow}>
        <span className={styles.channelLabel}>R</span>
        <div className={styles.ledTrack}>
          <div className={styles.ledFill} style={{ width: `${levelR}%` }} />
          <div className={styles.peakIndicator} style={{ left: `${peakHoldR}%` }} />
        </div>
        <span className={styles.dbValue}>{(levelR * 0.4 - 24).toFixed(0)} dB</span>
      </div>
    </div>
  );
});
