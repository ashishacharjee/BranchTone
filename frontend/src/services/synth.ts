/**
 * BranchTone Web Audio Synthesizer
 *
 * Provides real browser-based synthesized audio feedback for:
 * - Timeline audition playback traversal
 * - Audio cue trigger audition
 * - Audio asset test tone verification
 *
 * Rules:
 * - Clearly distinguished as client-side synthesized audition tones.
 * - Never claims to be decoded media bytes from missing production assets.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let currentVolume = 0.7; // 0 to 1

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function setMasterVolume(valPercent: number) {
  currentVolume = Math.max(0, Math.min(100, valPercent)) / 100;
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
  }
}

/**
 * Play a short synthesized audition tone (used for testing audio output).
 */
export function playAuditionTone(freq = 440, durationSeconds = 0.4, type: OscillatorType = 'sine'): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return false;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Smooth envelope
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + durationSeconds);
    return true;
  } catch (err) {
    console.warn('Web Audio synthesis unavailable:', err);
    return false;
  }
}

/**
 * Play cue trigger event chime (normal or violation).
 */
export function playCueTriggerSound(isViolation = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx || !masterGain) return;

    const now = ctx.currentTime;

    if (isViolation) {
      // Dissonant suspense interval (D4 + G#4 tritone)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(293.66, now); // D4
      osc2.frequency.setValueAtTime(415.30, now); // G#4

      // Filter for dark cinematic timbre
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.8);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } else {
      // Harmonic 2-note chime (C5 -> G5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (err) {
    console.warn('Web Audio cue sound failed:', err);
  }
}
