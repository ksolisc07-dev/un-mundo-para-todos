/**
 * Utilidades de azar. Todas aceptan un generador `rng` (función que devuelve
 * un número en [0, 1)) para que las pruebas puedan usar una semilla fija.
 */

/** Generador determinista (mulberry32) para pruebas reproducibles. */
export function createRng(seed = 1) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const defaultRng = Math.random;

/** Entero entre min y max (ambos incluidos). */
export function randInt(min, max, rng = defaultRng) {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick(list, rng = defaultRng) {
  return list[Math.floor(rng() * list.length)];
}

export function shuffle(list, rng = defaultRng) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** `n` elementos distintos de la lista, en orden aleatorio. */
export function sample(list, n, rng = defaultRng) {
  return shuffle(list, rng).slice(0, n);
}

/**
 * Elige un elemento evitando repetir el anterior cuando es posible,
 * para que dos rondas seguidas no pidan lo mismo.
 */
export function pickAvoiding(list, avoid, rng = defaultRng) {
  const pool = list.filter((item) => item !== avoid);
  return pick(pool.length ? pool : list, rng);
}
