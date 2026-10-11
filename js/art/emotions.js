/**
 * Mundo de las emociones: caras de niñas y niños diversos, situaciones y
 * pictogramas de acciones. Originales del proyecto (CC BY 4.0).
 */
import { INK, STROKE, svg, eye } from './svg.js';
import { animalSvg } from './animals.js';

/* ---------- Caras ---------- */

const KIDS = [
  { skin: '#f2c19b', hair: '#4a2e1c', style: 'corto' },
  { skin: '#c68642', hair: '#1f1a17', style: 'rizos' },
  { skin: '#8d5524', hair: '#141010', style: 'mono' },
];

export const KID_COUNT = KIDS.length;

function hair(kid) {
  if (kid.style === 'rizos') {
    return Array.from({ length: 9 }, (_, i) => {
      const a = Math.PI + (i / 8) * Math.PI;
      return `<circle cx="${(50 + Math.cos(a) * 31).toFixed(1)}" cy="${(52 + Math.sin(a) * 31).toFixed(1)}" r="9" fill="${kid.hair}"/>`;
    }).join('');
  }
  if (kid.style === 'mono') {
    return `<circle cx="20" cy="26" r="13" fill="${kid.hair}" ${STROKE}/><circle cx="80" cy="26" r="13" fill="${kid.hair}" ${STROKE}/>
      <path d="M19 50 Q18 22 50 21 Q82 22 81 50 Q70 36 50 35 Q30 36 19 50 Z" fill="${kid.hair}"/>`;
  }
  return `<path d="M18 52 Q14 18 50 17 Q86 18 82 52 Q76 32 56 30 Q60 38 48 36 Q30 34 18 52 Z" fill="${kid.hair}"/>`;
}

const FEATURES = {
  alegria: () =>
    `<path d="M32 55 Q38 48 44 55 M56 55 Q62 48 68 55" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <path d="M35 65 Q50 84 65 65 Z" fill="#8a2e2e" ${STROKE}/><path d="M43 74 Q50 79 57 74 Q50 70 43 74 Z" fill="#ff8fa3"/>
     <circle cx="29" cy="64" r="4.5" fill="#ff8fa3" opacity=".7"/><circle cx="71" cy="64" r="4.5" fill="#ff8fa3" opacity=".7"/>`,
  tristeza: () =>
    `<path d="M30 47 L44 42 M56 42 L70 47" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     ${eye(38, 55, 3)}${eye(62, 55, 3)}
     <path d="M38 75 Q50 64 62 75" fill="none" ${STROKE} stroke-width="3"/>
     <path d="M35 62 Q31 69 35 72 Q39 69 35 62 Z" fill="#5aa9e6" stroke="#2b6cb0" stroke-width="1.5"/>`,
  miedo: () =>
    `<path d="M30 42 Q37 36 44 40 M56 40 Q63 36 70 42" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <circle cx="38" cy="54" r="6.5" fill="#fff" ${STROKE}/><circle cx="62" cy="54" r="6.5" fill="#fff" ${STROKE}/>
     <circle cx="38" cy="55" r="2" fill="${INK}"/><circle cx="62" cy="55" r="2" fill="${INK}"/>
     <rect x="38" y="66" width="24" height="11" rx="5" fill="#8a2e2e" ${STROKE}/>
     <path d="M39 71.5 L43 68.5 L47 71.5 L51 68.5 L55 71.5 L59 68.5 L61 71" fill="none" stroke="#fff" stroke-width="2"/>
     <path d="M78 36 Q74 43 78 46 Q82 43 78 36 Z" fill="#5aa9e6" stroke="#2b6cb0" stroke-width="1.5"/>
     <path d="M10 50 L6 54 L10 58 M90 50 L94 54 L90 58" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`,
  sorpresa: () =>
    `<path d="M30 41 Q37 32 45 39 M55 39 Q63 32 70 41" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <circle cx="38" cy="54" r="6.5" fill="#fff" ${STROKE}/><circle cx="62" cy="54" r="6.5" fill="#fff" ${STROKE}/>
     <circle cx="38" cy="54" r="3.2" fill="${INK}"/><circle cx="62" cy="54" r="3.2" fill="${INK}"/>
     <ellipse cx="50" cy="73" rx="6.5" ry="8" fill="#8a2e2e" ${STROKE}/>`,
  enojo: () =>
    `<path d="M30 42 L45 49 M55 49 L70 42" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
     ${eye(38, 56, 2.8)}${eye(62, 56, 2.8)}
     <path d="M38 74 Q50 66 62 74" fill="none" ${STROKE} stroke-width="3"/>
     <circle cx="28" cy="65" r="5" fill="#e63946" opacity=".45"/><circle cx="72" cy="65" r="5" fill="#e63946" opacity=".45"/>`,
};

export const FACE_EMOTIONS = Object.keys(FEATURES);

export function faceSvg(emotion, kidIndex = 0, className = '') {
  const kid = KIDS[kidIndex % KIDS.length];
  return svg(
    `${kid.style === 'mono' ? hair(kid) : ''}
     <circle cx="18" cy="58" r="6" fill="${kid.skin}" ${STROKE}/><circle cx="82" cy="58" r="6" fill="${kid.skin}" ${STROKE}/>
     <circle cx="50" cy="56" r="32" fill="${kid.skin}" ${STROKE}/>
     ${kid.style === 'mono' ? '' : hair(kid)}
     ${FEATURES[emotion]()}`,
    { className: `face face--${emotion} ${className}` }
  );
}

/* ---------- Situaciones ---------- */

const SITUATIONS = {
  pastel: `<rect x="18" y="52" width="64" height="34" rx="6" fill="#ff9fc3" ${STROKE}/>
     <path d="M18 62 Q26 70 34 62 Q42 70 50 62 Q58 70 66 62 Q74 70 82 62" fill="none" stroke="#fff" stroke-width="4"/>
     <rect x="10" y="84" width="80" height="6" rx="3" fill="#cfc9bf" ${STROKE}/>
     ${[34, 50, 66].map((x) => `<rect x="${x - 3}" y="34" width="6" height="18" fill="#5aa9e6" ${STROKE}/><path d="M${x} 22 Q${x + 6} 30 ${x} 33 Q${x - 6} 30 ${x} 22 Z" fill="#ffb703" ${STROKE} stroke-width="1.5"/>`).join('')}`,
  regalo: `<rect x="16" y="42" width="68" height="46" rx="4" fill="#e63946" ${STROKE}/>
     <rect x="12" y="32" width="76" height="14" rx="3" fill="#ff5d73" ${STROKE}/>
     <rect x="45" y="32" width="10" height="56" fill="#ffd23f" ${STROKE}/>
     <path d="M50 32 Q30 10 26 26 Q26 34 50 32 Q70 10 74 26 Q74 34 50 32 Z" fill="#ffd23f" ${STROKE}/>`,
  heladoCaido: `<path d="M8 88 H92" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <path d="M30 86 Q20 70 40 66 Q50 56 62 66 Q80 66 72 86 Z" fill="#ff9fc3" ${STROKE}/>
     <path d="M60 30 L86 52 L70 60 Z" fill="#e8b46a" ${STROKE}/>
     <path d="M66 40 L78 50 M64 48 L74 56" stroke="${INK}" stroke-width="1.5"/>
     <path d="M34 72 Q36 66 42 68" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  lluvia: `<path d="M22 46 Q8 46 10 34 Q12 22 26 24 Q30 8 50 10 Q66 4 74 18 Q92 16 92 32 Q94 46 78 46 Z" fill="#a9b4c0" ${STROKE}/>
     ${[[24, 56], [40, 62], [56, 56], [72, 62], [32, 76], [48, 82], [64, 76]].map(([x, y]) => `<path d="M${x} ${y} q-3 6 0 8 q3 -2 0 -8 Z" fill="#5aa9e6" stroke="#2b6cb0" stroke-width="1.5"/>`).join('')}`,
  tormenta: `<path d="M22 46 Q8 46 10 34 Q12 22 26 24 Q30 8 50 10 Q66 4 74 18 Q92 16 92 32 Q94 46 78 46 Z" fill="#5b6472" ${STROKE}/>
     <polygon points="52,44 38,70 50,70 42,94 66,62 54,62 62,44" fill="#ffd23f" ${STROKE}/>`,
  ladrido: `<svg x="0" y="22" width="70" height="70" viewBox="0 0 100 100">${animalSvg('perro').replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>
     <path d="M50 6 H97 V30 H70 L60 40 L62 30 H50 Z" fill="#fff" ${STROKE}/>
     <text x="73.5" y="23" text-anchor="middle" font-size="12" font-weight="900" fill="${INK}">¡GUAU!</text>`,
  cajaSorpresa: `<rect x="22" y="58" width="56" height="34" rx="3" fill="#8e44ad" ${STROKE}/>
     <path d="M22 58 L10 46 M78 58 L90 46" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <path d="M50 58 Q40 52 50 48 Q60 44 50 40 Q40 36 50 32" fill="none" ${STROKE} stroke-width="3"/>
     <polygon points="50,6 56,18 69,19 59,28 62,41 50,34 38,41 41,28 31,19 44,18" fill="#ffd23f" ${STROKE}/>
     <path d="M12 20 L18 24 M88 20 L82 24 M16 6 L20 14 M84 6 L80 14" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
  torreCaida: `<path d="M6 90 H94" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <rect x="14" y="70" width="20" height="20" fill="#e63946" ${STROKE}/>
     <rect x="38" y="72" width="20" height="18" fill="#1d6fd6" ${STROKE} transform="rotate(14 48 81)"/>
     <rect x="62" y="68" width="20" height="20" fill="#ffd23f" ${STROKE} transform="rotate(-20 72 78)"/>
     <rect x="44" y="38" width="20" height="20" fill="#2fa84f" ${STROKE} transform="rotate(35 54 48)"/>
     <path d="M30 40 L24 32 M70 34 L78 26 M50 24 L50 14" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
  caido: `<path d="M6 88 H94" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <circle cx="30" cy="62" r="11" fill="#c68642" ${STROKE}/>
     <rect x="38" y="66" width="30" height="16" rx="8" fill="#1d6fd6" ${STROKE}/>
     <path d="M66 80 L84 86 M44 82 L40 88" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
     <path d="M26 64 q4 -3 8 0" fill="none" stroke="${INK}" stroke-width="2"/>
     <path d="M20 42 L24 50 M32 40 L32 48 M44 44 L40 50" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
  sinColores: `<rect x="20" y="40" width="60" height="44" rx="4" fill="#fff6e0" ${STROKE}/>
     <path d="M20 40 L32 28 H92 L80 40" fill="#f4e3c0" ${STROKE}/>
     <path d="M80 40 L92 28 V72 L80 84" fill="#efdcb5" ${STROKE}/>
     <text x="50" y="72" text-anchor="middle" font-size="28" font-weight="900" fill="${INK}">?</text>`,
};

export function situationSvg(id, className = '') {
  return svg(SITUATIONS[id], { className: `situation ${className}` });
}

/* ---------- Pictogramas de acciones ---------- */

const kid = (x, y, shirt, skin = '#f2c19b', { arms = '' } = {}) =>
  `<rect x="${x - 10}" y="${y + 10}" width="20" height="26" rx="8" fill="${shirt}" ${STROKE}/>
   ${arms}
   <circle cx="${x}" cy="${y}" r="10" fill="${skin}" ${STROKE}/>`;

const ACTIONS = {
  abrazo: `${kid(38, 40, '#1d6fd6', '#c68642')}${kid(62, 40, '#ff7eb6')}
     <path d="M30 58 Q50 72 70 58" fill="none" stroke="#c68642" stroke-width="6" stroke-linecap="round"/>
     <path d="M50 16 C44 8 34 14 42 22 L50 28 L58 22 C66 14 56 8 50 16 Z" fill="#e63946" ${STROKE} stroke-width="1.5"/>`,
  compartir: `${kid(24, 40, '#2fa84f')}${kid(76, 40, '#ff8c1a', '#8d5524')}
     <rect x="40" y="56" width="20" height="8" rx="2" fill="#e63946" ${STROKE} transform="rotate(-15 50 60)"/>
     <path d="M36 74 Q50 84 64 74 M60 70 L64 74 L59 78" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
  buscarAdulto: `<rect x="56" y="34" width="26" height="46" rx="10" fill="#8e44ad" ${STROKE}/><circle cx="69" cy="22" r="12" fill="#8d5524" ${STROKE}/>
     <path d="M60 80 V92 M78 80 V92" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
     ${kid(30, 54, '#ffd23f')}
     <path d="M40 70 Q50 68 58 60" fill="none" stroke="#f2c19b" stroke-width="5" stroke-linecap="round"/>`,
  respirar: `<circle cx="38" cy="50" r="24" fill="#f2c19b" ${STROKE}/>
     <path d="M26 48 Q31 52 36 48 M42 48 Q47 52 52 48" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
     <ellipse cx="40" cy="62" rx="4" ry="3" fill="#8a2e2e"/>
     <path d="M62 50 Q76 44 72 36 Q68 30 64 38 M62 60 Q84 62 86 50 Q86 42 80 46 M62 70 Q78 80 88 72" fill="none" stroke="#5aa9e6" stroke-width="3.5" stroke-linecap="round"/>`,
  ayudarLevantar: `${kid(70, 32, '#2fa84f', '#8d5524')}
     <circle cx="28" cy="66" r="10" fill="#f2c19b" ${STROKE}/><rect x="16" y="74" width="26" height="14" rx="7" fill="#1d6fd6" ${STROKE}/>
     <path d="M38 70 Q50 60 62 56" fill="none" stroke="#8d5524" stroke-width="5" stroke-linecap="round"/>
     <path d="M6 90 H94" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  burlarse: `${kid(30, 40, '#e63946')}${kid(76, 44, '#5aa9e6', '#c68642')}
     <path d="M40 58 L60 52" stroke="#f2c19b" stroke-width="5" stroke-linecap="round"/>
     <path d="M24 42 Q30 48 36 42 Z" fill="#8a2e2e"/>
     <text x="30" y="18" text-anchor="middle" font-size="12" font-weight="900" fill="${INK}">JA JA</text>`,
  empujar: `${kid(30, 40, '#e63946')}
     <g transform="rotate(25 72 60)">${kid(72, 40, '#5aa9e6', '#c68642')}</g>
     <path d="M40 56 L58 56" stroke="#f2c19b" stroke-width="5" stroke-linecap="round"/>
     <path d="M88 30 L94 26 M90 42 L96 42" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
  gritar: `<circle cx="40" cy="50" r="24" fill="#f2c19b" ${STROKE}/>
     <path d="M28 40 L36 44 M52 40 L44 44" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <ellipse cx="40" cy="62" rx="9" ry="7" fill="#8a2e2e" ${STROKE}/>
     <path d="M70 40 L86 32 M72 52 L92 52 M70 64 L86 72" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`,
  romper: `<rect x="18" y="38" width="28" height="12" rx="3" fill="#ff8c1a" ${STROKE} transform="rotate(-25 32 44)"/>
     <rect x="54" y="38" width="28" height="12" rx="3" fill="#ff8c1a" ${STROKE} transform="rotate(25 68 44)"/>
     <path d="M46 30 L50 40 L44 46 L52 56" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="M30 70 L36 76 M70 70 L64 76 M50 72 L50 82" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`,
  irse: `${kid(46, 32, '#8e44ad', '#8d5524')}
     <path d="M40 68 L34 84 M52 68 L60 84" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
     <path d="M66 50 H92 M84 42 L92 50 L84 58" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
};

export const ACTION_IDS = Object.keys(ACTIONS);

export function actionSvg(id, className = '') {
  return svg(ACTIONS[id], { className: `action ${className}` });
}
