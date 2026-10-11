/** Mundo 4: Las letras (inicio de la alfabetización). */
import { WORDS, VOWELS, VOWEL_EXAMPLES, SPELL_WORDS, initialOf, wordById } from '../data/words.js';
import { capitalize } from '../data/animals.js';
import { wordPictureSvg } from '../art/words.js';
import { INK, STROKE, svg } from '../art/svg.js';
import { escapeHtml } from '../core/dom.js';
import { pick, pickAvoiding, sample, shuffle, defaultRng } from '../core/random.js';
import { buildOptions } from './helpers.js';

const letterHtml = (letter) => `<span class="letter" aria-hidden="true">${escapeHtml(letter)}</span>`;
const letterOption = (letter, { upper = true } = {}) => ({
  key: letter,
  label: `Letra ${upper ? letter.toUpperCase() : letter} ${upper ? 'mayúscula' : 'minúscula'}`,
  html: letterHtml(upper ? letter.toUpperCase() : letter),
});
const pictureOption = (w) => ({ key: w.id, label: capitalize(w.word), html: wordPictureSvg(w.id) });
const picturePrompt = (id) => `<div class="prompt-picture">${wordPictureSvg(id)}</div>`;

const letterIcon = (a, b, colorA, colorB) =>
  svg(
    `<rect x="6" y="20" width="44" height="56" rx="10" fill="${colorA}" ${STROKE}/>
     <text x="28" y="62" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" stroke="${INK}" stroke-width="1.5">${a}</text>
     <rect x="50" y="26" width="44" height="56" rx="10" fill="${colorB}" ${STROKE}/>
     <text x="72" y="68" text-anchor="middle" font-size="40" font-weight="900" fill="#fff" stroke="${INK}" stroke-width="1.5">${b}</text>`
  );

export const vocales = {
  id: 'vocales',
  title: 'Las vocales',
  goal: 'Reconocer las vocales mayúsculas y minúsculas y su sonido.',
  levels: {
    1: 'Encontrar la misma vocal (mayúsculas, 3 opciones).',
    2: 'Unir mayúscula con minúscula (5 opciones).',
    3: 'Elegir la vocal con la que empieza un dibujo (5 opciones).',
  },
  kind: 'choice',
  icon: () => letterIcon('A', 'e', '#b388eb', '#ff7eb6'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const vowel = pickAvoiding(VOWELS, previous, rng);
    const example = wordById(VOWEL_EXAMPLES[vowel]);
    const V = vowel.toUpperCase();
    if (level === 3) {
      return {
        key: vowel,
        say: `¿Con qué vocal empieza ${example.word}?`,
        text: `¿Con qué vocal empieza «${example.word}»?`,
        promptHtml: picturePrompt(example.id),
        promptLabel: `Dibujo: ${example.word}`,
        options: shuffle(VOWELS.map((v) => letterOption(v, { upper: false })), rng),
        answer: vowel,
        optionKind: 'letter',
        lsec: `letra:${vowel}`,
        successSay: `¡Sí! ${capitalize(example.word)} empieza con ${vowel}.`,
      };
    }
    const upper = level === 1;
    const others = sample(
      VOWELS.filter((v) => v !== vowel),
      level === 1 ? 2 : 4,
      rng
    );
    return {
      key: vowel,
      say: upper ? `Toca la letra ${vowel}.` : `Busca la ${vowel} minúscula.`,
      text: upper ? `Busca la letra ${V}` : `Busca la ${V} minúscula`,
      promptHtml: `<div class="prompt-number">${letterHtml(V)}<span class="prompt-caption">${V} de ${escapeHtml(example.word)}</span></div>`,
      promptLabel: `Letra ${V}, de ${example.word}`,
      options: buildOptions(
        letterOption(vowel, { upper }),
        others.map((v) => letterOption(v, { upper })),
        rng
      ),
      answer: vowel,
      optionKind: 'letter',
      lsec: `letra:${vowel}`,
      successSay: `¡Sí! Es la ${vowel}, de ${example.word}.`,
    };
  },
};

const INITIAL_POOLS = {
  1: WORDS.filter((w) => VOWELS.includes(initialOf(w.word))),
  2: WORDS.filter((w) => [...VOWELS, 'p', 'g', 'm', 's', 't', 'l', 'f'].includes(initialOf(w.word))),
  3: WORDS,
};

export const inicial = {
  id: 'inicial',
  title: '¿Con qué letra empieza?',
  goal: 'Asociar imágenes con la letra inicial de su nombre.',
  levels: {
    1: 'Palabras que empiezan con vocal (3 opciones).',
    2: 'Se suman P, G, M, S, T, L y F (3 opciones).',
    3: 'Todas las palabras, incluidas R, V, N y H (4 opciones).',
  },
  kind: 'choice',
  icon: () => letterIcon('P', 'G', '#5aa9e6', '#2fa84f'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const pool = INITIAL_POOLS[level];
    const target = pickAvoiding(pool, pool.find((w) => w.id === previous), rng);
    const letter = initialOf(target.word);
    const letters = [...new Set(pool.map((w) => initialOf(w.word)))].filter((l) => l !== letter);
    const distractors = sample(letters, level === 3 ? 3 : 2, rng);
    return {
      key: target.id,
      say: `¿Con qué letra empieza ${target.word}?`,
      text: `¿Con qué letra empieza «${target.word}»?`,
      promptHtml: picturePrompt(target.id),
      promptLabel: `Dibujo: ${target.word}`,
      options: buildOptions(letterOption(letter), distractors.map((l) => letterOption(l)), rng),
      answer: letter,
      optionKind: 'letter',
      lsec: `letra:${letter}`,
      successSay: `¡Sí! ${capitalize(target.word)} empieza con ${letter.toUpperCase()}.`,
    };
  },
};

const SOUND_WORDS = WORDS.filter((w) => w.sound);

export const sonidos = {
  id: 'sonidos',
  title: 'Empieza igual',
  goal: 'Conciencia fonológica: identificar palabras con el mismo sonido inicial.',
  levels: { 1: '2 dibujos para elegir.', 2: '3 dibujos.', 3: '4 dibujos.' },
  kind: 'choice',
  icon: () =>
    svg(
      `<svg x="0" y="20" width="50" height="50" viewBox="0 0 100 100">${wordPictureSvg('sol').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>
       <svg x="50" y="20" width="50" height="50" viewBox="0 0 100 100">${wordPictureSvg('sandia').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>
       <text x="50" y="94" text-anchor="middle" font-size="18" font-weight="900" fill="${INK}">s… s…</text>`
    ),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const target = pickAvoiding(SOUND_WORDS, SOUND_WORDS.find((w) => w.id === previous), rng);
    const match = pick(
      SOUND_WORDS.filter((w) => w.sound === target.sound && w.id !== target.id),
      rng
    );
    const otherSounds = shuffle([...new Set(SOUND_WORDS.map((w) => w.sound))].filter((s) => s !== target.sound), rng);
    const distractors = otherSounds
      .slice(0, level)
      .map((s) => pick(SOUND_WORDS.filter((w) => w.sound === s), rng));
    return {
      key: target.id,
      say: `${capitalize(target.word)}. ¿Cuál empieza igual que ${target.word}?`,
      text: `¿Cuál empieza igual que «${target.word}»?`,
      promptHtml: `<div class="prompt-picture prompt-picture--with-word">${wordPictureSvg(target.id)}<span class="prompt-caption">${escapeHtml(target.word)}</span></div>`,
      promptLabel: `Dibujo: ${target.word}`,
      options: buildOptions(pictureOption(match), distractors.map(pictureOption), rng),
      answer: match.id,
      optionKind: 'picture',
      lsec: null,
      successSay: `¡Sí! ${capitalize(target.word)} y ${match.word} empiezan igual.`,
    };
  },
};

export const palabras = {
  id: 'palabras',
  title: 'Forma la palabra',
  goal: 'Construir palabras sencillas letra por letra.',
  levels: {
    1: 'Palabras de 3 letras, sólo con sus letras.',
    2: 'Palabras de 4 letras y 1 letra de más.',
    3: 'Palabras de 5 a 7 letras y 2 letras de más.',
  },
  kind: 'spell',
  icon: () => letterIcon('s', 'ol', '#ffb703', '#ff8c1a'),
  /** Devuelve una palabra para armar con fichas de letras. */
  createWord({ level = 1, rng = defaultRng, previous } = {}) {
    const id = pickAvoiding(SPELL_WORDS[level], previous, rng);
    const { word } = wordById(id);
    const extraCount = level - 1;
    const alphabet = 'abcdefgilmnoprstuv'.split('').filter((l) => !word.includes(l));
    const letters = [...word.split(''), ...sample(alphabet, extraCount, rng)];
    return {
      key: id,
      word,
      say: `Forma la palabra ${word}.`,
      text: `Forma la palabra «${word}»`,
      pictureHtml: picturePrompt(id),
      tiles: shuffle(
        letters.map((letter, i) => ({ key: `t${i}`, letter })),
        rng
      ),
      lsec: null,
      successSay: `¡Muy bien! Formaste ${word}.`,
    };
  },
};

export const leer = {
  id: 'leer',
  title: '¿Qué dice?',
  goal: 'Primeras lecturas: unir un dibujo con su palabra escrita.',
  levels: {
    1: 'Palabras que empiezan con letras distintas (3 opciones).',
    2: 'Palabras al azar (3 opciones).',
    3: 'Palabras parecidas que empiezan igual (4 opciones).',
  },
  kind: 'choice',
  icon: () =>
    svg(
      `<rect x="8" y="30" width="84" height="40" rx="10" fill="#fff" ${STROKE}/>
       <text x="50" y="60" text-anchor="middle" font-size="26" font-weight="900" fill="${INK}">pato</text>`
    ),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    const target = pickAvoiding(WORDS, WORDS.find((w) => w.id === previous), rng);
    const initial = initialOf(target.word);
    let pool = WORDS.filter((w) => w.id !== target.id);
    if (level === 1) {
      // Distintas iniciales entre sí y con la respuesta.
      const used = new Set([initial]);
      pool = shuffle(pool, rng).filter((w) => {
        const i = initialOf(w.word);
        if (used.has(i)) return false;
        used.add(i);
        return true;
      });
    }
    let distractors;
    if (level === 3) {
      const same = shuffle(
        pool.filter((w) => initialOf(w.word) === initial),
        rng
      );
      const rest = shuffle(
        pool.filter((w) => initialOf(w.word) !== initial),
        rng
      );
      distractors = [...same, ...rest].slice(0, 3);
    } else {
      distractors = sample(pool, 2, rng);
    }
    const wordOption = (w) => ({ key: w.id, label: w.word, html: `<span class="word">${escapeHtml(w.word)}</span>` });
    return {
      key: target.id,
      say: '¿Qué dice? Busca el nombre del dibujo.',
      text: '¿Cuál es su nombre?',
      promptHtml: picturePrompt(target.id),
      promptLabel: `Dibujo: ${target.word}`,
      options: buildOptions(wordOption(target), distractors.map(wordOption), rng),
      answer: target.id,
      optionKind: 'word',
      lsec: null,
      successSay: `¡Sí! Dice ${target.word}.`,
    };
  },
};

export const LETTER_ACTIVITIES = [vocales, inicial, sonidos, palabras, leer];
