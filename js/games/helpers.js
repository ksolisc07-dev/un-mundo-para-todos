/**
 * Ayudantes para que los generadores de rondas construyan su contenido.
 * Todo devuelve texto HTML/SVG, así los generadores funcionan también en
 * Node (pruebas unitarias) sin un DOM.
 *
 * CONTRATO DE UNA RONDA (lo que devuelve `createRound`):
 * {
 *   key:        identificador de lo preguntado (evita repetir la ronda anterior)
 *   say:        instrucción hablada
 *   text:       instrucción escrita (corta)
 *   promptHtml: instrucción visual (dibujo, palabra, secuencia…)
 *   promptLabel:descripción accesible de la instrucción visual
 *   options:    [{ key, label, html }]  opciones que se pueden tocar
 *   answer:     key de la opción correcta (siempre única)
 *   optionKind: 'picture' | 'numeral' | 'swatch' | 'bin' | 'group'
 *   lsec:       concepto LSEC asociado (o null)
 *   successSay: lo que se dice al acertar
 *   successPromptHtml: (opcional) instrucción visual tras acertar
 *   countables: (opcional) true si la instrucción tiene objetos para contar
 * }
 */
import { escapeHtml } from '../core/dom.js';
import { animalSvg } from '../art/animals.js';
import { countableSvg } from '../art/objects.js';
import { COUNTABLE_ITEMS } from '../data/colors.js';
import { shuffle } from '../core/random.js';

export function itemSvg(itemId) {
  const item = COUNTABLE_ITEMS.find((i) => i.id === itemId);
  return item?.kind === 'animal' ? animalSvg(itemId) : countableSvg(itemId);
}

export function wordPrompt(word, iconHtml = '') {
  return `<div class="prompt-word">${iconHtml}<span>${escapeHtml(word)}</span></div>`;
}

export function numeralHtml(n) {
  return `<span class="numeral" aria-hidden="true">${n}</span>`;
}

/** Grupo de n objetos dispuestos en filas de 5 (como un "marco de diez"). */
export function groupHtml(itemId, n, { buttons = false, label = '' } = {}) {
  const art = itemSvg(itemId);
  const cells = Array.from({ length: n }, (_, i) =>
    buttons
      ? `<button type="button" class="countable" data-index="${i}" aria-label="${escapeHtml(label)} ${i + 1}">${art}<span class="count-badge" aria-hidden="true"></span></button>`
      : `<span class="group-item">${art}</span>`
  ).join('');
  return `<div class="group group--${n > 5 ? 'two-rows' : 'one-row'}" data-count="${n}">${cells}</div>`;
}

/** Mezcla la respuesta con los distractores y valida que no haya duplicados. */
export function buildOptions(answer, distractors, rng) {
  const all = [answer, ...distractors];
  const keys = new Set(all.map((o) => o.key));
  if (keys.size !== all.length) throw new Error('Opciones duplicadas en la ronda');
  return shuffle(all, rng);
}

export const OPTIONS_BY_LEVEL = { 1: 3, 2: 4, 3: 6 };
