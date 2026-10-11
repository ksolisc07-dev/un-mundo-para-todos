/** Pequeños ayudantes para crear elementos sin bibliotecas externas. */

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * el('button', { class: 'x', onclick: fn, html: '<svg…>' }, 'texto', otroNodo)
 * - `html` inserta marcado de confianza (SVG generado por la propia app).
 * - Los atributos con valor false/null/undefined se omiten.
 */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === false || value === null || value === undefined) continue;
    if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function prefersReducedMotion() {
  return document.documentElement.classList.contains('reduce-motion');
}
