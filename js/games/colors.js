/** Mundo 2: Los colores y las formas. */
import {
  COLORS_BY_LEVEL,
  COLOR_OBJECTS,
  SHAPES_BY_LEVEL,
  CONFUSABLE_SHAPES,
  colorById,
  colorAdjective,
  shapeById,
} from '../data/colors.js';
import { shapeSvg, paintPotSvg, binSvg, shapeInner } from '../art/shapes.js';
import { objectSvg } from '../art/objects.js';
import { escapeHtml } from '../core/dom.js';
import { sample, pick, pickAvoiding, shuffle, randInt, defaultRng } from '../core/random.js';
import { buildOptions } from './helpers.js';
import { capitalize } from '../data/animals.js';

const swatchOption = (color) => ({
  key: color.id,
  label: capitalize(color.name),
  html: `${paintPotSvg(color.hex)}<span class="color-name">${escapeHtml(color.name)}</span>`,
});

function splashHtml(hex) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="art splash" aria-hidden="true" focusable="false">
    <path d="M50 8 Q62 22 74 14 Q76 32 92 36 Q80 48 90 64 Q72 64 70 84 Q58 74 46 92 Q40 74 22 80 Q26 62 8 54 Q24 44 14 28 Q32 30 36 12 Q44 22 50 8 Z" fill="${hex}" stroke="#2d2a32" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
}

function isConfusable(a, b) {
  return CONFUSABLE_SHAPES.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

/** Elige `count` figuras distintas sin parejas confusas entre ellas. */
export function pickShapeSet(target, pool, count, rng) {
  const chosen = [target];
  for (const id of shuffle(pool, rng)) {
    if (chosen.length >= count) break;
    if (!chosen.includes(id) && chosen.every((c) => !isConfusable(c, id))) chosen.push(id);
  }
  return chosen;
}

export const colores = {
  id: 'colores',
  title: 'Toca el color',
  goal: 'Identificar y nombrar colores.',
  levels: {
    1: 'Rojo, azul, amarillo y verde (3 opciones).',
    2: 'Se suman naranja y morado (4 opciones).',
    3: 'Ocho colores, incluidos rosado y café (5 opciones).',
  },
  kind: 'choice',
  icon: () => paintPotSvg('#e63946'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const ids = COLORS_BY_LEVEL[level];
    const target = colorById(pickAvoiding(ids, previous, rng));
    const count = { 1: 3, 2: 4, 3: 5 }[level];
    const distractors = sample(
      ids.filter((id) => id !== target.id),
      count - 1,
      rng
    ).map(colorById);
    return {
      key: target.id,
      say: `Toca el color ${target.name}.`,
      text: `Toca el color ${target.name}`,
      promptHtml: `<div class="prompt-picture prompt-picture--with-word">${splashHtml(target.hex)}<span class="prompt-caption">${escapeHtml(capitalize(target.name))}</span></div>`,
      promptLabel: `Mancha de color ${target.name}`,
      options: buildOptions(swatchOption(target), distractors.map(swatchOption), rng),
      answer: target.id,
      optionKind: 'swatch',
      lsec: `color:${target.id}`,
      successSay: `¡Sí! Este es el ${target.name}.`,
    };
  },
};

export const objetos = {
  id: 'objetos',
  title: '¿De qué color es?',
  goal: 'Asociar objetos cotidianos con su color. Al acertar, el objeto se pinta.',
  levels: {
    1: 'Frutas y elementos de la naturaleza con colores básicos (3 opciones).',
    2: 'Más objetos y colores (4 opciones).',
    3: 'Todos los objetos y colores (5 opciones).',
  },
  kind: 'choice',
  icon: () => objectSvg('fresa', '#e63946'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const objects = COLOR_OBJECTS.filter((o) => o.level <= level);
    const target = pickAvoiding(objects, objects.find((o) => o.id === previous), rng);
    const color = colorById(target.color);
    const count = { 1: 3, 2: 4, 3: 5 }[level];
    const distractors = sample(
      COLORS_BY_LEVEL[level].filter((id) => id !== color.id),
      count - 1,
      rng
    ).map(colorById);
    return {
      key: target.id,
      say: `¿De qué color es ${target.name}?`,
      text: `¿De qué color es ${target.name}?`,
      promptHtml: `<div class="prompt-picture">${objectSvg(target.id)}</div>`,
      promptLabel: `Dibujo sin pintar: ${target.name}`,
      successPromptHtml: `<div class="prompt-picture">${objectSvg(target.id, color.hex, 'reveal')}</div>`,
      options: buildOptions(swatchOption(color), distractors.map(swatchOption), rng),
      answer: color.id,
      optionKind: 'swatch',
      lsec: `color:${color.id}`,
      successSay: `¡Sí! ${capitalize(target.name)} es ${colorAdjective(color, target.name.startsWith('la '))}.`,
    };
  },
};

const OPTION_PALETTE = ['#e63946', '#1d6fd6', '#ffd23f', '#2fa84f', '#ff8c1a', '#8e44ad', '#ff7eb6'];

export const figuras = {
  id: 'figuras',
  title: 'Encuentra la figura',
  goal: 'Reconocer figuras geométricas aunque cambien de color, tamaño o posición.',
  levels: {
    1: 'Círculo, cuadrado y triángulo.',
    2: 'Se suman rectángulo, estrella y corazón; cambian de tamaño.',
    3: 'Ocho figuras, que además aparecen giradas.',
  },
  kind: 'choice',
  icon: () => shapeSvg('triangulo', { fill: '#ffd23f' }),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = SHAPES_BY_LEVEL[level];
    const targetId = pickAvoiding(pool, previous, rng);
    const target = shapeById(targetId);
    const count = { 1: 3, 2: 4, 3: 5 }[level];
    const ids = pickShapeSet(targetId, pool, count, rng);
    const colors = shuffle(OPTION_PALETTE, rng);
    const options = ids.map((id, i) => {
      const scale = level === 1 ? 0.9 : 0.6 + rng() * 0.35;
      const rotate = level === 3 && !['circulo'].includes(id) ? randInt(-35, 35, rng) : 0;
      return {
        key: id,
        label: capitalize(shapeById(id).name),
        html: shapeSvg(id, { fill: colors[i % colors.length], scale, rotate }),
      };
    });
    return {
      key: targetId,
      say: `Busca ${target.article} ${target.name}.`,
      text: `Busca ${target.article} ${target.name}`,
      promptHtml: `<div class="prompt-picture prompt-picture--with-word">${shapeSvg(targetId, { outline: true })}<span class="prompt-caption">${escapeHtml(capitalize(target.name))}</span></div>`,
      promptLabel: `Contorno de ${target.article} ${target.name}`,
      options: shuffle(options, rng),
      answer: targetId,
      optionKind: 'picture',
      lsec: null,
      successSay: `¡Sí! Es ${target.article} ${target.name}.`,
    };
  },
};

export const clasificar = {
  id: 'clasificar',
  title: 'Ordena en cajas',
  goal: 'Clasificar objetos según un criterio: la forma o el color.',
  levels: {
    1: 'Por forma, 2 cajas.',
    2: 'Por forma, 3 cajas.',
    3: 'Por forma o por color, 3 cajas.',
  },
  kind: 'choice',
  icon: () => binSvg(shapeInner('circulo', '#1d6fd6')),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    // Se reintenta si por azar sale exactamente la misma ronda que la anterior.
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const round = this.buildRound(level, rng, previous);
      if (round.key !== previous) return round;
    }
    return this.buildRound(level, rng, null);
  },
  buildRound(level, rng, previous) {
    const byColor = level === 3 && rng() < 0.5;
    const binCount = level === 1 ? 2 : 3;

    if (byColor) {
      const colorIds = sample(COLORS_BY_LEVEL[2], binCount, rng);
      const targetColor = colorById(pick(colorIds, rng));
      const itemShape = pick(SHAPES_BY_LEVEL[2], rng);
      const options = colorIds.map((id) => {
        const c = colorById(id);
        return {
          key: id,
          label: `Caja de color ${c.name}`,
          html: `${binSvg(`<circle cx="50" cy="50" r="40" fill="${c.hex}" stroke="#2d2a32" stroke-width="4"/>`)}<span class="color-name">${escapeHtml(c.name)}</span>`,
        };
      });
      return {
        key: `color-${targetColor.id}-${itemShape}`,
        say: '¿En qué caja va? Mira el color.',
        text: '¿En qué caja va? (por color)',
        promptHtml: `<div class="prompt-picture prompt-picture--with-word"><span class="criterion">Color</span>${shapeSvg(itemShape, { fill: targetColor.hex, scale: 0.8 })}</div>`,
        promptLabel: `${capitalize(shapeById(itemShape).name)} de color ${targetColor.name}`,
        options,
        answer: targetColor.id,
        optionKind: 'bin',
        lsec: `color:${targetColor.id}`,
        successSay: `¡Sí! Va en la caja ${targetColor.name}.`,
      };
    }

    const pool = SHAPES_BY_LEVEL[level === 1 ? 1 : 2];
    const targetId = pickAvoiding(pool, previous, rng);
    const binIds = shuffle(pickShapeSet(targetId, pool, binCount, rng), rng);
    const fill = pick(OPTION_PALETTE, rng);
    const target = shapeById(targetId);
    const options = binIds.map((id) => ({
      key: id,
      label: `Caja de ${shapeById(id).plural}`,
      html: binSvg(shapeInner(id, '#ffffff')),
    }));
    return {
      key: targetId,
      say: '¿En qué caja va? Mira la forma.',
      text: '¿En qué caja va? (por forma)',
      promptHtml: `<div class="prompt-picture prompt-picture--with-word"><span class="criterion">Forma</span>${shapeSvg(targetId, { fill, scale: 0.6 + rng() * 0.3 })}</div>`,
      promptLabel: `${target.article === 'la' ? 'Una' : 'Un'} ${target.name}`,
      options,
      answer: targetId,
      optionKind: 'bin',
      lsec: null,
      successSay: `¡Sí! Va con ${target.article === 'la' ? 'las' : 'los'} ${target.plural}.`,
    };
  },
};

const PATTERNS = {
  1: ['AB'],
  2: ['AB', 'AAB', 'ABB'],
  3: ['ABC', 'AABB', 'ABB', 'AAB'],
};

export const secuencias = {
  id: 'secuencias',
  title: '¿Qué sigue?',
  goal: 'Completar secuencias visuales (patrones AB, AAB, ABC…).',
  levels: {
    1: 'Patrones AB con forma y color distintos.',
    2: 'Patrones AB, AAB y ABB.',
    3: 'Patrones ABC y AABB.',
  },
  kind: 'choice',
  icon: () => shapeSvg('estrella', { fill: '#ff8c1a' }),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pattern = pick(PATTERNS[level], rng);
    const unitCount = new Set(pattern).size;
    const shapeIds = pickShapeSet(pick(SHAPES_BY_LEVEL[2], rng), SHAPES_BY_LEVEL[2], unitCount + 1, rng);
    const colorIds = sample(COLORS_BY_LEVEL[2], unitCount + 1, rng);
    // Unidades del patrón + 1 distractora que no aparece en la secuencia.
    const units = shapeIds.map((shape, i) => ({ key: `${shape}-${colorIds[i]}`, shape, color: colorById(colorIds[i]) }));
    const letters = [...new Set(pattern)];
    const unitFor = (letter) => units[letters.indexOf(letter)];

    const visible = pattern.length * 2 + randInt(0, pattern.length - 1, rng);
    const sequence = Array.from({ length: visible }, (_, i) => unitFor(pattern[i % pattern.length]));
    const answer = unitFor(pattern[visible % pattern.length]);
    const choices = level === 1 ? units.slice(0, unitCount) : units;

    const cell = (u) => `<span class="seq-item">${shapeSvg(u.shape, { fill: u.color.hex, scale: 0.85 })}</span>`;
    const describe = (u) => {
      const shape = shapeById(u.shape);
      return `${shape.name} ${colorAdjective(u.color, shape.article === 'la')}`;
    };
    const roundKey = `${pattern}-${sequence.map((u) => u.key).join('.')}`;
    return {
      key: roundKey === previous ? `${roundKey}*` : roundKey,
      say: '¿Qué sigue?',
      text: '¿Qué sigue en la fila?',
      promptHtml: `<div class="sequence">${sequence.map(cell).join('')}<span class="seq-item seq-item--missing" aria-hidden="true">?</span></div>`,
      promptLabel: `Fila: ${sequence.map(describe).join(', ')}, y falta uno`,
      options: shuffle(
        choices.map((u) => ({
          key: u.key,
          label: capitalize(describe(u)),
          html: shapeSvg(u.shape, { fill: u.color.hex, scale: 0.85 }),
        })),
        rng
      ),
      answer: answer.key,
      optionKind: 'picture',
      lsec: null,
      successSay: `¡Sí! Sigue ${shapeById(answer.shape).article} ${describe(answer)}.`,
    };
  },
};

export const COLOR_ACTIVITIES = [colores, objetos, figuras, clasificar, secuencias];
