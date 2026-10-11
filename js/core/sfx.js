/**
 * Efectos de sonido generados con Web Audio (sin archivos externos).
 * Son suaves y cortos; se pueden desactivar en Preferencias.
 */

const SOUNDS = {
  // Arpegio ascendente alegre.
  success: [
    [523.25, 0, 0.12],
    [659.25, 0.1, 0.12],
    [783.99, 0.2, 0.22],
  ],
  // Dos notas suaves descendentes, nunca un "error" estridente.
  retry: [
    [392.0, 0, 0.14],
    [349.23, 0.12, 0.18],
  ],
  flip: [[660, 0, 0.06]],
  count: [[880, 0, 0.08]],
  celebrate: [
    [523.25, 0, 0.12],
    [659.25, 0.1, 0.12],
    [783.99, 0.2, 0.12],
    [1046.5, 0.32, 0.35],
  ],
};

export function createSfx(getPrefs) {
  let ctx = null;

  function audioContext() {
    if (ctx) return ctx;
    const AudioCtx = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    return ctx;
  }

  return {
    play(name) {
      const prefs = getPrefs();
      const notes = SOUNDS[name];
      if (prefs.muted || !prefs.sfx || !notes || prefs.volume <= 0) return;
      const ac = audioContext();
      if (!ac) return;
      if (ac.state === 'suspended') ac.resume();
      const start = ac.currentTime + 0.02;
      for (const [freq, offset, duration] of notes) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const peak = 0.18 * prefs.volume;
        gain.gain.setValueAtTime(0.0001, start + offset);
        gain.gain.exponentialRampToValueAtTime(peak, start + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + duration);
        osc.connect(gain).connect(ac.destination);
        osc.start(start + offset);
        osc.stop(start + offset + duration + 0.05);
      }
    },
  };
}
