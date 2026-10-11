/**
 * Objetos cotidianos para asociar con colores y para contar (SVG 100×100).
 * Cuando `color` es null el objeto aparece "sin pintar" (gris), incluidas sus
 * partes secundarias, para que no den pistas de color.
 */
import { INK, STROKE, svg, eye } from './svg.js';

const UNPAINTED = '#e9e5de';
const UNPAINTED_ACCENT = '#cfc9bf';

const OBJECTS = {
  platano: (c, a) =>
    `<path d="M22 22 Q12 66 54 84 Q78 92 90 80 Q88 74 80 74 Q50 72 40 24 Z" fill="${c}" ${STROKE}/>
     <path d="M30 30 Q30 66 70 80" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".5"/>
     <path d="M20 12 L24 24 L40 24 L36 12 Z" fill="${a('#7a5a2b')}" ${STROKE}/>
     <path d="M88 78 L94 82" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
  sol: (c) =>
    Array.from({ length: 8 }, (_, i) => {
      const ang = (i * Math.PI) / 4;
      const x1 = 50 + Math.cos(ang) * 30;
      const y1 = 50 + Math.sin(ang) * 30;
      const x2 = 50 + Math.cos(ang) * 44;
      const y2 = 50 + Math.sin(ang) * 44;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
    }).join('') +
    `<circle cx="50" cy="50" r="24" fill="${c}" ${STROKE}/>
     ${eye(42, 46)}${eye(58, 46)}
     <path d="M42 57 Q50 64 58 57" fill="none" ${STROKE}/>`,
  fresa: (c, a) =>
    `<path d="M50 90 Q16 64 22 40 Q30 28 50 32 Q70 28 78 40 Q84 64 50 90 Z" fill="${c}" ${STROKE}/>
     ${[
       [38, 48],
       [52, 46],
       [64, 50],
       [44, 62],
       [58, 64],
       [50, 76],
     ]
       .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="2.6" fill="#fff3b0"/>`)
       .join('')}
     <path d="M30 34 L40 22 L46 30 L50 16 L54 30 L60 22 L70 34 Q50 42 30 34 Z" fill="${a('#2fa84f')}" ${STROKE}/>`,
  tomate: (c, a) =>
    `<ellipse cx="50" cy="56" rx="36" ry="30" fill="${c}" ${STROKE}/>
     <path d="M30 46 Q36 40 42 44" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="4" stroke-linecap="round"/>
     <path d="M36 28 L46 32 L50 22 L54 32 L64 28 L58 36 Q50 40 42 36 Z" fill="${a('#2fa84f')}" ${STROKE}/>`,
  hoja: (c) =>
    `<path d="M16 84 Q14 30 70 14 Q90 10 86 30 Q74 84 16 84 Z" fill="${c}" ${STROKE}/>
     <path d="M16 84 Q46 52 76 24 M40 60 L36 42 M52 48 L64 52 M56 42 L52 30 M30 72 L50 72" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
  zanahoria: (c, a) =>
    `<path d="M40 30 Q30 20 34 10 Q42 16 46 28 M50 28 Q52 12 60 8 Q62 20 54 30 M56 32 Q66 22 76 24 Q70 34 58 36" fill="${a('#2fa84f')}" ${STROKE}/>
     <path d="M36 32 Q50 24 64 36 Q58 70 42 92 Q30 64 36 32 Z" fill="${c}" ${STROKE}/>
     <path d="M40 46 L48 46 M44 58 L52 58 M42 70 L48 70" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`,
  naranja: (c, a) =>
    `<circle cx="50" cy="56" r="34" fill="${c}" ${STROKE}/>
     <path d="M50 22 Q62 8 76 14 Q66 26 50 22 Z" fill="${a('#2fa84f')}" ${STROKE}/>
     ${[
       [38, 48],
       [60, 44],
       [44, 70],
       [66, 66],
     ]
       .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${INK}" opacity=".35"/>`)
       .join('')}`,
  berenjena: (c, a) =>
    `<path d="M44 26 Q30 40 26 64 Q24 88 48 90 Q74 90 74 64 Q72 40 56 26 Z" fill="${c}" ${STROKE}/>
     <path d="M36 28 Q50 16 64 28 L56 36 L50 30 L44 36 Z" fill="${a('#2fa84f')}" ${STROKE}/>
     <path d="M50 18 L50 8" stroke="${a('#2fa84f')}" stroke-width="6" stroke-linecap="round"/>
     <path d="M38 52 Q34 64 38 76" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>`,
  gota: (c) =>
    `<path d="M50 10 Q78 50 78 64 A28 28 0 0 1 22 64 Q22 50 50 10 Z" fill="${c}" ${STROKE}/>
     <path d="M36 62 Q36 74 46 78" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="4" stroke-linecap="round"/>`,
  tronco: (c, a) =>
    `<path d="M20 36 L78 36 L78 72 L20 72 Z" fill="${c}" ${STROKE}/>
     <ellipse cx="20" cy="54" rx="10" ry="18" fill="${a('#e8c08a')}" ${STROKE}/>
     <ellipse cx="20" cy="54" rx="5" ry="9" fill="none" stroke="${INK}" stroke-width="2"/>
     <path d="M36 46 H66 M42 60 H72" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`,
};

export const OBJECT_ART_IDS = Object.keys(OBJECTS);

export function objectSvg(id, color = null, className = '') {
  const draw = OBJECTS[id];
  if (!draw) throw new Error(`No existe el objeto "${id}"`);
  const painted = Boolean(color);
  const accent = (natural) => (painted ? natural : UNPAINTED_ACCENT);
  return svg(draw(painted ? color : UNPAINTED, accent), {
    className: `object ${painted ? '' : 'object--unpainted'} ${className}`,
  });
}

/* ---------- Objetos pequeños para contar ---------- */

const COUNTABLES = {
  manzana: `<path d="M50 30 Q30 18 18 36 Q8 60 30 84 Q40 92 50 84 Q60 92 70 84 Q92 60 82 36 Q70 18 50 30 Z" fill="#e63946" ${STROKE}/>
     <path d="M50 30 Q50 18 56 10" fill="none" ${STROKE} stroke-width="4"/>
     <path d="M54 20 Q66 8 76 16 Q66 26 54 20 Z" fill="#2fa84f" ${STROKE}/>
     <path d="M28 44 Q30 36 38 34" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>`,
  estrella: `<polygon points="50,6 61,36 94,37 68,57 77,90 50,71 23,90 32,57 6,37 39,36" fill="#ffd23f" ${STROKE} stroke-width="3"/>
     ${eye(42, 50)}${eye(58, 50)}<path d="M44 60 Q50 65 56 60" fill="none" ${STROKE}/>`,
  globo: `<path d="M50 70 Q46 82 52 96" fill="none" stroke="${INK}" stroke-width="2"/>
     <ellipse cx="50" cy="38" rx="28" ry="32" fill="#1d6fd6" ${STROKE}/>
     <polygon points="45,72 55,72 50,66" fill="#1d6fd6" ${STROKE}/>
     <path d="M36 24 Q40 16 48 14" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>`,
  flor: `<path d="M50 60 L50 96" stroke="#2fa84f" stroke-width="6" stroke-linecap="round"/>
     ${Array.from({ length: 6 }, (_, i) => {
       const a = (i * Math.PI) / 3;
       return `<circle cx="${(50 + Math.cos(a) * 20).toFixed(1)}" cy="${(38 + Math.sin(a) * 20).toFixed(1)}" r="13" fill="#ff7eb6" ${STROKE}/>`;
     }).join('')}
     <circle cx="50" cy="38" r="12" fill="#ffd23f" ${STROKE}/>`,
};

export const COUNTABLE_IDS = Object.keys(COUNTABLES);

export function countableSvg(id, className = '') {
  return svg(COUNTABLES[id], { className: `countable-art ${className}` });
}
