import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRng, sample, shuffle, pickAvoiding } from '../../js/core/random.js';
import { createStore, sanitize, STORAGE_KEY, DEFAULT_PREFS } from '../../js/core/store.js';
import { parseHash, hrefFor } from '../../js/core/router.js';
import { escapeHtml } from '../../js/core/dom.js';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = String(v);
    },
    removeItem: (k) => delete data[k],
  };
}

test('el generador con semilla es reproducible', () => {
  const a = createRng(42);
  const b = createRng(42);
  for (let i = 0; i < 20; i += 1) assert.equal(a(), b());
});

test('sample devuelve elementos distintos y shuffle conserva todos', () => {
  const rng = createRng(7);
  const list = [1, 2, 3, 4, 5, 6];
  const s = sample(list, 4, rng);
  assert.equal(new Set(s).size, 4);
  assert.deepEqual([...shuffle(list, rng)].sort(), list);
  for (let i = 0; i < 50; i += 1) assert.notEqual(pickAvoiding(list, 3, rng), 3);
  assert.equal(pickAvoiding([9], 9, rng), 9);
});

test('el estado inicial usa las preferencias por defecto', () => {
  const store = createStore(memoryStorage());
  assert.deepEqual({ ...store.prefs }, { ...DEFAULT_PREFS });
  assert.equal(store.teacher.difficulty, 'auto');
  assert.equal(store.teacher.rounds, 5);
  assert.equal(store.levelFor('animales/reconocer'), 1);
  assert.equal(store.starsFor('animales/reconocer'), 0);
});

test('el progreso se guarda y se recupera entre sesiones', () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  store.recordCompletion('animales/reconocer', 1, { answered: 5, firstTry: 4 }, new Date('2026-03-01T10:00:00Z'));
  const again = createStore(storage);
  const p = again.getProgress('animales/reconocer');
  assert.equal(p.levels[1], true);
  assert.equal(p.completions, 1);
  assert.equal(p.answered, 5);
  assert.equal(p.firstTry, 4);
  assert.equal(p.last, '2026-03-01');
  assert.equal(again.starsFor('animales/reconocer'), 1);
  assert.equal(again.levelFor('animales/reconocer'), 2);
});

test('el modo automático avanza de nivel y se queda en el 3', () => {
  const store = createStore(memoryStorage());
  const key = 'numeros/contar';
  for (const level of [1, 2, 3]) {
    assert.equal(store.levelFor(key), level);
    store.recordCompletion(key, level);
  }
  assert.equal(store.levelFor(key), 3);
  assert.equal(store.starsFor(key), 3);
});

test('la dificultad fija de la docente tiene prioridad', () => {
  const store = createStore(memoryStorage());
  store.updateTeacher({ difficulty: 2 });
  assert.equal(store.levelFor('colores/figuras'), 2);
  store.updateTeacher({ difficulty: 9 }); // valor inválido: se ignora
  assert.equal(store.teacher.difficulty, 'auto');
});

test('activar y desactivar actividades', () => {
  const store = createStore(memoryStorage());
  store.setActivityEnabled('animales/memoria', false);
  assert.equal(store.isActivityEnabled('animales/memoria'), false);
  store.setActivityEnabled('animales/memoria', true);
  assert.equal(store.isActivityEnabled('animales/memoria'), true);
});

test('reiniciar el progreso no borra las preferencias; restablecer todo sí', () => {
  const store = createStore(memoryStorage());
  store.updatePrefs({ highContrast: true });
  store.recordCompletion('animales/sombras', 1);
  store.resetProgress();
  assert.equal(store.starsFor('animales/sombras'), 0);
  assert.equal(store.prefs.highContrast, true);
  store.resetAll();
  assert.equal(store.prefs.highContrast, false);
});

test('datos dañados o manipulados se limpian', () => {
  const clean = sanitize({
    prefs: { volume: 7, rate: 'rápido', motion: 'loco', voice: 'sí', nombre: 'Ana' },
    teacher: { rounds: 99, difficulty: 'x', disabled: { 'a/b': 'true', 'c/d': true } },
    progress: { 'animales/reconocer': { levels: { 1: true, 7: true }, answered: 3, firstTry: 9, last: 5 }, x: null },
    alumno: 'Juan Pérez',
  });
  assert.equal(clean.prefs.volume, 1);
  assert.equal(clean.prefs.rate, DEFAULT_PREFS.rate);
  assert.equal(clean.prefs.motion, 'auto');
  assert.equal(clean.prefs.voice, true);
  assert.equal('nombre' in clean.prefs, false);
  assert.equal('alumno' in clean, false);
  assert.equal(clean.teacher.rounds, 5);
  assert.deepEqual(clean.teacher.disabled, { 'c/d': true });
  assert.deepEqual(clean.progress['animales/reconocer'].levels, { 1: true });
  assert.equal(clean.progress['animales/reconocer'].firstTry, 3);
  assert.equal(clean.progress['animales/reconocer'].last, null);
  assert.equal('x' in clean.progress, false);
});

test('JSON inválido en el almacenamiento no rompe la aplicación', () => {
  const store = createStore(memoryStorage({ [STORAGE_KEY]: '{no es json' }));
  assert.equal(store.prefs.voice, true);
});

test('sin almacenamiento disponible, funciona en memoria', () => {
  const store = createStore(null);
  assert.equal(store.persistent, false);
  store.recordCompletion('animales/rasgos', 1);
  assert.equal(store.starsFor('animales/rasgos'), 1);
});

test('lo guardado sólo contiene preferencias, configuración y progreso (sin datos personales)', () => {
  const storage = memoryStorage();
  const store = createStore(storage);
  store.recordCompletion('numeros/sumar', 2, { answered: 5, firstTry: 5 });
  const saved = JSON.parse(storage.data[STORAGE_KEY]);
  assert.deepEqual(Object.keys(saved).sort(), ['prefs', 'progress', 'teacher', 'version']);
  assert.deepEqual(Object.keys(saved.progress['numeros/sumar']).sort(), ['answered', 'completions', 'firstTry', 'last', 'levels']);
});

test('el enrutador interpreta las direcciones', () => {
  assert.deepEqual(parseHash(''), { name: 'home', params: {} });
  assert.deepEqual(parseHash('#/'), { name: 'home', params: {} });
  assert.deepEqual(parseHash('#/mundo/animales'), { name: 'world', params: { world: 'animales' } });
  assert.deepEqual(parseHash('#/juego/numeros/contar'), { name: 'play', params: { world: 'numeros', activity: 'contar' } });
  assert.deepEqual(parseHash('#/juego/numeros/contar/2'), {
    name: 'play',
    params: { world: 'numeros', activity: 'contar', level: 2 },
  });
  assert.equal(parseHash('#/juego/numeros/contar/9').name, 'notFound');
  assert.equal(parseHash('#/preferencias').name, 'prefs');
  assert.equal(parseHash('#/docentes').name, 'teachers');
  assert.equal(parseHash('#/algo/raro/que/no/existe').name, 'notFound');
  for (const [name, params] of [
    ['world', { world: 'colores' }],
    ['play', { world: 'colores', activity: 'figuras', level: 3 }],
    ['prefs', {}],
    ['teachers', {}],
  ]) {
    assert.deepEqual(parseHash(hrefFor(name, params)), { name, params });
  }
});

test('escapeHtml neutraliza marcado', () => {
  assert.equal(escapeHtml('<b>"a"&\'b\'</b>'), '&lt;b&gt;&quot;a&quot;&amp;&#39;b&#39;&lt;/b&gt;');
});
