/**
 * Motor de juegos de elección: muestra una instrucción (visual, escrita y
 * hablada), varias opciones grandes, y da retroalimentación positiva.
 * Intentos ilimitados, sin temporizadores y sin penalizaciones.
 */
import { el, wait, prefersReducedMotion } from '../core/dom.js';
import { icon } from '../art/icons.js';
import { mascotSvg } from '../art/mascot.js';
import { NUMBER_WORDS } from '../data/colors.js';
import { pick } from '../core/random.js';
import { celebrate } from './celebrate.js';
import { iconButton, speakButton } from './ui.js';
import { lsecPlayer, lsecMissing } from './lsecPlayer.js';

const PRAISE = ['¡Muy bien!', '¡Excelente!', '¡Lo lograste!', '¡Genial!', '¡Bravo!'];
const ENCOURAGE = ['¡Casi! Intenta otra vez.', 'Mira bien y prueba otra vez.', '¡Tú puedes! Prueba otra vez.'];

export function choiceGame(ctx, activity, { level, rounds, onProgress, onFinish }) {
  const stats = { answered: 0, firstTry: 0 };
  let index = 0;
  let previous;
  let round;
  let errors = 0;
  let hinted = false;
  let locked = false;
  let destroyed = false;

  const instructionText = el('p', { class: 'instruction-text', id: 'instruction-text', tabindex: '-1' });
  const hintBtn = iconButton({ iconName: 'hint', label: 'Ayuda', className: 'hint-btn', onClick: () => showHint(true) });
  const instruction = el(
    'div',
    { class: 'instruction' },
    speakButton(ctx, () => round?.say, 'Escuchar otra vez'),
    instructionText,
    hintBtn
  );
  const prompt = el('figure', { class: 'prompt' });
  const lsecSlot = el('div', { class: 'lsec-slot' });
  const options = el('div', { class: 'options', role: 'group', 'aria-labelledby': 'instruction-text' });
  const feedback = el('div', { class: 'feedback', 'aria-hidden': 'true' });

  const root = el(
    'section',
    { class: 'game', 'data-activity': activity.id },
    instruction,
    el('div', { class: 'stage' }, prompt, lsecSlot),
    options,
    feedback
  );

  function setFeedback(mood, text) {
    feedback.replaceChildren(el('span', { class: 'feedback-mascot', html: mascotSvg(mood) }), el('span', {}, text));
    feedback.dataset.mood = mood;
  }

  function renderLsec() {
    lsecSlot.replaceChildren();
    if (!ctx.store.prefs.lsec || !round.lsec) return;
    const entry = ctx.lsec.videoFor(round.lsec);
    const label = ctx.lsec.entries.find((e) => e.concept === round.lsec)?.label;
    lsecSlot.append(entry ? lsecPlayer(entry) : lsecMissing(label));
  }

  function setupCountables() {
    let counted = 0;
    const buttons = [...prompt.querySelectorAll('.countable')];
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (counted >= buttons.length) {
          // Todos contados: un nuevo toque empieza a contar desde cero.
          counted = 0;
          buttons.forEach((b) => {
            b.classList.remove('is-counted');
            b.querySelector('.count-badge').textContent = '';
          });
        }
        if (btn.classList.contains('is-counted')) return;
        counted += 1;
        btn.classList.add('is-counted');
        btn.querySelector('.count-badge').textContent = String(counted);
        ctx.sfx.play('count');
        ctx.speech.speak(NUMBER_WORDS[counted] || String(counted));
        ctx.announce(String(counted));
      });
    });
  }

  function renderRound() {
    round = activity.createRound({ level, previous });
    previous = round.key;
    errors = 0;
    hinted = false;
    locked = false;
    root.dataset.answer = round.answer; // usado por las pruebas automatizadas
    instructionText.textContent = round.text;
    prompt.innerHTML = round.promptHtml;
    prompt.append(el('figcaption', { class: 'visually-hidden' }, round.promptLabel));
    if (round.countables) setupCountables();
    renderLsec();
    options.className = `options options--${round.optionKind} options--n${round.options.length}`;
    options.replaceChildren(
      ...round.options.map((opt) =>
        el(
          'button',
          {
            type: 'button',
            class: 'option',
            'data-key': opt.key,
            'aria-label': opt.label,
            onclick: (event) => choose(opt.key, event.currentTarget),
          },
          el('span', { class: 'option-art', html: opt.html }),
          el('span', { class: 'option-mark', 'aria-hidden': 'true' })
        )
      )
    );
    feedback.replaceChildren();
    delete feedback.dataset.mood;
    hintBtn.disabled = false;
    onProgress?.(index, rounds);
    if (ctx.store.prefs.autoSpeak) ctx.speech.speak(round.say);
  }

  function showHint(requested) {
    if (locked) return;
    hinted = true;
    const btn = options.querySelector(`[data-key="${CSS.escape(round.answer)}"]`);
    btn.classList.add('is-hint');
    btn.querySelector('.option-mark').innerHTML = icon('hand');
    if (requested) {
      ctx.speech.speak('Mira, es este.');
      ctx.announce('Ayuda: la respuesta está señalada con una mano.');
    }
    hintBtn.disabled = true;
  }

  async function choose(key, button) {
    if (locked || destroyed) return;
    if (key === round.answer) {
      locked = true;
      stats.answered += 1;
      if (errors === 0 && !hinted) stats.firstTry += 1;
      button.classList.remove('is-hint');
      button.classList.add('is-correct');
      button.querySelector('.option-mark').innerHTML = icon('check');
      options.querySelectorAll('.option').forEach((b) => b.setAttribute('aria-disabled', 'true'));
      if (round.successPromptHtml) {
        prompt.innerHTML = round.successPromptHtml;
      }
      const praise = pick(PRAISE);
      setFeedback('happy', praise);
      ctx.sfx.play('success');
      celebrate(ctx.store.prefs);
      const spoken = ctx.speech.speak(`${praise} ${round.successSay}`);
      ctx.announce(`${praise} ${round.successSay}`);
      // Se pasa a la siguiente ronda cuando terminó la felicitación (sin cortarla).
      await Promise.all([wait(prefersReducedMotion() ? 1600 : 2000), spoken]);
      if (destroyed) return;
      index += 1;
      if (index >= rounds) {
        onProgress?.(index, rounds);
        onFinish(stats);
      } else {
        renderRound();
        instructionText.focus?.();
      }
      return;
    }

    errors += 1;
    button.classList.add('is-wrong');
    button.disabled = true;
    button.setAttribute('aria-label', `${button.getAttribute('aria-label')}: no es este`);
    const message = pick(ENCOURAGE);
    setFeedback('normal', message);
    ctx.sfx.play('retry');
    ctx.speech.speak(message);
    ctx.announce(message);
    if (errors >= 2) showHint(false);
  }

  return {
    el: root,
    start() {
      renderRound();
    },
    destroy() {
      destroyed = true;
    },
  };
}
