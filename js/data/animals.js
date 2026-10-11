/**
 * Animales del Mundo 1. `sound` es la onomatopeya en español que se lee en
 * voz alta y se muestra escrita (no hay grabaciones reales todavía; ver
 * docs/NUEVOS_JUEGOS.md para añadir audios con licencia libre).
 * `traits` sólo contiene rasgos inequívocos para que cada pregunta tenga una
 * única respuesta correcta.
 */
export const ANIMALS = [
  { id: 'perro', name: 'perro', article: 'el', sound: 'guau, guau', traits: [] },
  { id: 'gato', name: 'gato', article: 'el', sound: 'miau, miau', traits: [] },
  { id: 'vaca', name: 'vaca', article: 'la', sound: 'muuu', traits: [] },
  { id: 'cerdo', name: 'cerdo', article: 'el', sound: 'oinc, oinc', traits: [] },
  { id: 'oveja', name: 'oveja', article: 'la', sound: 'beee', traits: ['lana'] },
  { id: 'gallina', name: 'gallina', article: 'la', sound: 'coc, co, co', traits: ['plumas'] },
  { id: 'pato', name: 'pato', article: 'el', sound: 'cuac, cuac', traits: ['plumas'] },
  { id: 'leon', name: 'león', article: 'el', sound: 'grrr', traits: ['melena'] },
  { id: 'elefante', name: 'elefante', article: 'el', sound: 'pruuu', traits: ['trompa'] },
  { id: 'rana', name: 'rana', article: 'la', sound: 'croac, croac', traits: [] },
  { id: 'pez', name: 'pez', article: 'el', sound: null, traits: ['aletas'] },
  { id: 'tortuga', name: 'tortuga', article: 'la', sound: null, traits: ['caparazon'] },
  { id: 'llama', name: 'llama', article: 'la', sound: null, traits: ['lana'] },
];

/** Animales más conocidos, usados en el nivel 1. */
export const EASY_ANIMALS = ['perro', 'gato', 'vaca', 'pato', 'cerdo', 'gallina'];

export const TRAITS = [
  { id: 'plumas', question: '¿Quién tiene plumas?', name: 'plumas' },
  { id: 'caparazon', question: '¿Quién tiene caparazón?', name: 'caparazón' },
  { id: 'trompa', question: '¿Quién tiene trompa?', name: 'trompa' },
  { id: 'melena', question: '¿Quién tiene melena?', name: 'melena' },
  { id: 'lana', question: '¿Quién tiene lana?', name: 'lana' },
  { id: 'aletas', question: '¿Quién tiene aletas?', name: 'aletas' },
];

export function animalById(id) {
  const animal = ANIMALS.find((a) => a.id === id);
  if (!animal) throw new Error(`Animal desconocido: ${id}`);
  return animal;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
