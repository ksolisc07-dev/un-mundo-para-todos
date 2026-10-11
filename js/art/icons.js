/** Íconos de interfaz (originales, 24×24, trazo redondeado). */

const wrap = (inner, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${extra}>${inner}</svg>`;

export const ICONS = {
  home: wrap('<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>'),
  back: wrap('<path d="M15 5l-7 7 7 7"/>'),
  next: wrap('<path d="M9 5l7 7-7 7"/>'),
  speaker: wrap(
    '<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M16 8.5a5 5 0 0 1 0 7"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12"/>'
  ),
  mute: wrap('<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>'),
  gear: wrap(
    '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'
  ),
  adult: wrap(
    '<circle cx="9" cy="6" r="3"/><path d="M3.5 21v-5a5.5 5.5 0 0 1 11 0v5"/><path d="M14 10h7v9h-7"/><path d="M17.5 10v9"/>'
  ),
  star: wrap('<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="currentColor"/>'),
  starEmpty: wrap('<path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/>'),
  hint: wrap(
    '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>'
  ),
  replay: wrap('<path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v5h5"/>'),
  check: wrap('<path d="M4.5 12.5l5 5L20 7"/>', 'stroke-width="3.2"'),
  hand: wrap(
    '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11M11 10V4a1.5 1.5 0 0 1 3 0v6M14 10V5.5a1.5 1.5 0 0 1 3 0V13c0 4-2.5 8-6.5 8-2.6 0-4.1-1.4-5.4-3.5L3.4 14.6a1.5 1.5 0 0 1 2.4-1.8L8 15"/>'
  ),
  ear: wrap('<path d="M7 9a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 9.5a2 2 0 0 1 4 0"/>'),
  eye: wrap('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  video: wrap('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10.5l5-3v9l-5-3"/>'),
  lock: wrap('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  clock: wrap('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  trash: wrap('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
};

export function icon(name) {
  return ICONS[name] || '';
}
