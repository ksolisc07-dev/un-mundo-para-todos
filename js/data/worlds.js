/**
 * Mundos de la plataforma. `status: 'ready'` = jugable;
 * `status: 'soon'` = en preparación (se muestra como próximamente, sin juegos falsos).
 */
export const WORLDS = [
  {
    id: 'animales',
    name: 'Los animales',
    color: '#ffb703',
    status: 'ready',
    say: 'Mundo de los animales',
  },
  {
    id: 'colores',
    name: 'Colores y formas',
    color: '#ff7eb6',
    status: 'ready',
    say: 'Mundo de los colores y las formas',
  },
  {
    id: 'numeros',
    name: 'Los números',
    color: '#5aa9e6',
    status: 'ready',
    say: 'Mundo de los números',
  },
  {
    id: 'letras',
    name: 'Las letras',
    color: '#b388eb',
    status: 'soon',
    say: 'Mundo de las letras. Próximamente.',
    planned: [
      'Reconocer las vocales.',
      'Asociar letras con imágenes.',
      'Identificar sonidos iniciales.',
      'Construir palabras sencillas.',
    ],
    note: 'Orientado a niñas y niños que comienzan el proceso de alfabetización.',
  },
  {
    id: 'emociones',
    name: 'Las emociones',
    color: '#ff9f6b',
    status: 'soon',
    say: 'Mundo de las emociones. Próximamente.',
    planned: [
      'Reconocer alegría, tristeza, miedo y sorpresa.',
      'Asociar expresiones faciales con situaciones.',
      'Elegir respuestas ante situaciones cotidianas.',
      'Desarrollar empatía y habilidades socioemocionales.',
    ],
  },
  {
    id: 'senas',
    name: 'Manitos que hablan',
    color: '#4cc9a6',
    status: 'soon',
    say: 'Manitos que hablan: lengua de señas ecuatoriana. En preparación.',
    planned: [
      'Vocabulario básico y saludos.',
      'Animales, colores, números y emociones.',
      'Juegos de asociación entre imágenes y señas.',
    ],
    note: 'Las señas se incorporarán sólo con videos auténticos de Lengua de Señas Ecuatoriana (LSEC), con permisos de uso y validados por personas competentes en la lengua y por la comunidad sorda ecuatoriana. No se usan gestos inventados ni ASL.',
  },
];

export function worldById(id) {
  return WORLDS.find((w) => w.id === id) || null;
}
