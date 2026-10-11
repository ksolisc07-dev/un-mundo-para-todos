/** Mundo 5: Las emociones. */
import { EMOTIONS, SITUATIONS, SCENARIOS, ACTIONS, emotionsForLevel, emotionById } from '../data/emotions.js';
import { capitalize } from '../data/animals.js';
import { faceSvg, situationSvg, actionSvg, KID_COUNT } from '../art/emotions.js';
import { icon } from '../art/icons.js';
import { escapeHtml } from '../core/dom.js';
import { pickAvoiding, sample, shuffle, randInt, defaultRng } from '../core/random.js';
import { buildOptions, wordPrompt } from './helpers.js';

const faceOption = (emotion, kid) => ({
  key: emotion.id,
  label: `Cara de ${emotion.name}`,
  html: faceSvg(emotion.id, kid),
});

function distinctKids(count, rng, avoid = -1) {
  const kids = shuffle(
    Array.from({ length: KID_COUNT }, (_, i) => i).filter((k) => k !== avoid),
    rng
  );
  return Array.from({ length: count }, (_, i) => kids[i % kids.length]);
}

export const iguales = {
  id: 'iguales',
  title: 'Caras iguales',
  goal: 'Reconocer la misma emoción en caras de distintas personas (sin leer ni oír).',
  levels: {
    1: 'Alegría, tristeza y sorpresa (3 opciones).',
    2: 'Se suma el miedo (4 opciones).',
    3: 'Se suma el enojo (5 opciones).',
  },
  kind: 'choice',
  icon: () => faceSvg('alegria', 1),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = emotionsForLevel(level);
    const target = pickAvoiding(pool, pool.find((e) => e.id === previous), rng);
    const promptKid = randInt(0, KID_COUNT - 1, rng);
    const others = pool.filter((e) => e.id !== target.id);
    const kids = distinctKids(pool.length, rng, promptKid);
    return {
      key: target.id,
      say: '¿Quién se siente igual?',
      text: '¿Quién se siente igual?',
      promptHtml: `<div class="prompt-picture">${faceSvg(target.id, promptKid)}</div>`,
      promptLabel: `Cara de ${target.name}`,
      options: buildOptions(
        faceOption(target, kids[0]),
        others.map((e, i) => faceOption(e, kids[(i + 1) % kids.length])),
        rng
      ),
      answer: target.id,
      optionKind: 'picture',
      lsec: `emocion:${target.id}`,
      successSay: `¡Sí! Los dos sienten ${target.name}.`,
    };
  },
};

export const nombrar = {
  id: 'nombrar',
  title: '¿Cómo se siente?',
  goal: 'Nombrar emociones: alegría, tristeza, sorpresa, miedo y enojo.',
  levels: {
    1: 'Alegría, tristeza y sorpresa.',
    2: 'Se suma el miedo.',
    3: 'Se suma el enojo.',
  },
  kind: 'choice',
  icon: () => faceSvg('sorpresa', 2),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = emotionsForLevel(level);
    const target = pickAvoiding(pool, pool.find((e) => e.id === previous), rng);
    const kids = distinctKids(pool.length, rng);
    const options = pool.map((e, i) => faceOption(e, kids[i]));
    return {
      key: target.id,
      say: `¿Quién siente ${target.name}?`,
      text: `¿Quién siente ${target.name}?`,
      promptHtml: wordPrompt(capitalize(target.name), icon('ear')),
      promptLabel: `Palabra: ${target.name}`,
      options: shuffle(options, rng),
      answer: target.id,
      optionKind: 'picture',
      lsec: `emocion:${target.id}`,
      successSay: `¡Sí! Esa cara muestra ${target.name}.`,
    };
  },
};

export const situaciones = {
  id: 'situaciones',
  title: '¿Qué siente?',
  goal: 'Asociar expresiones faciales con situaciones cotidianas.',
  levels: {
    1: 'Situaciones de alegría y tristeza.',
    2: 'Se suman sorpresa y miedo.',
    3: 'Se suma el enojo.',
  },
  kind: 'choice',
  icon: () => situationSvg('regalo'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const allowed = emotionsForLevel(level).map((e) => e.id);
    const levelSituations = SITUATIONS.filter(
      (s) => allowed.includes(s.emotion) && (level > 1 || ['alegria', 'tristeza'].includes(s.emotion))
    );
    const situation = pickAvoiding(levelSituations, levelSituations.find((s) => s.id === previous), rng);
    const target = emotionById(situation.emotion);
    // Nunca se ofrece como distractora una emoción que también podría sentirse.
    const candidates = allowed.filter((id) => id !== target.id && !situation.plausible.includes(id));
    const distractors = sample(candidates, Math.min(level === 1 ? 1 : 2, candidates.length), rng).map(emotionById);
    const kid = randInt(0, KID_COUNT - 1, rng);
    return {
      key: situation.id,
      say: `${situation.text} ¿Cómo se siente?`,
      text: situation.text,
      promptHtml: `<div class="prompt-picture">${situationSvg(situation.id)}</div>`,
      promptLabel: situation.text,
      options: buildOptions(faceOption(target, kid), distractors.map((e) => faceOption(e, kid)), rng),
      answer: target.id,
      optionKind: 'picture',
      lsec: `emocion:${target.id}`,
      successSay: `¡Sí! Siente ${target.name}.`,
    };
  },
};

const WHY = {
  abrazo: 'Un abrazo ayuda a que tu amigo se sienta acompañado.',
  ayudarLevantar: 'Ayudar a los demás es ser un buen compañero.',
  compartir: 'Compartir hace que todos puedan jugar.',
  buscarAdulto: 'Una persona adulta te puede cuidar y calmar.',
  respirar: 'Respirar despacio ayuda a calmar el enojo.',
};

export const acciones = {
  id: 'acciones',
  title: '¿Qué puedes hacer?',
  goal: 'Elegir respuestas amables y seguras ante situaciones cotidianas (empatía y autorregulación).',
  levels: {
    1: 'Situaciones con compañeros, 2 opciones.',
    2: 'Se suman miedo y enojo propios, 3 opciones.',
    3: 'Todas las situaciones, 4 opciones.',
  },
  kind: 'choice',
  icon: () => actionSvg('abrazo'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = SCENARIOS.filter((s) => s.level <= level);
    const scenario = pickAvoiding(pool, pool.find((s) => s.id === previous), rng);
    const actionOption = (id) => ({
      key: id,
      label: ACTIONS[id],
      html: `${actionSvg(id)}<span class="option-text">${escapeHtml(ACTIONS[id])}</span>`,
    });
    const picture = scenario.picture.face
      ? faceSvg(scenario.picture.face, scenario.picture.kid)
      : situationSvg(scenario.picture.situation);
    return {
      key: scenario.id,
      say: `${scenario.text} ¿Qué puedes hacer?`,
      text: scenario.text,
      promptHtml: `<div class="prompt-picture">${picture}</div>`,
      promptLabel: scenario.text,
      options: buildOptions(
        actionOption(scenario.good),
        sample(scenario.bad, level, rng).map(actionOption),
        rng
      ),
      answer: scenario.good,
      optionKind: 'action',
      lsec: null,
      successSay: WHY[scenario.good],
    };
  },
};

export const memoriaEmociones = {
  id: 'memoria',
  title: 'Memoria de emociones',
  goal: 'Memoria visual y reconocimiento de emociones. En el nivel 3 las parejas son la misma emoción en personas distintas.',
  levels: {
    1: '3 parejas de caras iguales.',
    2: '4 parejas de caras iguales.',
    3: '5 parejas: misma emoción, distinta persona.',
  },
  kind: 'memory',
  icon: () => faceSvg('miedo', 0),
  createBoard({ level = 1, rng = defaultRng } = {}) {
    const pairs = { 1: 3, 2: 4, 3: 5 }[level];
    const emotions = sample(EMOTIONS, pairs, rng);
    const cards = emotions.flatMap((e) => {
      const kidA = randInt(0, KID_COUNT - 1, rng);
      const kidB = level === 3 ? (kidA + 1 + randInt(0, KID_COUNT - 2, rng)) % KID_COUNT : kidA;
      const label = capitalize(e.name);
      return [
        { key: e.id, label, html: faceSvg(e.id, kidA) },
        { key: e.id, label, html: faceSvg(e.id, kidB) },
      ];
    });
    return {
      pairs,
      cards: shuffle(cards, rng).map((card, i) => ({ ...card, index: i })),
      say: 'Busca las parejas que sienten lo mismo.',
      text: 'Busca las parejas',
    };
  },
};

export const EMOTION_ACTIVITIES = [iguales, nombrar, situaciones, acciones, memoriaEmociones];

