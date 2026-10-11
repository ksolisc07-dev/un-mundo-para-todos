/**
 * Palabras del mundo de las letras. Todas tienen dibujo propio.
 * `sound`: grupo de sonido inicial (fonema) para «Empieza igual». Se deja en
 * null cuando la letra no corresponde a un sonido claro para niños pequeños:
 * c/z/s suenan igual en Ecuador (seseo), b/v suenan igual, la h es muda y la
 * ll es un dígrafo. Así cada ronda tiene una sola respuesta defendible.
 */
export const WORDS = [
  { id: 'arbol', word: 'árbol', sound: null },
  { id: 'elefante', word: 'elefante', sound: 'e' },
  { id: 'estrella', word: 'estrella', sound: 'e' },
  { id: 'iguana', word: 'iguana', sound: null },
  { id: 'oso', word: 'oso', sound: null },
  { id: 'oveja', word: 'oveja', sound: null },
  { id: 'uvas', word: 'uvas', sound: null },
  { id: 'perro', word: 'perro', sound: 'p' },
  { id: 'pato', word: 'pato', sound: 'p' },
  { id: 'pez', word: 'pez', sound: 'p' },
  { id: 'platano', word: 'plátano', sound: 'p' },
  { id: 'gato', word: 'gato', sound: 'g' },
  { id: 'gallina', word: 'gallina', sound: 'g' },
  { id: 'globo', word: 'globo', sound: 'g' },
  { id: 'gota', word: 'gota', sound: 'g' },
  { id: 'tortuga', word: 'tortuga', sound: 't' },
  { id: 'tomate', word: 'tomate', sound: 't' },
  { id: 'fresa', word: 'fresa', sound: 'f' },
  { id: 'flor', word: 'flor', sound: 'f' },
  { id: 'manzana', word: 'manzana', sound: 'm' },
  { id: 'mesa', word: 'mesa', sound: 'm' },
  { id: 'leon', word: 'león', sound: 'l' },
  { id: 'luna', word: 'luna', sound: 'l' },
  { id: 'sol', word: 'sol', sound: 's' },
  { id: 'sandia', word: 'sandía', sound: 's' },
  { id: 'rana', word: 'rana', sound: null },
  { id: 'vaca', word: 'vaca', sound: null },
  { id: 'naranja', word: 'naranja', sound: null },
  { id: 'hoja', word: 'hoja', sound: null },
];

export const VOWELS = ['a', 'e', 'i', 'o', 'u'];

/** Palabra de ejemplo para cada vocal (con dibujo). */
export const VOWEL_EXAMPLES = { a: 'arbol', e: 'elefante', i: 'iguana', o: 'oso', u: 'uvas' };

/** Primera letra sin tilde: «árbol» → «a». */
export function initialOf(word) {
  return word.normalize('NFD').replace(/[̀-ͯ]/g, '').charAt(0).toLowerCase();
}

/** Palabras para construir letra por letra, por nivel (sin tildes ni dígrafos). */
export const SPELL_WORDS = {
  1: ['sol', 'pez', 'oso'],
  2: ['pato', 'gato', 'rana', 'vaca', 'gota', 'flor', 'mesa', 'luna', 'uvas'],
  3: ['perro', 'globo', 'fresa', 'oveja', 'tomate', 'gallina'],
};

export function wordById(id) {
  const w = WORDS.find((x) => x.id === id);
  if (!w) throw new Error(`Palabra desconocida: ${id}`);
  return w;
}
