/**
 * Práctica de señas frente a la cámara («espejo»).
 *
 * - La imagen de la cámara se muestra SOLO en esta pantalla: no se graba, no
 *   se guarda y no se envía a ningún servidor.
 * - NO califica la seña automáticamente. Reconocer LSEC de forma confiable
 *   requiere un modelo entrenado con grabaciones auténticas de LSEC, con
 *   consentimiento y validadas por la comunidad sorda ecuatoriana, que hoy no
 *   existe. Calificar sin eso daría por buenas señas incorrectas.
 *   Ver docs/LSEC_VIDEOS.md («Reconocimiento automático»).
 * - Sólo aparece junto a un video LSEC validado y si una persona adulta lo
 *   activó en «Docentes y familias».
 */
import { el } from '../core/dom.js';
import { icon } from '../art/icons.js';

let stream = null;
const listeners = new Set();

export function cameraSupported() {
  return Boolean(typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia);
}

export function cameraActive() {
  return Boolean(stream);
}

/** Apaga la cámara (al salir de la pantalla o al pulsar «Apagar»). */
export function stopCamera() {
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;
  listeners.forEach((fn) => fn());
}

async function startCamera() {
  if (!stream) {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    listeners.forEach((fn) => fn());
  }
  return stream;
}

export function cameraPractice(ctx, label) {
  const status = el('p', { class: 'camera-status', role: 'status' });
  const video = el('video', {
    class: 'camera-video',
    autoplay: true,
    muted: true,
    playsinline: true,
    'aria-label': 'Tu imagen en la cámara, como un espejo',
  });
  const view = el('div', { class: 'camera-view' }, video);
  const toggle = el('button', { type: 'button', class: 'btn btn--small camera-toggle' });
  const root = el(
    'div',
    { class: 'camera-practice' },
    toggle,
    view,
    status,
    el('p', { class: 'camera-privacy' }, 'Tu imagen sólo se ve en esta pantalla: no se graba ni se envía.')
  );

  function sync() {
    const on = cameraActive();
    root.classList.toggle('is-on', on);
    toggle.replaceChildren(el('span', { html: icon('video') }), on ? 'Apagar la cámara' : 'Practicar con mi cámara');
    toggle.setAttribute('aria-pressed', String(on));
    if (on && video.srcObject !== stream) {
      video.srcObject = stream;
      video.play?.().catch(() => {});
    }
    if (!on) video.srcObject = null;
    status.textContent = on ? `Mira el video y haz la seña de «${label}» frente a la cámara.` : '';
  }

  toggle.addEventListener('click', async () => {
    if (cameraActive()) {
      stopCamera();
      return;
    }
    try {
      await startCamera();
    } catch (error) {
      status.textContent =
        error?.name === 'NotAllowedError'
          ? 'No se dio permiso para usar la cámara. Puedes seguir jugando sin ella.'
          : 'No se pudo abrir la cámara en este dispositivo. Puedes seguir jugando sin ella.';
    }
  });

  listeners.add(sync);
  ctx.onCleanup(() => {
    listeners.delete(sync);
    stopCamera();
  });
  sync();
  return root;
}
