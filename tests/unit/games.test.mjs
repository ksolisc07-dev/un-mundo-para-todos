import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng } from '../../js/core/random.js';
import { ACTIVITIES_BY_WORLD, allActivityKeys, getActivity } from '../../js/games/registry.js';
import { WORLDS } from '../../js/data/worlds.js';
import { ANIMALS } from '../../js/data/animals.js';
import { COLOR_OBJECTS, CONFUSABLE_SHAPES } from '../../js/data/colors.js';
import { LSEC_ENTRIES } from '../../js/data/lsec.js';

const ROUNDS = 300;
const LEVELS = [1, 2, 3];
const lsecConcepts = new Set(LSEC_ENTRIES.map((e) => e.concept));

/** Genera muchas rondas seguidas, como las jugaría una niña o un niño. */
function playRounds(activity, level, seed = 1, n = ROUNDS) {
  const rng = createRng(seed + level * 1000);
  const rounds = [];
  let previous;
  for (let i = 0; i < n; i += 1) {
    const round = activity.createRound({ level, rng, previous });
    rounds.push(round);
    previous = round.key;
  }
  return rounds;
}

const choiceActivities = Object.entries(ACTIVITIES_BY_WORLD).flatMap(([world, list]) =>
  list.filter((a) => a.kind === 'choice').map((a) => [world, a])
);

test('cada mundo jugable tiene 5 actividades y los demás están marcados como próximamente', () => {
  for (const world of WORLDS) {
    const count = (ACTIVITIES_BY_WORLD[world.id] || []).length;
    if (world.status === 'ready') assert.equal(count, 5, world.id);
    else {
      assert.equal(world.status, 'soon');
      assert.equal(count, 0, `${world.id} no debe tener juegos falsos`);
      assert.ok(world.planned.length > 0);
    }
  }
  assert.equal(allActivityKeys().length, 15);
});

test('todas las actividades documentan su objetivo y sus 3 niveles', () => {
  for (const list of Object.values(ACTIVITIES_BY_WORLD)) {
    for (const a of list) {
      assert.ok(a.title && a.goal, a.id);
      for (const l of LEVELS) assert.ok(a.levels[l], `${a.id} nivel ${l}`);
      assert.match(a.icon(), /^<svg/);
    }
  }
});

for (const [world, activity] of choiceActivities) {
  for (const level of LEVELS) {
    test(`${world}/${activity.id} nivel ${level}: rondas válidas`, () => {
      const rounds = playRounds(activity, level);
      rounds.forEach((r, i) => {
        const keys = r.options.map((o) => o.key);
        assert.equal(new Set(keys).size, keys.length, 'opciones duplicadas');
        assert.equal(keys.filter((k) => k === r.answer).length, 1, 'la respuesta debe aparecer una vez');
        assert.ok(r.options.length >= 2, 'al menos 2 opciones');
        assert.ok(r.say && r.text && r.successSay && r.promptHtml && r.promptLabel, 'textos completos');
        for (const o of r.options) {
          assert.ok(o.label && o.label.trim(), 'cada opción tiene nombre accesible');
          assert.match(o.html, /<svg|class="numeral"/);
        }
        if (r.lsec) assert.ok(lsecConcepts.has(r.lsec), `concepto LSEC desconocido: ${r.lsec}`);
        if (i > 0) assert.notEqual(r.key, rounds[i - 1].key, 'no repetir la ronda anterior');
        assert.doesNotMatch(r.say + r.text + r.successSay, /undefined|NaN|null/);
      });
      // Variedad: con muchas rondas deben aparecer varias preguntas distintas.
      assert.ok(new Set(rounds.map((r) => r.key)).size >= 2);
    });
  }
}

test('el número de opciones crece con el nivel', () => {
  for (const [, activity] of choiceActivities) {
    const counts = LEVELS.map((l) => playRounds(activity, l, 5, 1)[0].options.length);
    assert.ok(counts[0] <= counts[1] && counts[1] <= counts[2], `${activity.id}: ${counts}`);
  }
});

test('¿Quién tiene…?: ningún distractor tiene el rasgo preguntado', () => {
  const rasgos = getActivity('animales', 'rasgos');
  for (const level of LEVELS) {
    for (const r of playRounds(rasgos, level)) {
      for (const o of r.options) {
        const animal = ANIMALS.find((a) => a.id === o.key);
        assert.equal(animal.traits.includes(r.key), o.key === r.answer, `${r.key} / ${o.key}`);
      }
    }
  }
});

test('¿Quién hace así?: sólo usa animales con sonido', () => {
  const sonidos = getActivity('animales', 'sonidos');
  for (const level of LEVELS) {
    for (const r of playRounds(sonidos, level)) {
      for (const o of r.options) assert.ok(ANIMALS.find((a) => a.id === o.key).sound, o.key);
    }
  }
});

test('¿De qué color es?: la respuesta es el color natural del objeto', () => {
  const objetos = getActivity('colores', 'objetos');
  for (const level of LEVELS) {
    for (const r of playRounds(objetos, level)) {
      const obj = COLOR_OBJECTS.find((o) => o.id === r.key);
      assert.equal(r.answer, obj.color);
      assert.ok(obj.level <= level);
    }
  }
});

test('Encuentra la figura: nunca muestra juntas figuras confundibles', () => {
  const figuras = getActivity('colores', 'figuras');
  for (const level of LEVELS) {
    for (const r of playRounds(figuras, level)) {
      const keys = r.options.map((o) => o.key);
      for (const [a, b] of CONFUSABLE_SHAPES) assert.ok(!(keys.includes(a) && keys.includes(b)), `${a}+${b}`);
    }
  }
});

test('¿Qué sigue?: la respuesta continúa el patrón', () => {
  const secuencias = getActivity('colores', 'secuencias');
  for (const level of LEVELS) {
    for (const r of playRounds(secuencias, level)) {
      const pattern = r.key.replace('*', '').split('-')[0];
      const seq = r.key.replace('*', '').slice(pattern.length + 1).split('.');
      // El elemento que falta es el que estaba en la misma posición un ciclo antes.
      assert.equal(r.answer, seq[seq.length - pattern.length]);
    }
  }
});

test('Cuenta: el grupo dibujado tiene tantos objetos como la respuesta', () => {
  const contar = getActivity('numeros', 'contar');
  const max = { 1: 3, 2: 5, 3: 10 };
  for (const level of LEVELS) {
    for (const r of playRounds(contar, level)) {
      const n = Number(r.answer);
      assert.equal((r.promptHtml.match(/class="countable"/g) || []).length, n);
      assert.ok(n >= 1 && n <= max[level]);
      assert.equal(r.countables, true);
    }
  }
});

test('Número y cantidad: la opción correcta tiene la cantidad pedida', () => {
  const relacionar = getActivity('numeros', 'relacionar');
  for (const level of LEVELS) {
    for (const r of playRounds(relacionar, level)) {
      for (const o of r.options) assert.match(o.html, new RegExp(`data-count="${o.key}"`));
    }
  }
});

test('¿Dónde hay más?: la respuesta es el grupo correcto', () => {
  const comparar = getActivity('numeros', 'comparar');
  for (const level of LEVELS) {
    for (const r of playRounds(comparar, level)) {
      const [mode, a, b] = r.key.split('-');
      const left = Number(a);
      const right = Number(b);
      assert.notEqual(left, right);
      if (level === 1) assert.ok(Math.abs(left - right) >= 2);
      if (level < 3) assert.equal(mode, 'mas');
      const winner = mode === 'mas' ? (left > right ? 'izquierda' : 'derecha') : left < right ? 'izquierda' : 'derecha';
      assert.equal(r.answer, winner);
    }
  }
});

test('Juntamos: la respuesta es la suma y respeta el máximo del nivel', () => {
  const sumar = getActivity('numeros', 'sumar');
  const max = { 1: 3, 2: 5, 3: 10 };
  for (const level of LEVELS) {
    for (const r of playRounds(sumar, level)) {
      const [a, b] = r.key.split('+').map(Number);
      assert.equal(Number(r.answer), a + b);
      assert.ok(a >= 1 && b >= 1 && a + b <= max[level]);
    }
  }
});

test('Memoria: cada animal aparece exactamente dos veces', () => {
  const memoria = getActivity('animales', 'memoria');
  const pairs = { 1: 3, 2: 4, 3: 6 };
  for (const level of LEVELS) {
    for (let seed = 1; seed < 40; seed += 1) {
      const board = memoria.createBoard({ level, rng: createRng(seed) });
      assert.equal(board.pairs, pairs[level]);
      assert.equal(board.cards.length, pairs[level] * 2);
      const counts = {};
      board.cards.forEach((c) => {
        counts[c.key] = (counts[c.key] || 0) + 1;
      });
      assert.ok(Object.values(counts).every((n) => n === 2));
    }
  }
});

test('los textos en español concuerdan en género y número', () => {
  const all = choiceActivities.flatMap(([, a]) => LEVELS.flatMap((l) => playRounds(a, l, 9, 120)));
  const text = all.map((r) => `${r.say} ${r.successSay} ${r.text}`).join('\n');
  assert.doesNotMatch(text, /\bun (manzana|estrella|flor)\b/);
  assert.doesNotMatch(text, /\buno (manzana|estrella|flor|globo|pato|pez)\b/);
  assert.doesNotMatch(text, /\b(la|una) (estrella|fresa|hoja|zanahoria|naranja|berenjena) es (rojo|amarillo|morado|rosado)\b/);
  assert.doesNotMatch(text, /estrella (roja|amarilla)?(rojo|amarillo|morado|rosado)\b/);
  assert.doesNotMatch(text, /corazóns|\bmas\b/);
});
