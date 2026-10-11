/** Mundo 1: Los animales. */
import { ANIMALS, EASY_ANIMALS, TRAITS, animalById, capitalize } from '../data/animals.js';
import { animalSvg } from '../art/animals.js';
import { traitSvg } from '../art/scenes.js';
import { icon } from '../art/icons.js';
import { sample, pickAvoiding, defaultRng } from '../core/random.js';
import { escapeHtml } from '../core/dom.js';
import { INK, STROKE, svg } from '../art/svg.js';
import { buildOptions, wordPrompt, OPTIONS_BY_LEVEL } from './helpers.js';

const pictureOption = (animal, className = '') => ({
  key: animal.id,
  label: capitalize(animal.name),
  html: animalSvg(animal.id, className),
});

function poolFor(level) {
  return level === 1 ? EASY_ANIMALS.map(animalById) : ANIMALS;
}

function distractorsFor(target, pool, count, rng, exclude = () => false) {
  const candidates = pool.filter((a) => a.id !== target.id && !exclude(a));
  return sample(candidates, Math.min(count, candidates.length), rng);
}

export const reconocer = {
  id: 'reconocer',
  title: '¿Quién es?',
  goal: 'Reconocer animales por su nombre.',
  levels: {
    1: '3 animales de la granja y la casa.',
    2: '4 animales, incluidos los de la selva y el agua.',
    3: '6 animales a la vez.',
  },
  kind: 'choice',
  icon: () => animalSvg('perro'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = poolFor(level);
    const target = pickAvoiding(pool, pool.find((a) => a.id === previous), rng);
    const distractors = distractorsFor(target, pool, OPTIONS_BY_LEVEL[level] - 1, rng);
    return {
      key: target.id,
      say: `Toca ${target.article} ${target.name}.`,
      text: `¿Dónde está ${target.article} ${target.name}?`,
      promptHtml: wordPrompt(capitalize(target.name), icon('ear')),
      promptLabel: `Palabra: ${target.name}`,
      options: buildOptions(pictureOption(target), distractors.map((a) => pictureOption(a)), rng),
      answer: target.id,
      optionKind: 'picture',
      lsec: `animal:${target.id}`,
      successSay: `¡Sí! Es ${target.article} ${target.name}.`,
    };
  },
};

export const sonidos = {
  id: 'sonidos',
  title: '¿Quién hace así?',
  goal: 'Asociar cada animal con su sonido (onomatopeya hablada y escrita).',
  levels: {
    1: '3 animales de la granja.',
    2: '4 animales.',
    3: '6 animales.',
  },
  kind: 'choice',
  icon: () => animalSvg('vaca'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = poolFor(level).filter((a) => a.sound);
    const target = pickAvoiding(pool, pool.find((a) => a.id === previous), rng);
    const count = Math.min(OPTIONS_BY_LEVEL[level], pool.length) - 1;
    const distractors = distractorsFor(target, pool, count, rng);
    const sound = capitalize(target.sound);
    return {
      key: target.id,
      say: `${sound}. ¿Quién hace ${target.sound}?`,
      text: `¿Quién hace «${target.sound}»?`,
      promptHtml: `<div class="speech-bubble">${icon('speaker')}<span>¡${escapeHtml(sound)}!</span></div>`,
      promptLabel: `Sonido: ${target.sound}`,
      options: buildOptions(pictureOption(target), distractors.map((a) => pictureOption(a)), rng),
      answer: target.id,
      optionKind: 'picture',
      lsec: null,
      successSay: `¡Muy bien! ${capitalize(target.article)} ${target.name} hace ${target.sound}.`,
    };
  },
};

export const sombras = {
  id: 'sombras',
  title: '¿De quién es la sombra?',
  goal: 'Encontrar el animal que corresponde a una instrucción visual (silueta), sin necesidad de leer ni oír.',
  levels: {
    1: '3 animales con siluetas muy distintas.',
    2: '4 animales.',
    3: '6 animales, algunas siluetas parecidas.',
  },
  kind: 'choice',
  icon: () => animalSvg('gato', 'silhouette'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = poolFor(level);
    const target = pickAvoiding(pool, pool.find((a) => a.id === previous), rng);
    const distractors = distractorsFor(target, pool, OPTIONS_BY_LEVEL[level] - 1, rng);
    return {
      key: target.id,
      say: '¿De quién es esta sombra?',
      text: '¿De quién es esta sombra?',
      promptHtml: `<div class="prompt-picture">${animalSvg(target.id, 'silhouette')}</div>`,
      promptLabel: 'Sombra de un animal',
      successPromptHtml: `<div class="prompt-picture">${animalSvg(target.id, 'reveal')}</div>`,
      options: buildOptions(pictureOption(target), distractors.map((a) => pictureOption(a)), rng),
      answer: target.id,
      optionKind: 'picture',
      lsec: `animal:${target.id}`,
      successSay: `¡Sí! Es ${target.article} ${target.name}.`,
    };
  },
};

export const rasgos = {
  id: 'rasgos',
  title: '¿Quién tiene…?',
  goal: 'Identificar animales por sus características (plumas, lana, trompa…).',
  levels: {
    1: '3 animales.',
    2: '4 animales.',
    3: '5 animales.',
  },
  kind: 'choice',
  icon: () => traitSvg('plumas'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const trait = pickAvoiding(TRAITS, TRAITS.find((t) => t.id === previous), rng);
    const withTrait = ANIMALS.filter((a) => a.traits.includes(trait.id));
    const target = withTrait[Math.floor(rng() * withTrait.length)];
    const count = { 1: 2, 2: 3, 3: 4 }[level];
    const distractors = distractorsFor(target, ANIMALS, count, rng, (a) => a.traits.includes(trait.id));
    return {
      key: trait.id,
      say: trait.question,
      text: trait.question,
      promptHtml: `<div class="prompt-picture prompt-picture--trait">${traitSvg(trait.id)}</div>`,
      promptLabel: `Dibujo de ${trait.name}`,
      options: buildOptions(pictureOption(target), distractors.map((a) => pictureOption(a)), rng),
      answer: target.id,
      optionKind: 'picture',
      lsec: `animal:${target.id}`,
      successSay: `¡Sí! ${capitalize(target.article)} ${target.name} tiene ${trait.name}.`,
    };
  },
};

export const memoria = {
  id: 'memoria',
  title: 'Memoria de animales',
  goal: 'Memoria visual: encontrar las parejas de animales iguales.',
  levels: {
    1: '3 parejas (6 cartas).',
    2: '4 parejas (8 cartas).',
    3: '6 parejas (12 cartas).',
  },
  kind: 'memory',
  icon: () =>
    svg(
      `<g transform="rotate(-10 30 52)"><rect x="6" y="20" width="44" height="60" rx="8" fill="#ffcf5a" ${STROKE}/>
       <text x="28" y="60" text-anchor="middle" font-size="30" font-weight="900" fill="${INK}">?</text></g>
       <g transform="rotate(8 70 50)"><rect x="48" y="18" width="44" height="60" rx="8" fill="#fffdf8" ${STROKE}/>
       <svg x="50" y="28" width="40" height="40" viewBox="0 0 100 100">${animalSvg('pato').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></g>`
    ),
  createBoard({ level = 1, rng = defaultRng } = {}) {
    const pairs = { 1: 3, 2: 4, 3: 6 }[level];
    const animals = sample(poolFor(level === 1 ? 1 : 2), pairs, rng);
    const cards = animals.flatMap((a) => [
      { key: a.id, label: capitalize(a.name), html: animalSvg(a.id) },
      { key: a.id, label: capitalize(a.name), html: animalSvg(a.id) },
    ]);
    return {
      pairs,
      cards: sample(cards, cards.length, rng).map((card, i) => ({ ...card, index: i })),
      say: 'Busca las parejas de animales iguales.',
      text: 'Busca las parejas iguales',
    };
  },
};

export const ANIMAL_ACTIVITIES = [reconocer, sonidos, sombras, rasgos, memoria];
