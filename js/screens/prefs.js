/** Preferencias de accesibilidad (abiertas a cualquier persona). */
import { el } from '../core/dom.js';
import { hrefFor } from '../core/router.js';
import { topBar } from '../components/ui.js';
import { prefsForm } from '../components/prefsForm.js';

export function prefsScreen(ctx) {
  const view = el(
    'div',
    { class: 'screen screen--form' },
    topBar(ctx, { backHref: hrefFor('home'), backLabel: 'Inicio', title: 'Preferencias' }),
    el('p', { class: 'lead' }, 'Los cambios se guardan solos en este dispositivo.'),
    prefsForm(ctx)
  );
  return { el: view, title: 'Preferencias' };
}
