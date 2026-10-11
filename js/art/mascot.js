/**
 * Tito, el colibrí: mascota original del proyecto (los colibríes son
 * muy comunes en Ecuador). Licencia CC BY 4.0.
 */
import { INK, STROKE, svg, eye } from './svg.js';

export function mascotSvg(mood = 'normal', className = '') {
  const eyes =
    mood === 'happy'
      ? `<path d="M53 42 q4 -5 8 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
      : `<circle cx="57" cy="42" r="6" fill="#fff" ${STROKE}/>${eye(58, 42, 3.4)}`;
  const mouth =
    mood === 'happy'
      ? `<path d="M48 54 q5 5 10 1" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
      : '';
  return svg(
    `<g class="mascot-wing mascot-wing--back"><path d="M74 52 Q92 18 112 20 Q104 44 80 60 Z" fill="#7fd6a8" ${STROKE}/></g>
     <path d="M84 74 L108 92 L100 96 L104 104 L82 86 Z" fill="#1c8f5a" ${STROKE}/>
     <ellipse cx="74" cy="66" rx="22" ry="17" fill="#2fbf71" ${STROKE} transform="rotate(25 74 66)"/>
     <ellipse cx="68" cy="72" rx="12" ry="9" fill="#d8f5e3" transform="rotate(25 68 72)"/>
     <path d="M46 48 L6 54 L46 53 Z" fill="#3b3346" ${STROKE}/>
     <circle cx="58" cy="46" r="15" fill="#2fbf71" ${STROKE}/>
     <path d="M50 56 q6 8 16 4 q-4 -6 -16 -4 Z" fill="#e63980"/>
     ${eyes}${mouth}
     <circle cx="66" cy="52" r="3" fill="#ff9fc3" opacity=".8"/>
     <g class="mascot-wing mascot-wing--front"><path d="M70 58 Q80 22 104 26 Q98 52 76 66 Z" fill="#a7e8c4" ${STROKE}/></g>`,
    { viewBox: '0 0 120 110', className: `mascot mascot--${mood} ${className}` }
  );
}
