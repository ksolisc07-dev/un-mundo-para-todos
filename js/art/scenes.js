/**
 * Ilustraciones de mundos, rasgos de animales y paisaje de fondo.
 * Originales del proyecto (CC BY 4.0).
 */
import { INK, STROKE, svg, eye } from './svg.js';
import { animalSvg } from './animals.js';

/* ---------- Rasgos (instrucción visual de "¿Quién tiene…?") ---------- */

const TRAITS = {
  plumas: `<path d="M74 10 Q30 26 24 78 L30 86 Q76 66 74 10 Z" fill="#f5d48a" ${STROKE}/>
     <path d="M22 92 Q44 52 72 14" fill="none" ${STROKE}/>
     <path d="M36 70 L46 64 M40 58 L52 52 M46 46 L58 40 M52 34 L64 28" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  caparazon: `<path d="M10 74 Q12 22 50 20 Q88 22 90 74 Z" fill="#4f8a3c" ${STROKE}/>
     <rect x="8" y="70" width="84" height="9" rx="4" fill="#3d6e2e" ${STROKE}/>
     <path d="M34 46 L16 58 M66 46 L84 58 M41 32 L34 24 M59 32 L66 24 M41 60 L36 70 M59 60 L64 70" stroke="${INK}" stroke-width="2.4"/>
     <polygon points="41,32 59,32 66,46 59,60 41,60 34,46" fill="#6fae4f" ${STROKE}/>`,
  trompa: `<path d="M28 4 Q12 30 20 58 Q28 86 58 88 Q80 88 84 72 Q84 62 74 62 Q66 62 66 70 Q64 76 56 75 Q40 72 38 52 Q36 30 46 6 Z" fill="#a9b4c0" ${STROKE}/>
     <ellipse cx="75" cy="66" rx="6" ry="3.5" fill="#7d8894" ${STROKE} stroke-width="1.6"/>
     <path d="M22 26 H40 M21 38 H37 M23 50 H38 M28 62 H42 M38 72 L44 82 M52 76 L52 86" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".45"/>`,
  melena:
    Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return `<circle cx="${(50 + Math.cos(a) * 30).toFixed(1)}" cy="${(50 + Math.sin(a) * 30).toFixed(1)}" r="13" fill="#c4691f" ${STROKE}/>`;
    }).join('') +
    `<circle cx="50" cy="50" r="32" fill="#c4691f"/><circle cx="50" cy="50" r="20" fill="#fff6e0" stroke="${INK}" stroke-width="2.5" stroke-dasharray="5 4"/>`,
  lana:
    [
      [30, 40, 16],
      [52, 32, 18],
      [72, 42, 15],
      [40, 62, 17],
      [64, 62, 17],
    ]
      .map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fbf8f0" ${STROKE}/>`)
      .join('') +
    `<ellipse cx="51" cy="50" rx="24" ry="14" fill="#fbf8f0"/>
     <path d="M40 46 q4 -6 8 0 q4 6 8 0 M44 58 q4 -6 8 0 q4 6 8 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".5"/>`,
  aletas: `<path d="M8 82 q10 -8 20 0 t20 0 t20 0 t20 0" fill="none" stroke="#5aa9e6" stroke-width="4" stroke-linecap="round"/>
     <path d="M20 70 Q30 16 82 16 Q62 40 66 70 Z" fill="#ff7a2f" ${STROKE}/>
     <path d="M34 66 Q42 36 70 22 M50 68 Q54 44 74 22" fill="none" stroke="${INK}" stroke-width="2" opacity=".5"/>`,
};

export function traitSvg(id, className = '') {
  return svg(TRAITS[id], { className: `trait ${className}` });
}

/* ---------- Ilustraciones de los mundos ---------- */

const block = (x, y, color, label, rot = 0) =>
  `<g transform="rotate(${rot} ${x + 16} ${y + 16})"><rect x="${x}" y="${y}" width="32" height="32" rx="6" fill="${color}" ${STROKE}/>
   <text x="${x + 16}" y="${y + 24}" text-anchor="middle" font-family="inherit" font-weight="900" font-size="22" fill="#fff" stroke="${INK}" stroke-width="1.2">${label}</text></g>`;

const face = (cx, cy, color, mood) => {
  const mouth = {
    feliz: `<path d="M${cx - 9} ${cy + 5} Q${cx} ${cy + 15} ${cx + 9} ${cy + 5}" fill="none" ${STROKE}/>`,
    triste: `<path d="M${cx - 8} ${cy + 11} Q${cx} ${cy + 3} ${cx + 8} ${cy + 11}" fill="none" ${STROKE}/>`,
  }[mood];
  return `<circle cx="${cx}" cy="${cy}" r="20" fill="${color}" ${STROKE}/>${eye(cx - 7, cy - 4)}${eye(cx + 7, cy - 4)}${mouth}`;
};

const palm = (x, flip) =>
  `<g transform="translate(${x} 0) ${flip ? 'scale(-1 1) translate(-40 0)' : ''}">
    <path d="M10 92 L10 58 Q4 50 6 40 L10 30 Q12 26 16 30 L18 46 L18 16 Q20 10 24 16 L25 44 L26 10 Q29 4 32 10 L32 44 L34 16 Q37 10 40 16 L39 56 Q38 80 32 92 Z" fill="#f2c19b" ${STROKE}/>
  </g>`;

const WORLD_ART = {
  animales: () => animalSvg('leon'),
  colores: () =>
    svg(
      `<path d="M50 10 Q90 10 92 46 Q94 64 76 62 Q62 60 64 74 Q66 90 48 90 Q10 88 8 50 Q8 12 50 10 Z" fill="#fbf3e4" ${STROKE}/>
       <circle cx="30" cy="34" r="8" fill="#e63946" ${STROKE}/>
       <circle cx="52" cy="26" r="8" fill="#ffd23f" ${STROKE}/>
       <circle cx="74" cy="36" r="8" fill="#1d6fd6" ${STROKE}/>
       <circle cx="26" cy="58" r="8" fill="#2fa84f" ${STROKE}/>
       <polygon points="44,74 52,60 60,74" fill="#8e44ad" ${STROKE}/>`
    ),
  numeros: () =>
    svg(block(6, 54, '#e63946', '1', -6) + block(36, 58, '#1d6fd6', '2') + block(64, 52, '#2fa84f', '3', 6) + block(34, 24, '#ff8c1a', '4', -4)),
  letras: () =>
    svg(block(6, 54, '#8e44ad', 'A', -6) + block(36, 58, '#ff7eb6', 'E') + block(64, 52, '#1d6fd6', 'I', 6) + block(34, 24, '#2fa84f', 'O', -4)),
  emociones: () => svg(face(30, 44, '#ffd23f', 'feliz') + face(70, 58, '#7fb8f0', 'triste')),
  senas: () => svg(palm(8, false) + palm(52, true)),
};

export function worldSvg(id) {
  return WORLD_ART[id]();
}

/* ---------- Paisaje de la pantalla principal ---------- */

export function landscapeSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" class="landscape" aria-hidden="true" focusable="false">
    <path d="M0 260 Q150 170 320 240 T640 220 T960 230 T1200 200 V400 H0 Z" fill="#9ddc8c"/>
    <path d="M0 300 Q200 240 420 290 T840 280 T1200 270 V400 H0 Z" fill="#6cc24a"/>
    <path d="M0 350 Q300 310 600 345 T1200 330 V400 H0 Z" fill="#4fa63a"/>
    <g fill="#2f7d32">
      <circle cx="110" cy="280" r="26"/><rect x="104" y="296" width="12" height="30" fill="#8a5a2b"/>
      <circle cx="1080" cy="260" r="30"/><rect x="1073" y="280" width="14" height="34" fill="#8a5a2b"/>
      <circle cx="760" cy="270" r="22"/><rect x="754" y="284" width="12" height="26" fill="#8a5a2b"/>
    </g>
    <g fill="#ff7eb6"><circle cx="300" cy="345" r="6"/><circle cx="520" cy="360" r="6"/><circle cx="900" cy="350" r="6"/></g>
    <g fill="#ffd23f"><circle cx="330" cy="360" r="5"/><circle cx="640" cy="352" r="5"/><circle cx="980" cy="365" r="5"/></g>
  </svg>`;
}

export function cloudSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" class="cloud-art" aria-hidden="true" focusable="false">
    <path d="M20 50 Q4 50 6 36 Q8 24 22 26 Q26 8 46 10 Q60 0 74 12 Q94 6 98 26 Q116 28 112 44 Q110 52 96 50 Z" fill="#fff"/></svg>`;
}

export function sunSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="sun-art" aria-hidden="true" focusable="false">
    <g stroke="#ffb703" stroke-width="6" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return `<line x1="${(50 + Math.cos(a) * 34).toFixed(1)}" y1="${(50 + Math.sin(a) * 34).toFixed(1)}" x2="${(50 + Math.cos(a) * 46).toFixed(1)}" y2="${(50 + Math.sin(a) * 46).toFixed(1)}"/>`;
    }).join('')}</g>
    <circle cx="50" cy="50" r="27" fill="#ffd23f"/></svg>`;
}
