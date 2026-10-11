/**
 * Juego de memoria (parejas). Sin tiempo límite ni contador de errores
 * visible para la niña o el niño.
 */
import { el, wait, prefersReducedMotion } from '../core/dom.js';
import { icon } from '../art/icons.js';
import { mascotSvg } from '../art/mascot.js';
import { celebrate } from './celebrate.js';
import { speakButton } from './ui.js';

export function memoryGame(ctx, activity, { level, onProgress, onFinish }) {
  const board = activity.createBoard({ level });
  let open = [];
  let matched = 0;
  let attempts = 0;
  let busy = false;
  let destroyed = false;

  const instructionText = el('p', { class: 'instruction-text', id: 'instruction-text', tabindex: '-1' }, board.text);
  const instruction = el('div', { class: 'instruction' }, speakButton(ctx, () => board.say, 'Escuchar otra vez'), instructionText);
  const feedback = el('div', { class: 'feedback', 'aria-hidden': 'true' });
  const grid = el('div', {
    class: `memory-grid memory-grid--${board.cards.length}`,
    role: 'group',
    'aria-labelledby': 'instruction-text',
  });

  const cardLabel = (card, i) =>
    card.classList.contains('is-up') ? `Carta ${i + 1}: ${card.dataset.label}` : `Carta ${i + 1}, boca abajo`;

  const cards = board.cards.map((card, i) => {
    const btn = el(
      'button',
      {
        type: 'button',
        class: 'memory-card',
        'data-key': card.key,
        'data-label': card.label,
        onclick: () => flip(btn),
      },
      el(
        'span',
        { class: 'memory-card-inner' },
        el('span', { class: 'memory-face memory-face--back', html: mascotSvg('normal') }),
        el('span', { class: 'memory-face memory-face--front', html: card.html }),
        el('span', { class: 'option-mark', 'aria-hidden': 'true' })
      )
    );
    btn.setAttribute('aria-label', cardLabel(btn, i));
    return btn;
  });
  grid.append(...cards);

  const relabel = () => cards.forEach((c, i) => c.setAttribute('aria-label', cardLabel(c, i)));

  function setFeedback(mood, text) {
    feedback.replaceChildren(el('span', { class: 'feedback-mascot', html: mascotSvg(mood) }), el('span', {}, text));
  }

  async function flip(card) {
    if (busy || destroyed || card.classList.contains('is-up')) return;
    card.classList.add('is-up');
    ctx.sfx.play('flip');
    open.push(card);
    relabel();
    ctx.announce(card.dataset.label);
    if (open.length < 2) return;

    attempts += 1;
    const [a, b] = open;
    open = [];
    if (a.dataset.key === b.dataset.key) {
      matched += 1;
      [a, b].forEach((c) => {
        c.classList.add('is-matched');
        c.querySelector('.option-mark').innerHTML = icon('check');
        c.setAttribute('aria-disabled', 'true');
      });
      ctx.sfx.play('success');
      celebrate(ctx.store.prefs);
      setFeedback('happy', `¡Pareja! ${a.dataset.label}`);
      ctx.speech.speak(`¡Muy bien! ${a.dataset.label}.`);
      ctx.announce(`¡Pareja encontrada! ${a.dataset.label}.`);
      onProgress?.(matched, board.pairs);
      if (matched === board.pairs) {
        await wait(1500);
        if (!destroyed) onFinish({ answered: attempts, firstTry: matched });
      }
      return;
    }

    busy = true;
    setFeedback('normal', 'No son iguales. ¡Sigue buscando!');
    ctx.announce(`No son iguales: ${a.dataset.label} y ${b.dataset.label}. Las cartas se darán vuelta.`);
    await wait(prefersReducedMotion() ? 1600 : 1300);
    if (destroyed) return;
    [a, b].forEach((c) => c.classList.remove('is-up'));
    relabel();
    busy = false;
  }

  const root = el('section', { class: 'game game--memory', 'data-activity': activity.id }, instruction, grid, feedback);

  return {
    el: root,
    start() {
      onProgress?.(0, board.pairs);
      if (ctx.store.prefs.autoSpeak) ctx.speech.speak(board.say);
    },
    destroy() {
      destroyed = true;
    },
  };
}
