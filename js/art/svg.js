/** Utilidades comunes para las ilustraciones SVG originales del proyecto. */

export const INK = '#2d2a32';
export const STROKE = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

/**
 * Envuelve dibujos en un <svg>. Las imágenes son decorativas (aria-hidden)
 * porque el botón o contenedor que las incluye lleva su propio nombre accesible.
 */
export function svg(inner, { viewBox = '0 0 100 100', className = '' } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="art ${className}" aria-hidden="true" focusable="false">${inner}</svg>`;
}

export function eye(cx, cy, r = 2.6) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx + r * 0.35}" cy="${cy - r * 0.35}" r="${r * 0.35}" fill="#fff"/>`;
}
