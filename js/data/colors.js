/** Colores, figuras, objetos y números usados por los mundos 2 y 3. */

export const COLORS = [
  { id: 'rojo', name: 'rojo', fem: 'roja', hex: '#e63946' },
  { id: 'azul', name: 'azul', hex: '#1d6fd6' },
  { id: 'amarillo', name: 'amarillo', fem: 'amarilla', hex: '#ffd23f' },
  { id: 'verde', name: 'verde', hex: '#2fa84f' },
  { id: 'naranja', name: 'naranja', hex: '#ff8c1a' },
  { id: 'morado', name: 'morado', fem: 'morada', hex: '#8e44ad' },
  { id: 'rosado', name: 'rosado', fem: 'rosada', hex: '#ff7eb6' },
  { id: 'cafe', name: 'café', hex: '#8b5a2b' },
];

/** Colores disponibles según el nivel. */
export const COLORS_BY_LEVEL = {
  1: ['rojo', 'azul', 'amarillo', 'verde'],
  2: ['rojo', 'azul', 'amarillo', 'verde', 'naranja', 'morado'],
  3: COLORS.map((c) => c.id),
};

/** Adjetivo de color concordado: «roja» para femenino, «azul» no cambia. */
export function colorAdjective(color, feminine) {
  return feminine && color.fem ? color.fem : color.name;
}

export function colorById(id) {
  const color = COLORS.find((c) => c.id === id);
  if (!color) throw new Error(`Color desconocido: ${id}`);
  return color;
}

/** Objetos con un color natural inequívoco. */
export const COLOR_OBJECTS = [
  { id: 'platano', name: 'el plátano', color: 'amarillo', level: 1 },
  { id: 'sol', name: 'el sol', color: 'amarillo', level: 1 },
  { id: 'fresa', name: 'la fresa', color: 'rojo', level: 1 },
  { id: 'tomate', name: 'el tomate', color: 'rojo', level: 1 },
  { id: 'hoja', name: 'la hoja', color: 'verde', level: 1 },
  { id: 'gota', name: 'la gota de agua', color: 'azul', level: 1 },
  { id: 'zanahoria', name: 'la zanahoria', color: 'naranja', level: 2 },
  { id: 'naranja', name: 'la naranja', color: 'naranja', level: 2 },
  { id: 'berenjena', name: 'la berenjena', color: 'morado', level: 2 },
  { id: 'tronco', name: 'el tronco', color: 'cafe', level: 3 },
];

export const SHAPES = [
  { id: 'circulo', name: 'círculo', plural: 'círculos', article: 'el' },
  { id: 'cuadrado', name: 'cuadrado', plural: 'cuadrados', article: 'el' },
  { id: 'triangulo', name: 'triángulo', plural: 'triángulos', article: 'el' },
  { id: 'rectangulo', name: 'rectángulo', plural: 'rectángulos', article: 'el' },
  { id: 'estrella', name: 'estrella', plural: 'estrellas', article: 'la' },
  { id: 'corazon', name: 'corazón', plural: 'corazones', article: 'el' },
  { id: 'rombo', name: 'rombo', plural: 'rombos', article: 'el' },
  { id: 'ovalo', name: 'óvalo', plural: 'óvalos', article: 'el' },
];

export const SHAPES_BY_LEVEL = {
  1: ['circulo', 'cuadrado', 'triangulo'],
  2: ['circulo', 'cuadrado', 'triangulo', 'rectangulo', 'estrella', 'corazon'],
  3: SHAPES.map((s) => s.id),
};

/**
 * Parejas que no deben aparecer juntas como opciones: un cuadrado también es
 * un rectángulo y un círculo puede verse como óvalo; evitarlas impide que
 * haya dos respuestas defendibles.
 */
export const CONFUSABLE_SHAPES = [
  ['cuadrado', 'rectangulo'],
  ['circulo', 'ovalo'],
  ['cuadrado', 'rombo'],
];

export function shapeById(id) {
  const shape = SHAPES.find((s) => s.id === id);
  if (!shape) throw new Error(`Figura desconocida: ${id}`);
  return shape;
}

export const NUMBER_WORDS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

/** Objetos contables con nombre en singular y plural. */
export const COUNTABLE_ITEMS = [
  { id: 'manzana', one: 'manzana', many: 'manzanas', fem: true, kind: 'object' },
  { id: 'estrella', one: 'estrella', many: 'estrellas', fem: true, kind: 'object' },
  { id: 'globo', one: 'globo', many: 'globos', fem: false, kind: 'object' },
  { id: 'flor', one: 'flor', many: 'flores', fem: true, kind: 'object' },
  { id: 'pato', one: 'pato', many: 'patos', fem: false, kind: 'animal' },
  { id: 'pez', one: 'pez', many: 'peces', fem: false, kind: 'animal' },
];

/** «una manzana», «un globo», «tres flores». */
export function quantityPhrase(n, item) {
  if (n === 1) return `${item.fem ? 'una' : 'un'} ${item.one}`;
  return `${NUMBER_WORDS[n]} ${item.many}`;
}
