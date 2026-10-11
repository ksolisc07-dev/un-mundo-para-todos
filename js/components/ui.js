/** Piezas de interfaz compartidas por varias pantallas. */
import { el } from '../core/dom.js';
import { icon } from '../art/icons.js';

/** Botón o enlace grande con ícono y texto corto visible. */
export function iconButton({ iconName, label, href, onClick, className = '', pressed, hideLabel = false }) {
  const content = [
    el('span', { class: 'icon-wrap', html: icon(iconName) }),
    el('span', { class: hideLabel ? 'visually-hidden' : 'icon-label' }, label),
  ];
  if (href) return el('a', { class: `icon-btn ${className}`, href }, content);
  return el(
    'button',
    {
      type: 'button',
      class: `icon-btn ${className}`,
      onclick: onClick,
      'aria-pressed': pressed === undefined ? null : String(pressed),
    },
    content
  );
}

/** Botón de silencio rápido; se actualiza solo cuando cambian las preferencias. */
export function muteButton(ctx) {
  const btn = iconButton({
    iconName: ctx.store.prefs.muted ? 'mute' : 'speaker',
    label: 'Sonido',
    pressed: !ctx.store.prefs.muted,
    className: 'mute-btn',
    onClick: () => {
      ctx.store.updatePrefs({ muted: !ctx.store.prefs.muted });
      if (ctx.store.prefs.muted) ctx.speech.cancel();
    },
  });
  const sync = () => {
    btn.setAttribute('aria-pressed', String(!ctx.store.prefs.muted));
    btn.querySelector('.icon-wrap').innerHTML = icon(ctx.store.prefs.muted ? 'mute' : 'speaker');
  };
  const unsubscribe = ctx.store.subscribe(sync);
  ctx.onCleanup(unsubscribe);
  return btn;
}

/** Barra superior de las pantallas internas. */
export function topBar(ctx, { backHref, backLabel = 'Volver', title, extra = [] }) {
  return el(
    'header',
    { class: 'topbar' },
    backHref ? iconButton({ iconName: 'back', label: backLabel, href: backHref, className: 'back-btn' }) : null,
    el('h1', { class: 'topbar-title', tabindex: '-1' }, title),
    el('div', { class: 'topbar-actions' }, ...extra, muteButton(ctx))
  );
}

/** Fila de estrellas accesible: "2 de 3 estrellas". */
export function starRow(earned, total = 3, { highlight = null } = {}) {
  return el(
    'span',
    { class: 'stars', role: 'img', 'aria-label': `${earned} de ${total} estrellas` },
    Array.from({ length: total }, (_, i) =>
      el('span', {
        class: `star ${i < earned ? 'star--on' : 'star--off'} ${highlight === i + 1 ? 'star--new' : ''}`,
        html: icon(i < earned ? 'star' : 'starEmpty'),
      })
    )
  );
}

/** Botón para escuchar un texto, sólo si el dispositivo tiene síntesis de voz. */
export function speakButton(ctx, getText, label = 'Escuchar') {
  // Si la voz está desactivada en Preferencias no se muestra un botón que no haría nada.
  if (!ctx.speech.supported || !ctx.store.prefs.voice) return null;
  return iconButton({
    iconName: 'speaker',
    label,
    className: 'speak-btn',
    hideLabel: true,
    onClick: () => {
      // Tocar el parlante es un pedido explícito de oír: quita el silencio rápido.
      if (ctx.store.prefs.muted) ctx.store.updatePrefs({ muted: false });
      ctx.speech.speak(getText());
    },
  });
}
