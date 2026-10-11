/** Figuras geométricas (SVG, 100×100) y botes de pintura para el mundo de colores. */
import { INK, STROKE, svg } from './svg.js';

function starPoints(cx, cy, outer, inner, points = 5) {
  return Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
  }).join(' ');
}

const SHAPES = {
  circulo: (paint) => `<circle cx="50" cy="50" r="34" ${paint}/>`,
  cuadrado: (paint) => `<rect x="18" y="18" width="64" height="64" rx="3" ${paint}/>`,
  triangulo: (paint) => `<polygon points="50,14 88,82 12,82" ${paint}/>`,
  rectangulo: (paint) => `<rect x="8" y="30" width="84" height="40" rx="3" ${paint}/>`,
  estrella: (paint) => `<polygon points="${starPoints(50, 53, 40, 17)}" ${paint}/>`,
  corazon: (paint) =>
    `<path d="M50 86 C12 60 10 24 34 22 C43 21 49 28 50 33 C51 28 57 21 66 22 C90 24 88 60 50 86 Z" ${paint}/>`,
  rombo: (paint) => `<polygon points="50,8 84,50 50,92 16,50" ${paint}/>`,
  ovalo: (paint) => `<ellipse cx="50" cy="50" rx="26" ry="40" ${paint}/>`,
};

export const SHAPE_ART_IDS = Object.keys(SHAPES);

/**
 * @param {string} id figura
 * @param {object} opts fill (color de relleno), outline (sólo contorno punteado),
 *   rotate (grados), scale (0.5..1)
 */
export function shapeSvg(id, { fill = '#1d6fd6', outline = false, rotate = 0, scale = 1, className = '' } = {}) {
  const draw = SHAPES[id];
  if (!draw) throw new Error(`No existe la figura "${id}"`);
  const paint = outline
    ? `fill="#ffffff" fill-opacity=".55" stroke="${INK}" stroke-width="4" stroke-dasharray="8 6" stroke-linejoin="round"`
    : `fill="${fill}" ${STROKE} stroke-width="3"`;
  const transform = `transform="translate(50 50) rotate(${rotate}) scale(${scale}) translate(-50 -50)"`;
  return svg(`<g ${transform}>${draw(paint)}</g>`, { className: `shape ${className}` });
}

/** Bote de pintura del color indicado. `pattern` añade una marca no cromática. */
export function paintPotSvg(hex, className = '') {
  return svg(
    `<path d="M22 40 L78 40 L72 88 Q50 94 28 88 Z" fill="#f4f1ec" ${STROKE}/>
     <ellipse cx="50" cy="40" rx="28" ry="9" fill="${hex}" ${STROKE}/>
     <path d="M26 44 Q30 64 36 58 Q40 54 42 66 Q46 74 50 62 Q54 52 58 60 Q62 70 66 56 Q70 48 74 44 Z" fill="${hex}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
     <path d="M30 18 Q50 6 70 18" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
     <path d="M22 40 Q24 24 30 18 M78 40 Q76 24 70 18" fill="none" stroke="${INK}" stroke-width="2.5"/>`,
    { className: `paint-pot ${className}` }
  );
}

/** Caja abierta para clasificar; muestra encima la figura o color de la categoría. */
export function binSvg(labelSvgInner, className = '') {
  return svg(
    `<path d="M10 52 L90 52 L82 94 L18 94 Z" fill="#c98b4b" ${STROKE}/>
     <path d="M10 52 L22 40 L78 40 L90 52 Z" fill="#a8703a" ${STROKE}/>
     <g transform="translate(26 0) scale(.48)">${labelSvgInner}</g>`,
    { className: `bin ${className}` }
  );
}

/** Dibujo interior (sin <svg>) de una figura, útil para componer. */
export function shapeInner(id, fill) {
  return SHAPES[id](`fill="${fill}" ${STROKE} stroke-width="4"`);
}
