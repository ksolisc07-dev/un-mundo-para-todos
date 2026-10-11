/** Contenido del mundo de las emociones. */

export const EMOTIONS = [
  { id: 'alegria', name: 'alegría', adj: 'feliz', level: 1 },
  { id: 'tristeza', name: 'tristeza', adj: 'triste', level: 1 },
  { id: 'sorpresa', name: 'sorpresa', adj: 'sorprendido', level: 1 },
  { id: 'miedo', name: 'miedo', adj: 'con miedo', level: 2 },
  { id: 'enojo', name: 'enojo', adj: 'enojado', level: 3 },
];

export function emotionsForLevel(level) {
  return EMOTIONS.filter((e) => e.level <= level);
}

export function emotionById(id) {
  const e = EMOTIONS.find((x) => x.id === id);
  if (!e) throw new Error(`Emoción desconocida: ${id}`);
  return e;
}

/**
 * Situaciones cotidianas. `emotion` es la respuesta; `plausible` lista otras
 * emociones razonables que por eso NUNCA se ofrecen como distractoras
 * (un regalo también puede sorprender; que se caiga la torre puede entristecer).
 */
export const SITUATIONS = [
  { id: 'pastel', text: 'Es su cumpleaños y hay pastel.', emotion: 'alegria', plausible: ['sorpresa'] },
  { id: 'regalo', text: 'Le dieron un regalo.', emotion: 'alegria', plausible: ['sorpresa'] },
  { id: 'heladoCaido', text: 'Se le cayó su helado.', emotion: 'tristeza', plausible: ['enojo', 'sorpresa'] },
  { id: 'lluvia', text: 'Llueve y no puede salir a jugar.', emotion: 'tristeza', plausible: ['enojo'] },
  { id: 'cajaSorpresa', text: '¡Algo saltó de la caja!', emotion: 'sorpresa', plausible: ['alegria', 'miedo'] },
  { id: 'tormenta', text: 'Hay una tormenta con truenos.', emotion: 'miedo', plausible: ['sorpresa', 'tristeza'] },
  { id: 'ladrido', text: 'Un perro grande le ladra.', emotion: 'miedo', plausible: ['sorpresa'] },
  { id: 'torreCaida', text: 'Alguien tiró su torre de bloques a propósito.', emotion: 'enojo', plausible: ['tristeza', 'sorpresa'] },
];

/** Acciones (pictogramas) para «¿Qué puedes hacer?». */
export const ACTIONS = {
  abrazo: 'Darle un abrazo',
  compartir: 'Compartir tus colores',
  buscarAdulto: 'Buscar a una persona adulta',
  respirar: 'Respirar despacio',
  ayudarLevantar: 'Ayudarle a levantarse',
  burlarse: 'Burlarte',
  empujar: 'Empujar',
  gritar: 'Gritar',
  romper: 'Romper cosas',
  irse: 'Irte sin ayudar',
};

/** Situaciones para elegir una respuesta amable. Una sola respuesta adecuada. */
export const SCENARIOS = [
  { id: 'amigoTriste', text: 'Tu amigo está triste.', picture: { face: 'tristeza', kid: 1 }, good: 'abrazo', bad: ['burlarse', 'irse', 'empujar'], level: 1 },
  { id: 'cayo', text: 'Un compañero se cayó.', picture: { situation: 'caido' }, good: 'ayudarLevantar', bad: ['burlarse', 'irse', 'gritar'], level: 1 },
  { id: 'sinColores', text: 'Tu compañera no tiene colores.', picture: { situation: 'sinColores' }, good: 'compartir', bad: ['burlarse', 'irse', 'romper'], level: 1 },
  { id: 'miedoTormenta', text: 'Tienes miedo de la tormenta.', picture: { situation: 'tormenta' }, good: 'buscarAdulto', bad: ['gritar', 'empujar', 'romper'], level: 2 },
  { id: 'muyEnojado', text: 'Estás muy enojado.', picture: { face: 'enojo', kid: 2 }, good: 'respirar', bad: ['romper', 'empujar', 'gritar'], level: 2 },
];
