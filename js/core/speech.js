/**
 * Instrucciones habladas con la síntesis de voz del navegador (Web Speech API).
 * No requiere conexión ni claves. Si el navegador no tiene voz, la plataforma
 * sigue funcionando con instrucciones visuales y escritas.
 */

const PREFERRED_LANGS = ['es-EC', 'es-419', 'es-US', 'es-MX', 'es-CO', 'es-PE', 'es-ES'];

export function createSpeech(getPrefs) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  const supported = Boolean(synth && typeof window.SpeechSynthesisUtterance === 'function');
  let voice = null;

  function chooseVoice() {
    if (!supported) return;
    const voices = synth.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('es'));
    voice =
      PREFERRED_LANGS.map((lang) => voices.find((v) => v.lang === lang || v.lang.replace('_', '-') === lang))
        .find(Boolean) ||
      voices[0] ||
      null;
  }

  if (supported) {
    chooseVoice();
    synth.addEventListener?.('voiceschanged', chooseVoice);
  }

  return {
    supported,
    /** true cuando hay una voz en español instalada en el dispositivo. */
    hasSpanishVoice() {
      chooseVoice();
      return Boolean(voice);
    },
    /** La voz está disponible y la persona la tiene activada. */
    enabled() {
      const prefs = getPrefs();
      return supported && prefs.voice && !prefs.muted;
    },
    /**
     * Lee un texto. Devuelve una promesa que se cumple cuando termina de
     * hablar (o de inmediato si la voz está apagada). Nunca queda colgada:
     * tiene un tiempo máximo por si el navegador no avisa el final.
     */
    speak(text) {
      if (!this.enabled() || !text) return Promise.resolve();
      const prefs = getPrefs();
      synth.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = voice?.lang || 'es-EC';
      if (voice) utterance.voice = voice;
      utterance.rate = prefs.rate;
      utterance.volume = prefs.volume;
      utterance.pitch = 1.05;
      const done = new Promise((resolve) => {
        const limit = setTimeout(resolve, Math.min(8000, 1200 + (text.length * 90) / prefs.rate));
        const finish = () => {
          clearTimeout(limit);
          resolve();
        };
        utterance.addEventListener('end', finish);
        utterance.addEventListener('error', finish);
      });
      synth.speak(utterance);
      return done;
    },
    cancel() {
      if (supported) synth.cancel();
    },
  };
}
