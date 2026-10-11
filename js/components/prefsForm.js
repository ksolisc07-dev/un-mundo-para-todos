/** Formulario de preferencias de accesibilidad, audio y efectos. */
import { el } from '../core/dom.js';

let uid = 0;

function toggle(ctx, key, label, help, { disabled = false } = {}) {
  const id = `pref-${key}-${(uid += 1)}`;
  const input = el('input', {
    type: 'checkbox',
    id,
    role: 'switch',
    checked: Boolean(ctx.store.prefs[key]) && !disabled,
    disabled,
    'aria-describedby': help ? `${id}-help` : null,
    onchange: (e) => ctx.store.updatePrefs({ [key]: e.target.checked }),
  });
  // Mantiene el interruptor sincronizado si la preferencia cambia desde otro control.
  if (!disabled) ctx.onCleanup(ctx.store.subscribe((state) => (input.checked = Boolean(state.prefs[key]))));
  return el(
    'div',
    { class: `field field--toggle ${disabled ? 'is-disabled' : ''}` },
    input,
    el('label', { for: id }, label),
    help ? el('p', { class: 'help', id: `${id}-help` }, help) : null
  );
}

function range(ctx, key, label, { min, max, step, format }) {
  const id = `pref-${key}-${(uid += 1)}`;
  const output = el('output', { for: id }, format(ctx.store.prefs[key]));
  const input = el('input', {
    type: 'range',
    id,
    min,
    max,
    step,
    value: ctx.store.prefs[key],
    'aria-valuetext': format(ctx.store.prefs[key]),
    oninput: (e) => {
      const value = Number(e.target.value);
      output.textContent = format(value);
      e.target.setAttribute('aria-valuetext', format(value));
      ctx.store.updatePrefs({ [key]: value });
    },
  });
  return el('div', { class: 'field field--range' }, el('label', { for: id }, label), input, output);
}

function radios(ctx, key, legend, choices) {
  const name = `pref-${key}-${(uid += 1)}`;
  return el(
    'fieldset',
    { class: 'field field--radios' },
    el('legend', {}, legend),
    choices.map(([value, text]) => {
      const id = `${name}-${value}`;
      return el(
        'div',
        { class: 'radio' },
        el('input', {
          type: 'radio',
          id,
          name,
          value,
          checked: ctx.store.prefs[key] === value,
          onchange: () => ctx.store.updatePrefs({ [key]: value }),
        }),
        el('label', { for: id }, text)
      );
    })
  );
}

export function prefsForm(ctx) {
  const speechNote = !ctx.speech.supported
    ? el('p', { class: 'notice' }, 'Este navegador no tiene síntesis de voz: las instrucciones se muestran escritas y con dibujos.')
    : !ctx.speech.hasSpanishVoice()
      ? el(
          'p',
          { class: 'notice' },
          'No encontramos una voz en español instalada en este dispositivo. Puede que la voz suene con acento de otro idioma. Puedes instalar una voz en español en la configuración del sistema.'
        )
      : null;

  const testVoice = ctx.speech.supported
    ? el(
        'button',
        {
          type: 'button',
          class: 'btn',
          onclick: () => {
            if (ctx.store.prefs.muted) ctx.store.updatePrefs({ muted: false });
            ctx.speech.speak('¡Hola! Así suena mi voz.');
          },
        },
        'Probar la voz'
      )
    : null;

  const lsecAvailable = ctx.lsec.hasAnyVideo();

  return el(
    'div',
    { class: 'prefs-form' },
    el(
      'section',
      { class: 'panel', 'aria-labelledby': 'prefs-audio' },
      el('h2', { id: 'prefs-audio' }, 'Sonido y voz'),
      speechNote,
      toggle(ctx, 'muted', 'Silencio total', 'Apaga la voz y los sonidos al mismo tiempo.'),
      toggle(ctx, 'voice', 'Instrucciones habladas', 'Usa la voz del navegador, en español, sin conexión a internet.', {
        disabled: !ctx.speech.supported,
      }),
      toggle(ctx, 'autoSpeak', 'Leer la instrucción al empezar cada ronda'),
      toggle(ctx, 'sfx', 'Sonidos de recompensa'),
      range(ctx, 'volume', 'Volumen', { min: 0, max: 1, step: 0.1, format: (v) => `${Math.round(v * 100)} %` }),
      range(ctx, 'rate', 'Velocidad de la voz', {
        min: 0.6,
        max: 1.3,
        step: 0.1,
        format: (v) => (v < 0.85 ? 'Lenta' : v > 1.05 ? 'Rápida' : 'Normal'),
      }),
      testVoice
    ),
    el(
      'section',
      { class: 'panel', 'aria-labelledby': 'prefs-visual' },
      el('h2', { id: 'prefs-visual' }, 'Vista'),
      radios(ctx, 'motion', 'Animaciones', [
        ['auto', 'Según el dispositivo'],
        ['reduce', 'Reducidas (sin movimiento)'],
        ['full', 'Completas'],
      ]),
      toggle(ctx, 'celebrations', 'Celebraciones con confeti'),
      toggle(ctx, 'highContrast', 'Alto contraste'),
      toggle(ctx, 'largeText', 'Texto más grande'),
      toggle(ctx, 'colorLabels', 'Mostrar el nombre escrito de los colores', 'Útil para personas con daltonismo y para practicar la lectura.')
    ),
    el(
      'section',
      { class: 'panel', 'aria-labelledby': 'prefs-lsec' },
      el('h2', { id: 'prefs-lsec' }, 'Lengua de Señas Ecuatoriana (LSEC)'),
      toggle(
        ctx,
        'lsec',
        'Mostrar videos en LSEC dentro de los juegos',
        lsecAvailable
          ? 'Se muestran sólo videos auténticos validados por la comunidad sorda ecuatoriana.'
          : 'Todavía no hay videos LSEC validados. Esta opción se activará cuando se incorporen videos auténticos, con permiso de uso y validados por personas competentes en LSEC.',
        { disabled: !lsecAvailable }
      )
    )
  );
}
