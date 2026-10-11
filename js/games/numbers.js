/** Mundo 3: Los números. */
import { NUMBER_WORDS, COUNTABLE_ITEMS, quantityPhrase } from '../data/colors.js';
import { capitalize } from '../data/animals.js';
import { icon } from '../art/icons.js';
import { INK, STROKE, svg } from '../art/svg.js';
import { pick, randInt, sample, defaultRng } from '../core/random.js';
import { buildOptions, groupHtml, numeralHtml, wordPrompt, itemSvg } from './helpers.js';

const RANGE = { 1: [1, 3], 2: [1, 5], 3: [1, 10] };

/** Número aleatorio del rango que no repite el anterior si hay alternativa. */
function numberInRange([min, max], rng, avoid) {
  let n = randInt(min, max, rng);
  if (n === avoid && max > min) n = n === max ? n - 1 : n + 1;
  return n;
}

/** Distractores numéricos cercanos al correcto (más útiles para aprender). */
export function nearbyNumbers(n, count, [min, max], rng) {
  const candidates = [];
  for (let k = Math.max(1, min); k <= Math.max(max, n + 1); k += 1) if (k !== n && k <= 10) candidates.push(k);
  candidates.sort((a, b) => Math.abs(a - n) - Math.abs(b - n) || a - b);
  return sample(candidates.slice(0, count + 1), Math.min(count, candidates.length), rng);
}

const numeralOption = (k) => ({ key: String(k), label: String(k), html: numeralHtml(k) });

export const contar = {
  id: 'contar',
  title: 'Cuenta',
  goal: 'Contar objetos. Cada objeto se puede tocar para contarlo en voz alta.',
  levels: { 1: 'Del 1 al 3.', 2: 'Del 1 al 5.', 3: 'Del 1 al 10.' },
  kind: 'choice',
  icon: () => itemSvg('manzana'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const item = pick(COUNTABLE_ITEMS, rng);
    const n = numberInRange(RANGE[level], rng, Number(previous));
    const optionCount = level === 3 ? 4 : 3;
    const distractors = nearbyNumbers(n, optionCount - 1, RANGE[level], rng);
    const question = `¿${item.fem ? 'Cuántas' : 'Cuántos'} ${item.many} hay?`;
    return {
      key: String(n),
      say: `${question} Puedes tocar cada ${item.one} para contar.`,
      text: question,
      promptHtml: groupHtml(item.id, n, { buttons: true, label: capitalize(item.one) }),
      promptLabel: `Grupo de ${item.many} para contar`,
      countables: true,
      options: buildOptions(numeralOption(n), distractors.map(numeralOption), rng),
      answer: String(n),
      optionKind: 'numeral',
      lsec: `numero:${n}`,
      successSay: `¡Sí! Hay ${quantityPhrase(n, item)}.`,
    };
  },
};

export const relacionar = {
  id: 'relacionar',
  title: 'Número y cantidad',
  goal: 'Relacionar un número con la cantidad de objetos que representa.',
  levels: { 1: 'Del 1 al 3.', 2: 'Del 1 al 5.', 3: 'Del 1 al 10.' },
  kind: 'choice',
  icon: () =>
    svg(
      `<rect x="8" y="14" width="40" height="72" rx="10" fill="#fff" ${STROKE}/><text x="28" y="66" text-anchor="middle" font-size="46" font-weight="900" fill="#1d6fd6">3</text>
       ${[0, 1, 2].map((i) => `<circle cx="74" cy="${24 + i * 26}" r="10" fill="#e63946" ${STROKE}/>`).join('')}`
    ),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const item = pick(COUNTABLE_ITEMS, rng);
    const n = numberInRange(RANGE[level], rng, Number(previous));
    const others = nearbyNumbers(n, 2, RANGE[level], rng);
    const groupOption = (k) => ({
      key: String(k),
      label: capitalize(quantityPhrase(k, item)),
      html: groupHtml(item.id, k),
    });
    return {
      key: String(n),
      say: `Toca el grupo con ${quantityPhrase(n, item)}.`,
      text: `¿Dónde hay ${n}?`,
      promptHtml: `<div class="prompt-number">${numeralHtml(n)}<span class="prompt-caption">${NUMBER_WORDS[n]}</span></div>`,
      promptLabel: `Número ${n}`,
      options: buildOptions(groupOption(n), others.map(groupOption), rng),
      answer: String(n),
      optionKind: 'group',
      lsec: `numero:${n}`,
      successSay: `¡Sí! Aquí hay ${quantityPhrase(n, item)}.`,
    };
  },
};

export const numeros = {
  id: 'numeros',
  title: 'Encuentra el número',
  goal: 'Reconocer los números escritos (grafía) a partir de su nombre.',
  levels: { 1: 'Del 1 al 5, 3 opciones.', 2: 'Del 1 al 9, 4 opciones.', 3: 'Del 1 al 10, 5 opciones.' },
  kind: 'choice',
  icon: () =>
    svg(
      `<rect x="14" y="10" width="72" height="80" rx="14" fill="#ffd23f" ${STROKE}/><text x="50" y="72" text-anchor="middle" font-size="62" font-weight="900" fill="${INK}">7</text>`
    ),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const range = { 1: [1, 5], 2: [1, 9], 3: [1, 10] }[level];
    const n = numberInRange(range, rng, Number(previous));
    const optionCount = { 1: 3, 2: 4, 3: 5 }[level];
    const others = sample(
      Array.from({ length: range[1] - range[0] + 1 }, (_, i) => range[0] + i).filter((k) => k !== n),
      optionCount - 1,
      rng
    );
    return {
      key: String(n),
      say: `Toca el número ${NUMBER_WORDS[n]}.`,
      text: `Toca el número ${NUMBER_WORDS[n]}`,
      promptHtml: wordPrompt(capitalize(NUMBER_WORDS[n]), icon('ear')),
      promptLabel: `Palabra: ${NUMBER_WORDS[n]}`,
      options: buildOptions(numeralOption(n), others.map(numeralOption), rng),
      answer: String(n),
      optionKind: 'numeral',
      lsec: `numero:${n}`,
      successSay: `¡Sí! Este es el ${NUMBER_WORDS[n]}.`,
    };
  },
};

/** Pictograma de "más" o "menos": dos torres, la indicada lleva una marca. */
export function moreLessSvg(mode) {
  const tower = (x, blocks, marked) =>
    Array.from(
      { length: blocks },
      (_, i) => `<rect x="${x}" y="${82 - (i + 1) * 15}" width="26" height="14" rx="3" fill="${marked ? '#2fa84f' : '#cfc9bf'}" ${STROKE}/>`
    ).join('') +
    (marked
      ? `<circle cx="${x + 13}" cy="${82 - blocks * 15 - 12}" r="9" fill="#ffd23f" ${STROKE}/><path d="M${x + 8} ${82 - blocks * 15 - 12} l4 4 l6 -7" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
      : '');
  return svg(
    `<line x1="6" y1="83" x2="94" y2="83" ${STROKE}/>` +
      tower(16, 4, mode === 'mas') +
      tower(58, 1, mode === 'menos'),
    { className: 'pictogram' }
  );
}

export const comparar = {
  id: 'comparar',
  title: '¿Dónde hay más?',
  goal: 'Comparar cantidades: más y menos.',
  levels: {
    1: 'Grupos del 1 al 5 con diferencia clara. Sólo «más».',
    2: 'Grupos del 1 al 7. Sólo «más».',
    3: 'Grupos del 1 al 10. «Más» y «menos».',
  },
  kind: 'choice',
  icon: () => moreLessSvg('mas'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const [min, max] = { 1: [1, 5], 2: [1, 7], 3: [1, 10] }[level];
    const minDiff = level === 1 ? 2 : 1;
    const mode = level === 3 && rng() < 0.5 ? 'menos' : 'mas';
    let a;
    let b;
    let key;
    do {
      a = randInt(min, max, rng);
      b = randInt(min, max, rng);
      key = `${mode}-${a}-${b}`;
    } while (Math.abs(a - b) < minDiff || key === previous);
    const item = pick(COUNTABLE_ITEMS, rng);
    const winner = (mode === 'mas') === a > b ? 'izquierda' : 'derecha';
    const word = mode === 'mas' ? 'más' : 'menos';
    const question = `¿Dónde hay ${word}?`;
    const [win, lose] = winner === 'izquierda' ? [a, b] : [b, a];
    const side = (sideKey, n) => ({
      key: sideKey,
      label: `Grupo de la ${sideKey}: ${quantityPhrase(n, item)}`,
      html: groupHtml(item.id, n),
    });
    return {
      key,
      say: `${question} Toca el grupo con ${word} ${item.many}.`,
      text: question,
      promptHtml: `<div class="prompt-picture prompt-picture--with-word">${moreLessSvg(mode)}<span class="prompt-caption">${mode === 'mas' ? 'Más' : 'Menos'}</span></div>`,
      promptLabel: mode === 'mas' ? 'Dibujo: la torre más alta' : 'Dibujo: la torre más baja',
      options: [side('izquierda', a), side('derecha', b)],
      answer: winner,
      optionKind: 'group',
      lsec: null,
      successSay: `¡Sí! ${capitalize(quantityPhrase(win, item))} ${win === 1 ? 'es' : 'son'} ${word} que ${quantityPhrase(lose, item)}.`,
    };
  },
};

export const sumar = {
  id: 'sumar',
  title: 'Juntamos',
  goal: 'Resolver sumas visuales sencillas juntando dos grupos.',
  levels: { 1: 'Resultados hasta 3.', 2: 'Resultados hasta 5.', 3: 'Resultados hasta 10.' },
  kind: 'choice',
  icon: () =>
    svg(
      `<circle cx="22" cy="50" r="12" fill="#e63946" ${STROKE}/><text x="44" y="60" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">+</text>
       <circle cx="66" cy="38" r="12" fill="#e63946" ${STROKE}/><circle cx="66" cy="66" r="12" fill="#e63946" ${STROKE}/>`
    ),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const maxSum = { 1: 3, 2: 5, 3: 10 }[level];
    let a;
    let b;
    do {
      a = randInt(1, maxSum - 1, rng);
      b = randInt(1, maxSum - a, rng);
    } while (`${a}+${b}` === previous && maxSum > 2);
    const total = a + b;
    const item = pick(COUNTABLE_ITEMS, rng);
    const optionCount = level === 3 ? 4 : 3;
    const distractors = nearbyNumbers(total, optionCount - 1, [1, maxSum], rng);
    return {
      key: `${a}+${b}`,
      say: `${capitalize(quantityPhrase(a, item))} y ${quantityPhrase(b, item)}. ¿${item.fem ? 'Cuántas' : 'Cuántos'} son en total?`,
      text: `${a} y ${b}, ¿${item.fem ? 'cuántas' : 'cuántos'} son?`,
      promptHtml: `<div class="addition">${groupHtml(item.id, a)}<span class="op" aria-hidden="true">+</span>${groupHtml(item.id, b)}<span class="op" aria-hidden="true">=</span><span class="seq-item seq-item--missing" aria-hidden="true">?</span></div>`,
      promptLabel: `${quantityPhrase(a, item)} más ${quantityPhrase(b, item)}`,
      options: buildOptions(numeralOption(total), distractors.map(numeralOption), rng),
      answer: String(total),
      optionKind: 'numeral',
      lsec: `numero:${total}`,
      successSay: `¡Sí! ${capitalize(NUMBER_WORDS[a])} y ${NUMBER_WORDS[b]} son ${NUMBER_WORDS[total]}.`,
    };
  },
};

export const NUMBER_ACTIVITIES = [contar, relacionar, numeros, comparar, sumar];

export { RANGE };
