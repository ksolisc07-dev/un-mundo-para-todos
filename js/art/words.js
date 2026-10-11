/**
 * Dibujos para el mundo de las letras: reutiliza animales y objetos y añade
 * algunos nuevos (oso, uvas, iguana, árbol, luna, mesa, sandía).
 * Originales del proyecto (CC BY 4.0).
 */
import { INK, STROKE, svg, eye } from './svg.js';
import { animalSvg, ANIMAL_ART_IDS } from './animals.js';
import { objectSvg, OBJECT_ART_IDS, countableSvg, COUNTABLE_IDS } from './objects.js';

const EXTRA = {
  oso: `${[30, 42, 60, 70].map((x) => `<rect x="${x}" y="64" width="10" height="22" rx="4" fill="#7a4a24" ${STROKE}/>`).join('')}
     <ellipse cx="56" cy="58" rx="28" ry="18" fill="#8b5a2b" ${STROKE}/>
     <circle cx="20" cy="28" r="7" fill="#8b5a2b" ${STROKE}/><circle cx="42" cy="28" r="7" fill="#8b5a2b" ${STROKE}/>
     <circle cx="31" cy="42" r="16" fill="#8b5a2b" ${STROKE}/>
     <ellipse cx="25" cy="48" rx="8" ry="6" fill="#e3c39a" ${STROKE}/>
     <ellipse cx="21" cy="46" rx="3" ry="2.4" fill="${INK}"/>
     ${eye(28, 37)}${eye(38, 38)}`,
  uvas: `<path d="M50 20 Q52 10 58 6" fill="none" stroke="#7a5a2b" stroke-width="4" stroke-linecap="round"/>
     <path d="M54 14 Q70 4 80 14 Q68 22 54 14 Z" fill="#2fa84f" ${STROKE}/>
     ${[
       [36, 30], [50, 28], [64, 30], [30, 44], [44, 44], [58, 44], [72, 44],
       [37, 58], [51, 58], [65, 58], [44, 72], [58, 72], [51, 85],
     ]
       .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#8e44ad" ${STROKE}/>`)
       .join('')}`,
  iguana: `<path d="M70 62 Q92 64 96 80 Q84 70 66 72 Z" fill="#5aa83a" ${STROKE}/>
     ${[30, 40, 52, 62].map((x) => `<path d="M${x} 66 L${x - 4} 82 L${x + 4} 82" fill="#5aa83a" ${STROKE}/>`).join('')}
     <ellipse cx="48" cy="60" rx="26" ry="11" fill="#6cc24a" ${STROKE}/>
     <path d="M26 52 L30 42 L34 50 L38 40 L42 49 L46 39 L50 49 L54 40 L58 50 L62 42 L66 52" fill="#f2c94c" ${STROKE}/>
     <path d="M6 54 Q8 40 24 42 Q34 44 30 58 Q18 64 6 54 Z" fill="#6cc24a" ${STROKE}/>
     <circle cx="22" cy="58" r="5" fill="#f2c94c" ${STROKE}/>
     ${eye(18, 48)}`,
  arbol: `<rect x="42" y="56" width="16" height="36" rx="3" fill="#8b5a2b" ${STROKE}/>
     <circle cx="34" cy="44" r="18" fill="#2fa84f" ${STROKE}/>
     <circle cx="66" cy="44" r="18" fill="#2fa84f" ${STROKE}/>
     <circle cx="50" cy="28" r="22" fill="#2fa84f" ${STROKE}/>
     <ellipse cx="50" cy="48" rx="24" ry="12" fill="#2fa84f"/>
     <circle cx="40" cy="30" r="3.5" fill="#e63946"/><circle cx="62" cy="40" r="3.5" fill="#e63946"/><circle cx="34" cy="48" r="3.5" fill="#e63946"/>`,
  luna: `<path d="M62 10 A40 40 0 1 0 90 66 A32 32 0 1 1 62 10 Z" fill="#ffd23f" ${STROKE}/>
     ${eye(40, 52)}<path d="M36 64 Q42 68 48 64" fill="none" ${STROKE}/>`,
  mesa: `<rect x="10" y="34" width="80" height="12" rx="4" fill="#c98b4b" ${STROKE}/>
     <rect x="16" y="46" width="9" height="40" rx="2" fill="#a8703a" ${STROKE}/>
     <rect x="75" y="46" width="9" height="40" rx="2" fill="#a8703a" ${STROKE}/>
     <path d="M40 34 L40 22 Q50 16 60 22 L60 34" fill="#fff" ${STROKE}/>`,
  sandia: `<path d="M8 40 A42 42 0 0 0 92 40 Z" fill="#2fa84f" ${STROKE}/>
     <path d="M15 40 A35 35 0 0 0 85 40 Z" fill="#ff5d73"/>
     <path d="M8 40 H92" stroke="${INK}" stroke-width="2.5"/>
     ${[[30, 52], [44, 60], [56, 60], [70, 52], [50, 48]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3.4" fill="${INK}"/>`).join('')}`,
};

export const EXTRA_WORD_ART_IDS = Object.keys(EXTRA);

/** Color natural de los objetos del mundo de colores, para mostrarlos pintados. */
const NATURAL = {
  platano: '#ffd23f', sol: '#ffd23f', fresa: '#e63946', tomate: '#e63946', hoja: '#2fa84f',
  zanahoria: '#ff8c1a', naranja: '#ff8c1a', berenjena: '#8e44ad', gota: '#1d6fd6', tronco: '#8b5a2b',
};

export function wordPictureSvg(id, className = '') {
  if (EXTRA[id]) return svg(EXTRA[id], { className: `word-art ${className}` });
  if (ANIMAL_ART_IDS.includes(id)) return animalSvg(id, className);
  if (OBJECT_ART_IDS.includes(id)) return objectSvg(id, NATURAL[id], className);
  if (COUNTABLE_IDS.includes(id)) return countableSvg(id, className);
  throw new Error(`No hay dibujo para la palabra "${id}"`);
}
