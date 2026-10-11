/**
 * «Forma la palabra»: la niña o el niño toca las fichas de letras en orden.
 * Una ficha equivocada sólo se sacude (sin castigo); tras dos intentos se
 * señala la letra que sigue. Funciona con mouse, toque y teclado (también
 * se puede escribir la letra con el teclado físico).
 */
import { el, wait, prefersReducedMotion } from '../core/dom.js';
import { icon } from '../art/icons.js';
import { mascotSvg } from '../art/mascot.js';
import { pick } from '../core/random.js';
import { celebrate } from './celebrate.js';
import { iconButton, speakButton } from './ui.js';

const PRAISE = ['¡Muy bien!', '¡Excelente!', '¡Genial!'];

export function spellGame(ctx, activity, { level, rounds, onProgress, onFinish }) {
  const stats = { answered: 0, firstTry: 0 };
  let index = 0;
  let previous;
  let current;
  let position = 0;
  let errors = 0;
  let hinted = false;
  let locked = false;
  let destroyed = false;

  const instructionText = el('p', { class: 'instruction-text', id: 'instruction-text', tabindex: '-1' });
  const hintBtn = iconButton({ iconName: 'hint', label: 'Ayuda', className: 'hint-btn', onClick: () => showHint(true) });
  const instruction = el('div', { class: 'instruction' }, speakButton(ctx, () => current?.say, 'Escuchar otra vez'), instructionText, hintBtn);
  const picture = el('figure', { class: 'prompt' });
  const slots = el('div', { class: 'word-slots', 'aria-live': 'polite' });
  const tiles = el('div', { class: 'options options--tiles', role: 'group', 'aria-labelledby': 'instruction-text' });
  const feedback = el('div', { class: 'feedback', 'aria-hidden': 'true' });
  const root = el(
    'section',
    { class: 'game game--spell', 'data-activity': activity.id },
    instruction,
    el('div', { class: 'stage' }, picture, slots),
    tiles,
    feedback
  );

  function setFeedback(mood, text) {
    feedback.replaceChildren(el('span', { class: 'feedback-mascot', html: mascotSvg(mood) }), el('span', {}, text));
    feedback.dataset.mood = mood;
  }

  function renderSlots() {
    slots.replaceChildren(
      el('span', { class: 'visually-hidden' }, `Llevas: ${current.word.slice(0, position).split('').join(' ') || 'ninguna letra'}`),
      ...current.word.split('').map((letter, i) =>
        el('span', { class: `slot ${i < position ? 'slot--filled' : ''} ${i === position ? 'slot--next' : ''}`, 'aria-hidden': 'true' }, i < position ? letter : '')
      )
    );
  }

  function nextLetter() {
    return current.word[position];
  }

  function renderWord() {
    current = activity.createWord({ level, previous });
    previous = current.key;
    position = 0;
    errors = 0;
    hinted = false;
    locked = false;
    root.dataset.answer = current.word; // usado por las pruebas automatizadas
    instructionText.textContent = current.text;
    picture.innerHTML = current.pictureHtml;
    picture.append(el('figcaption', { class: 'visually-hidden' }, `Dibujo: ${current.word}`));
    renderSlots();
    tiles.replaceChildren(
      ...current.tiles.map((t) =>
        el(
          'button',
          {
            type: 'button',
            class: 'option tile',
            'data-key': t.key,
            'data-letter': t.letter,
            'aria-label': `Letra ${t.letter}`,
            onclick: (e) => choose(e.currentTarget),
          },
          el('span', { class: 'letter', 'aria-hidden': 'true' }, t.letter),
          el('span', { class: 'option-mark', 'aria-hidden': 'true' })
        )
      )
    );
    feedback.replaceChildren();
    hintBtn.disabled = false;
    onProgress?.(index, rounds);
    if (ctx.store.prefs.autoSpeak) ctx.speech.speak(current.say);
  }

  function availableTile(letter) {
    return tiles.querySelector(`.tile:not(.is-used)[data-letter="${letter}"]`);
  }

  function showHint(requested) {
    if (locked) return;
    hinted = true;
    tiles.querySelectorAll('.is-hint').forEach((t) => {
      t.classList.remove('is-hint');
      t.querySelector('.option-mark').innerHTML = '';
    });
    const tile = availableTile(nextLetter());
    tile.classList.add('is-hint');
    tile.querySelector('.option-mark').innerHTML = icon('hand');
    if (requested) ctx.announce(`Ayuda: sigue la letra ${nextLetter()}.`);
  }

  async function choose(tile) {
    if (locked || destroyed || tile.classList.contains('is-used')) return;
    if (tile.dataset.letter !== nextLetter()) {
      errors += 1;
      tile.classList.remove('is-shaking');
      void tile.offsetWidth; // reinicia la animación
      tile.classList.add('is-shaking');
      const msg = 'Esa no va ahora. ¡Prueba otra!';
      setFeedback('normal', msg);
      ctx.sfx.play('retry');
      ctx.announce(msg);
      if (errors >= 2) showHint(false);
      return;
    }
    tile.classList.remove('is-hint');
    tile.classList.add('is-used');
    tile.disabled = true;
    tile.querySelector('.option-mark').innerHTML = '';
    position += 1;
    errors = 0;
    renderSlots();
    ctx.sfx.play('count');
    if (position < current.word.length) {
      if (hinted) showHint(false);
      return;
    }

    locked = true;
    stats.answered += 1;
    if (!hinted) stats.firstTry += 1;
    slots.classList.add('is-complete');
    const praise = pick(PRAISE);
    setFeedback('happy', `${praise} ${current.word}`);
    ctx.sfx.play('success');
    celebrate(ctx.store.prefs);
    const spoken = ctx.speech.speak(`${praise} ${current.word}.`);
    ctx.announce(`${praise} Formaste ${current.word}.`);
    await Promise.all([wait(prefersReducedMotion() ? 1600 : 2000), spoken]);
    if (destroyed) return;
    slots.classList.remove('is-complete');
    index += 1;
    if (index >= rounds) {
      onProgress?.(index, rounds);
      onFinish(stats);
    } else {
      renderWord();
      instructionText.focus();
    }
  }

  function onKey(event) {
    if (event.ctrlKey || event.metaKey || event.altKey || !/^[a-zñ]$/i.test(event.key)) return;
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    const letter = event.key.toLowerCase();
    const tile = availableTile(letter);
    if (tile) choose(tile);
  }

  return {
    el: root,
    start() {
      document.addEventListener('keydown', onKey);
      renderWord();
    },
    destroy() {
      destroyed = true;
      document.removeEventListener('keydown', onKey);
    },
  };
}
