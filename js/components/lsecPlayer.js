/**
 * Reproductor de videos LSEC. Sólo recibe entradas ya validadas por el
 * registro (js/data/lsec.js); nunca genera ni simula señas.
 */
import { el } from '../core/dom.js';
import { icon } from '../art/icons.js';

export function lsecPlayer(entry) {
  const video = el('video', {
    class: 'lsec-video',
    src: entry.src,
    poster: entry.poster || null,
    controls: true,
    playsinline: true,
    preload: 'metadata',
    muted: true, // las señas no necesitan audio; evita bloqueos de reproducción automática
    'aria-label': `Seña en LSEC: ${entry.label}`,
  });
  if (entry.captions) {
    video.append(el('track', { kind: 'captions', srclang: 'es', label: 'Español', src: entry.captions, default: true }));
  }
  const replay = el(
    'button',
    {
      type: 'button',
      class: 'btn btn--small',
      onclick: () => {
        video.currentTime = 0;
        video.play().catch(() => {});
      },
    },
    el('span', { html: icon('replay') }),
    'Ver otra vez'
  );
  const credit = [
    entry.signer ? `Seña: ${entry.signer}` : null,
    `Validado por: ${entry.validation.reviewers.join(', ')}`,
    `Licencia: ${entry.license}`,
  ]
    .filter(Boolean)
    .join(' · ');
  return el(
    'figure',
    { class: 'lsec-player' },
    video,
    el('figcaption', {}, el('strong', {}, `LSEC: ${entry.label}`), replay, el('small', {}, credit))
  );
}

/** Aviso honesto cuando la persona activó LSEC pero falta el video de esta palabra. */
export function lsecMissing(label) {
  return el(
    'p',
    { class: 'lsec-missing' },
    el('span', { html: icon('video') }),
    label ? `Seña de «${label}»: video LSEC pendiente de validación.` : 'Video LSEC pendiente de validación.'
  );
}
