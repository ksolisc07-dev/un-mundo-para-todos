/**
 * Registro de videos de Lengua de Señas Ecuatoriana (LSEC).
 *
 * IMPORTANTE: este archivo NO contiene señas. Sólo describe qué conceptos
 * necesitan un video y en qué estado está cada uno. Un video se muestra a los
 * niños únicamente cuando su entrada está completa y marcada como "validado"
 * por personas competentes en LSEC, incluida la comunidad sorda ecuatoriana.
 * Nunca se sustituye una seña faltante por gestos genéricos, por ASL ni por
 * contenido generado automáticamente.
 *
 * Cómo añadir un video: ver docs/LSEC_VIDEOS.md
 */

export const LSEC_STATUS = Object.freeze({
  PENDING: 'pendiente', // aún no hay video
  REVIEW: 'en-revision', // hay video, falta validación
  VALIDATED: 'validado', // video revisado y autorizado
});

export const LSEC_CATEGORIES = [
  { id: 'saludos', name: 'Saludos' },
  { id: 'basico', name: 'Vocabulario básico' },
  { id: 'animales', name: 'Animales' },
  { id: 'colores', name: 'Colores' },
  { id: 'numeros', name: 'Números' },
  { id: 'emociones', name: 'Emociones' },
  { id: 'alfabeto', name: 'Alfabeto manual (dactilología)' },
];

const pending = (concept, category, label) => ({
  concept,
  category,
  label,
  status: LSEC_STATUS.PENDING,
  src: null, // ej.: 'assets/lsec/videos/animal-perro.mp4' (ruta relativa)
  poster: null, // imagen de vista previa opcional
  captions: null, // subtítulos .vtt en español, opcional
  license: null, // ej.: 'CC BY-NC-SA 4.0' o "autorización escrita"
  signer: null, // crédito de la persona señante (sólo si lo autoriza)
  validation: null, // { reviewers: ['Nombre u organización'], date: 'AAAA-MM-DD' }
  consent: false, // consentimiento informado de la persona señante
});

export const LSEC_ENTRIES = [
  pending('saludo:hola', 'saludos', 'Hola'),
  pending('saludo:adios', 'saludos', 'Adiós'),
  pending('saludo:buenos-dias', 'saludos', 'Buenos días'),
  pending('saludo:gracias', 'saludos', 'Gracias'),
  pending('saludo:por-favor', 'saludos', 'Por favor'),
  pending('basico:mama', 'basico', 'Mamá'),
  pending('basico:papa', 'basico', 'Papá'),
  pending('basico:escuela', 'basico', 'Escuela'),
  pending('basico:agua', 'basico', 'Agua'),
  pending('basico:comer', 'basico', 'Comer'),
  pending('basico:jugar', 'basico', 'Jugar'),
  ...[
    ['perro', 'Perro'],
    ['gato', 'Gato'],
    ['vaca', 'Vaca'],
    ['cerdo', 'Cerdo'],
    ['oveja', 'Oveja'],
    ['gallina', 'Gallina'],
    ['pato', 'Pato'],
    ['leon', 'León'],
    ['elefante', 'Elefante'],
    ['rana', 'Rana'],
    ['pez', 'Pez'],
    ['tortuga', 'Tortuga'],
    ['llama', 'Llama'],
  ].map(([id, label]) => pending(`animal:${id}`, 'animales', label)),
  ...[
    ['rojo', 'Rojo'],
    ['azul', 'Azul'],
    ['amarillo', 'Amarillo'],
    ['verde', 'Verde'],
    ['naranja', 'Naranja'],
    ['morado', 'Morado'],
    ['rosado', 'Rosado'],
    ['cafe', 'Café'],
  ].map(([id, label]) => pending(`color:${id}`, 'colores', label)),
  ...['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez'].map((label, i) =>
    pending(`numero:${i + 1}`, 'numeros', label)
  ),
  pending('emocion:alegria', 'emociones', 'Alegría'),
  pending('emocion:tristeza', 'emociones', 'Tristeza'),
  pending('emocion:miedo', 'emociones', 'Miedo'),
  pending('emocion:sorpresa', 'emociones', 'Sorpresa'),
  pending('emocion:enojo', 'emociones', 'Enojo'),
  ...'abcdefghijklmnñopqrstuvwxyz'.split('').map((l) => pending(`letra:${l}`, 'alfabeto', `Letra ${l.toUpperCase()}`)),
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Una entrada sólo es publicable si cumple TODOS los requisitos.
 * Devuelve la lista de requisitos que faltan (vacía = publicable).
 */
export function missingRequirements(entry) {
  const missing = [];
  if (entry.status !== LSEC_STATUS.VALIDATED) missing.push('estado "validado"');
  if (typeof entry.src !== 'string' || !entry.src.trim()) missing.push('archivo de video');
  if (typeof entry.license !== 'string' || !entry.license.trim()) missing.push('licencia o autorización de uso');
  if (entry.consent !== true) missing.push('consentimiento de la persona señante');
  const reviewers = entry.validation?.reviewers;
  if (!Array.isArray(reviewers) || reviewers.filter((r) => typeof r === 'string' && r.trim()).length === 0) {
    missing.push('personas u organizaciones validadoras');
  }
  if (!DATE_RE.test(entry.validation?.date || '')) missing.push('fecha de validación');
  return missing;
}

export function isPublishable(entry) {
  return missingRequirements(entry).length === 0;
}

export function createLsecRegistry(entries = LSEC_ENTRIES) {
  const byConcept = new Map(entries.map((e) => [e.concept, e]));
  return {
    entries,
    /** Video publicable para un concepto, o null si no existe / no está validado. */
    videoFor(concept) {
      const entry = concept ? byConcept.get(concept) : null;
      return entry && isPublishable(entry) ? entry : null;
    },
    publishableCount() {
      return entries.filter(isPublishable).length;
    },
    hasAnyVideo() {
      return this.publishableCount() > 0;
    },
  };
}

export const lsecRegistry = createLsecRegistry();
