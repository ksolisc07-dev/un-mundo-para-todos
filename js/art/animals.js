/**
 * Ilustraciones originales de animales (SVG, 100×100), creadas para este
 * proyecto. Licencia: CC BY 4.0 (ver LICENSE-CONTENIDO.md).
 * Todos miran hacia la izquierda y comparten el mismo estilo de trazo.
 */
import { INK, STROKE, svg, eye } from './svg.js';

const legs = (xs, { y = 66, w = 8, h = 20, fill }) =>
  xs.map((x) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" ${STROKE}/>`).join('');

const thickTail = (d, color) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;

const DRAWINGS = {
  perro: () =>
    thickTail('M74 56 Q88 50 86 36', '#d08c4f') +
    legs([30, 41, 60, 70], { y: 64, h: 22, fill: '#c07d42' }) +
    `<ellipse cx="52" cy="60" rx="26" ry="14" fill="#d08c4f" ${STROKE}/>
     <ellipse cx="62" cy="55" rx="7" ry="5" fill="#8a5a2b"/>
     <path d="M36 28 Q46 30 44 44 Q38 42 35 32 Z" fill="#8a5a2b" ${STROKE}/>
     <circle cx="30" cy="40" r="15" fill="#d08c4f" ${STROKE}/>
     <path d="M19 30 Q10 34 13 50 Q19 48 22 36 Z" fill="#8a5a2b" ${STROKE}/>
     <ellipse cx="21" cy="46" rx="8" ry="6" fill="#f3d9b5" ${STROKE}/>
     <ellipse cx="15" cy="44" rx="3" ry="2.5" fill="${INK}"/>
     ${eye(31, 36)}
     <path d="M17 50 Q20 53 24 51" fill="none" ${STROKE}/>`,

  gato: () =>
    thickTail('M74 62 Q92 58 88 38', '#f4a64e') +
    legs([34, 44, 60, 70], { y: 66, w: 7, h: 20, fill: '#f0a14a' }) +
    `<ellipse cx="54" cy="62" rx="22" ry="12" fill="#f4a64e" ${STROKE}/>
     <path d="M52 51 q3 5 0 10 M60 51 q3 5 0 10 M68 52 q3 5 0 9" fill="none" stroke="#c86f1f" stroke-width="2.5" stroke-linecap="round"/>
     <polygon points="21,37 22,21 32,31" fill="#f4a64e" ${STROKE}/>
     <polygon points="33,31 43,22 43,37" fill="#f4a64e" ${STROKE}/>
     <circle cx="32" cy="44" r="14" fill="#f4a64e" ${STROKE}/>
     <polygon points="24,32 24.5,26 28.5,30" fill="#f7b7c3"/>
     <polygon points="36,30 40,26 40,32" fill="#f7b7c3"/>
     ${eye(27, 43)}${eye(37, 43)}
     <polygon points="30,48 34,48 32,50.5" fill="#e66b8a"/>
     <path d="M32 50.5 q-2 3 -5 2 M32 50.5 q2 3 5 2" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
     <path d="M24 49 L12 47 M24 52 L12 54 M40 49 L52 47 M40 52 L52 54" stroke="${INK}" stroke-width="1.2" stroke-linecap="round"/>`,

  vaca: () =>
    `<path d="M84 50 Q92 60 88 72" fill="none" ${STROKE}/><circle cx="88" cy="74" r="3" fill="${INK}"/>` +
    legs([26, 36, 62, 72], { y: 66, h: 22, fill: '#fff' }) +
    [26, 36, 62, 72].map((x) => `<rect x="${x}" y="82" width="8" height="6" rx="2" fill="${INK}"/>`).join('') +
    `<ellipse cx="62" cy="72" rx="7" ry="4.5" fill="#f6b8c0" ${STROKE}/>
     <rect x="22" y="40" width="64" height="32" rx="14" fill="#fff" ${STROKE}/>
     <ellipse cx="50" cy="50" rx="8" ry="6" fill="${INK}"/>
     <ellipse cx="72" cy="60" rx="7" ry="5" fill="${INK}"/>
     <ellipse cx="38" cy="64" rx="5" ry="4" fill="${INK}"/>
     <polygon points="14,26 10,15 19,22" fill="#f2e3b3" ${STROKE}/>
     <polygon points="32,26 36,15 27,22" fill="#f2e3b3" ${STROKE}/>
     <ellipse cx="7" cy="32" rx="6" ry="3.5" fill="#fff" ${STROKE}/>
     <ellipse cx="39" cy="32" rx="6" ry="3.5" fill="#fff" ${STROKE}/>
     <rect x="10" y="22" width="26" height="34" rx="12" fill="#fff" ${STROKE}/>
     <ellipse cx="28" cy="28" rx="5" ry="4" fill="${INK}"/>
     <rect x="8" y="44" width="30" height="16" rx="8" fill="#f6b8c0" ${STROKE}/>
     <ellipse cx="17" cy="52" rx="1.8" ry="2.5" fill="${INK}"/>
     <ellipse cx="29" cy="52" rx="1.8" ry="2.5" fill="${INK}"/>
     ${eye(17, 36)}${eye(29, 36)}`,

  cerdo: () =>
    `<path d="M81 54 c8 -2 8 -10 2 -9 c-4 1 -2 6 2 4" fill="none" ${STROKE}/>` +
    legs([30, 40, 60, 70], { y: 64, h: 20, fill: '#f39bb0' }) +
    `<ellipse cx="55" cy="58" rx="27" ry="17" fill="#f7a8b8" ${STROKE}/>
     <polygon points="17,37 15,24 27,32" fill="#f39bb0" ${STROKE}/>
     <polygon points="32,32 41,22 41,37" fill="#f39bb0" ${STROKE}/>
     <circle cx="28" cy="48" r="16" fill="#f7a8b8" ${STROKE}/>
     <ellipse cx="18" cy="54" rx="8" ry="6" fill="#f39bb0" ${STROKE}/>
     <ellipse cx="15.5" cy="54" rx="1.5" ry="2.4" fill="${INK}"/>
     <ellipse cx="20.5" cy="54" rx="1.5" ry="2.4" fill="${INK}"/>
     ${eye(23, 43)}${eye(33, 44)}`,

  oveja: () =>
    legs([32, 42, 60, 70], { y: 64, w: 7, h: 22, fill: '#4a4040' }) +
    [
      [40, 52, 11],
      [54, 46, 12],
      [68, 50, 11],
      [76, 62, 10],
      [60, 66, 12],
      [44, 65, 11],
      [34, 60, 9],
    ]
      .map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbf8f0" ${STROKE}/>`)
      .join('') +
    `<ellipse cx="56" cy="57" rx="20" ry="12" fill="#fbf8f0"/>
     <ellipse cx="34" cy="42" rx="7" ry="3.5" fill="#4a4040" ${STROKE} transform="rotate(20 34 42)"/>
     <ellipse cx="24" cy="49" rx="11" ry="14" fill="#4a4040" ${STROKE}/>
     <ellipse cx="13" cy="43" rx="7" ry="3.5" fill="#4a4040" ${STROKE} transform="rotate(-20 13 43)"/>
     <circle cx="20" cy="36" r="5" fill="#fbf8f0" ${STROKE}/>
     <circle cx="27" cy="35" r="5" fill="#fbf8f0" ${STROKE}/>
     <circle cx="20" cy="47" r="3.6" fill="#fff"/><circle cx="29" cy="47" r="3.6" fill="#fff"/>
     ${eye(20, 47, 2.2)}${eye(29, 47, 2.2)}
     <path d="M21 56 q3 2.5 6 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,

  gallina: () =>
    `<path d="M48 74 L46 87 M58 74 L60 87 M40 88 H52 M55 88 H67" fill="none" stroke="#f28c28" stroke-width="3.5" stroke-linecap="round"/>
     <path d="M70 46 q12 -14 18 0 q-2 12 -14 14 Z" fill="#fbf6ea" ${STROKE}/>
     <ellipse cx="54" cy="60" rx="22" ry="17" fill="#fbf6ea" ${STROKE}/>
     <path d="M30 29 q0 -8 5 -6 q2 -6 6 -2 q5 -2 4 6 Z" fill="#e63946" ${STROKE}/>
     <circle cx="36" cy="38" r="12" fill="#fbf6ea" ${STROKE}/>
     <polygon points="25,36 17,40 25,44" fill="#f6a623" ${STROKE}/>
     <ellipse cx="27" cy="47" rx="3" ry="4.5" fill="#e63946" ${STROKE}/>
     ${eye(34, 36)}
     <path d="M48 58 q12 -6 22 2 q-8 12 -22 6 Z" fill="#efe4c8" ${STROKE}/>`,

  pato: () =>
    `<path d="M50 74 L49 85 M61 74 L62 85" stroke="#f28c28" stroke-width="3.5" stroke-linecap="round"/>
     <polygon points="42,88 49,83 55,88" fill="#f28c28" ${STROKE}/>
     <polygon points="56,88 62,83 69,88" fill="#f28c28" ${STROKE}/>
     <path d="M28 44 L30 62 L44 60 L42 44 Z" fill="#ffd23f" ${STROKE}/>
     <polygon points="80,58 93,49 87,66" fill="#ffd23f" ${STROKE}/>
     <ellipse cx="58" cy="64" rx="26" ry="14" fill="#ffd23f" ${STROKE}/>
     <circle cx="34" cy="40" r="13" fill="#ffd23f" ${STROKE}/>
     <path d="M23 40 Q11 39 11 44 Q13 48 24 45 Z" fill="#f28c28" ${STROKE}/>
     ${eye(32, 36)}
     <path d="M52 60 q12 -7 23 1 q-8 11 -23 5 Z" fill="#f5c22c" ${STROKE}/>`,

  leon: () => {
    const mane = Array.from({ length: 11 }, (_, i) => {
      const a = (i / 11) * Math.PI * 2;
      return `<circle cx="${(30 + Math.cos(a) * 15).toFixed(1)}" cy="${(42 + Math.sin(a) * 15).toFixed(1)}" r="7.5" fill="#c4691f" ${STROKE}/>`;
    }).join('');
    return (
      `<path d="M78 60 Q92 58 90 46" fill="none" ${STROKE}/><circle cx="90" cy="43" r="4" fill="#c4691f" ${STROKE}/>` +
      legs([32, 42, 60, 70], { y: 64, h: 22, fill: '#e9b44c' }) +
      `<ellipse cx="56" cy="60" rx="24" ry="13" fill="#f0c05a" ${STROKE}/>` +
      mane +
      `<circle cx="30" cy="42" r="17" fill="#c4691f"/>
       <circle cx="22" cy="31" r="4" fill="#f0c05a" ${STROKE}/>
       <circle cx="38" cy="31" r="4" fill="#f0c05a" ${STROKE}/>
       <circle cx="30" cy="42" r="12" fill="#f0c05a" ${STROKE}/>
       ${eye(26, 40)}${eye(34, 40)}
       <polygon points="27,45.5 33,45.5 30,49" fill="#6b3a1f"/>
       <path d="M30 49 q-2 3 -5 2 M30 49 q2 3 5 2" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`
    );
  },

  elefante: () =>
    `<path d="M86 52 Q92 58 90 66" fill="none" ${STROKE}/>` +
    legs([30, 42, 62, 73], { y: 62, w: 11, h: 24, fill: '#9aa5b1' }) +
    `<ellipse cx="60" cy="54" rx="28" ry="20" fill="#a9b4c0" ${STROKE}/>
     <circle cx="32" cy="42" r="16" fill="#a9b4c0" ${STROKE}/>
     <path d="M20 48 Q14 62 18 74 Q20 78 24 76 Q22 64 29 52 Z" fill="#a9b4c0" ${STROKE}/>
     <path d="M25 54 Q24 62 31 63 Q28 58 29 54 Z" fill="#fff" ${STROKE}/>
     <path d="M38 29 Q57 25 56 46 Q54 60 40 56 Z" fill="#c3ccd6" ${STROKE}/>
     ${eye(27, 38)}`,

  rana: () =>
    `<ellipse cx="27" cy="74" rx="14" ry="8" fill="#57a83a" ${STROKE}/>
     <ellipse cx="73" cy="74" rx="14" ry="8" fill="#57a83a" ${STROKE}/>
     <circle cx="36" cy="40" r="10" fill="#6cc24a" ${STROKE}/>
     <circle cx="64" cy="40" r="10" fill="#6cc24a" ${STROKE}/>
     <ellipse cx="50" cy="62" rx="28" ry="20" fill="#6cc24a" ${STROKE}/>
     <circle cx="36" cy="40" r="6.5" fill="#fff"/><circle cx="64" cy="40" r="6.5" fill="#fff"/>
     ${eye(36, 41, 3.4)}${eye(64, 41, 3.4)}
     <ellipse cx="50" cy="68" rx="16" ry="11" fill="#c8eaa0"/>
     <path d="M34 54 Q50 63 66 54" fill="none" ${STROKE}/>
     <circle cx="30" cy="54" r="3" fill="#f7a8b8"/><circle cx="70" cy="54" r="3" fill="#f7a8b8"/>
     <ellipse cx="38" cy="82" rx="8" ry="4" fill="#57a83a" ${STROKE}/>
     <ellipse cx="62" cy="82" rx="8" ry="4" fill="#57a83a" ${STROKE}/>`,

  pez: () =>
    `<circle cx="14" cy="28" r="3" fill="none" stroke="#5aa9e6" stroke-width="2"/>
     <circle cx="20" cy="18" r="2" fill="none" stroke="#5aa9e6" stroke-width="2"/>
     <path d="M40 34 Q50 20 62 34 Z" fill="#ff7a2f" ${STROKE}/>
     <path d="M46 64 Q52 76 60 66 Z" fill="#ff7a2f" ${STROKE}/>
     <polygon points="72,50 92,35 92,65" fill="#ff7a2f" ${STROKE}/>
     <ellipse cx="48" cy="50" rx="28" ry="18" fill="#ff9a3c" ${STROKE}/>
     <path d="M48 35 q-5 15 0 30 M60 37 q-4 13 0 26" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
     ${eye(32, 46, 3)}
     <path d="M21 54 q4 2 6 -1" fill="none" ${STROKE}/>`,

  tortuga: () =>
    [
      [30, 70],
      [44, 73],
      [60, 73],
      [73, 70],
    ]
      .map(([cx, cy]) => `<ellipse cx="${cx}" cy="${cy}" rx="6" ry="9" fill="#9cc46a" ${STROKE}/>`)
      .join('') +
    `<polygon points="82,61 91,65 82,68" fill="#9cc46a" ${STROKE}/>
     <ellipse cx="18" cy="56" rx="11" ry="9" fill="#9cc46a" ${STROKE}/>
     ${eye(15, 53)}
     <path d="M9 59 q4 3 8 0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
     <path d="M24 65 Q26 32 53 31 Q80 33 82 65 Z" fill="#4f8a3c" ${STROKE}/>
     <rect x="22" y="62" width="62" height="7" rx="3.5" fill="#3d6e2e" ${STROKE}/>
     <path d="M41 49 L28 57 M63 49 L77 57 M46 40 L40 34 M58 40 L65 34 M46 58 L43 63 M58 58 L62 63" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
     <polygon points="46,40 58,40 63,49 58,58 46,58 41,49" fill="#6fae4f" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,

  llama: () =>
    legs([40, 48, 64, 72], { y: 66, w: 6, h: 22, fill: '#e8d5b0' }) +
    `<ellipse cx="83" cy="53" rx="4" ry="6" fill="#f1e3c4" ${STROKE}/>
     <path d="M25 24 L27 60 L42 60 L37 24 Z" fill="#f1e3c4" ${STROKE}/>
     <ellipse cx="60" cy="58" rx="22" ry="12" fill="#f1e3c4" ${STROKE}/>
     <rect x="50" y="45" width="20" height="14" rx="3" fill="#e63946" ${STROKE}/>
     <path d="M52 50 H68 M52 54 H68" stroke="#ffd23f" stroke-width="2"/>
     <path d="M28 15 Q25 3 29 3 Q33 7 32 16 Z" fill="#e8d5b0" ${STROKE}/>
     <path d="M34 15 Q36 3 39 5 Q40 12 37 17 Z" fill="#e8d5b0" ${STROKE}/>
     <ellipse cx="30" cy="22" rx="10" ry="8" fill="#f1e3c4" ${STROKE}/>
     <ellipse cx="21" cy="25" rx="6" ry="4.5" fill="#e3cfa6" ${STROKE}/>
     <circle cx="18" cy="24" r="1.2" fill="${INK}"/>
     ${eye(29, 20, 2.3)}`,
};

export const ANIMAL_ART_IDS = Object.keys(DRAWINGS);

export function animalSvg(id, className = '') {
  const draw = DRAWINGS[id];
  if (!draw) throw new Error(`No existe la ilustración del animal "${id}"`);
  return svg(draw(), { className: `animal ${className}` });
}
