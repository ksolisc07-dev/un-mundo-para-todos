import { el } from '../core/dom.js';
import { mascotSvg } from '../art/mascot.js';
import { topBar } from '../components/ui.js';
import { hrefFor } from '../core/router.js';

export function notFoundScreen(ctx) {
  const view = el(
    'div',
    { class: 'screen' },
    topBar(ctx, { backHref: hrefFor('home'), backLabel: 'Inicio', title: 'No encontramos esta página' }),
    el(
      'div',
      { class: 'panel center' },
      el('span', { class: 'soon-mascot', html: mascotSvg('normal') }),
      el('p', {}, 'Vuelve al inicio para elegir un mundo.'),
      el('a', { class: 'btn btn--primary', href: hrefFor('home') }, 'Ir al inicio')
    )
  );
  return { el: view, title: 'Página no encontrada' };
}
