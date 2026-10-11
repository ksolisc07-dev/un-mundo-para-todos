/** Celebraciones visuales opcionales (confeti de estrellas). */
import { el, prefersReducedMotion } from '../core/dom.js';

const COLORS = ['#ffd23f', '#ff7eb6', '#5aa9e6', '#2fa84f', '#ff8c1a', '#b388eb'];

export function celebrate(prefs, { big = false } = {}) {
  const layer = document.getElementById('celebration-layer');
  if (!layer || !prefs.celebrations || prefersReducedMotion()) return;
  const count = big ? 36 : 14;
  for (let i = 0; i < count; i += 1) {
    const piece = el('span', { class: 'confetti' });
    piece.style.setProperty('--x', `${Math.random() * 100}vw`);
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 30}vw`);
    piece.style.setProperty('--delay', `${Math.random() * 0.25}s`);
    piece.style.setProperty('--color', COLORS[i % COLORS.length]);
    piece.style.setProperty('--size', `${12 + Math.random() * 14}px`);
    layer.append(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}
