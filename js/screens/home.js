/** Pantalla principal: el mapa de mundos. */
import { el } from '../core/dom.js';
import { WORLDS } from '../data/worlds.js';
import { worldSvg } from '../art/scenes.js';
import { mascotSvg } from '../art/mascot.js';
import { icon } from '../art/icons.js';
import { activitiesFor, activityKey } from '../games/registry.js';
import { hrefFor } from '../core/router.js';
import { iconButton, muteButton, speakButton } from '../components/ui.js';

const GREETING = '¡Hola! Soy Tito. Elige un mundo para jugar.';

function worldStars(store, worldId) {
  const list = activitiesFor(worldId).filter((a) => store.isActivityEnabled(activityKey(worldId, a.id)));
  const earned = list.reduce((sum, a) => sum + store.starsFor(activityKey(worldId, a.id)), 0);
  return { earned, total: list.length * 3 };
}

export function homeScreen(ctx) {
  const cards = WORLDS.map((world) => {
    const ready = world.status === 'ready';
    const stars = ready ? worldStars(ctx.store, world.id) : null;
    const label = ready
      ? `${world.name}. ${stars.earned} de ${stars.total} estrellas.`
      : `${world.name}. Próximamente.`;
    return el(
      'li',
      {},
      el(
        'a',
        {
          class: `world-card ${ready ? '' : 'world-card--soon'}`,
          href: hrefFor('world', { world: world.id }),
          style: `--world-color: ${world.color}`,
          'aria-label': label,
          'data-world': world.id,
        },
        el('span', { class: 'world-art', html: worldSvg(world.id) }),
        el('span', { class: 'world-name' }, world.name),
        ready
          ? el('span', { class: 'world-stars', 'aria-hidden': 'true' }, el('span', { html: icon('star') }), `${stars.earned}/${stars.total}`)
          : el('span', { class: 'badge-soon', 'aria-hidden': 'true' }, el('span', { html: icon('clock') }), 'Pronto')
      )
    );
  });

  const view = el(
    'div',
    { class: 'screen screen--home' },
    el(
      'header',
      { class: 'home-header' },
      el('div', { class: 'mascot-hero', html: mascotSvg('happy', 'is-flying') }),
      el(
        'div',
        { class: 'home-title' },
        el('h1', { tabindex: '-1' }, 'Un Mundo Para Todos'),
        el('p', { class: 'bubble' }, speakButton(ctx, () => GREETING, 'Escuchar saludo'), el('span', {}, GREETING))
      )
    ),
    el('nav', { 'aria-label': 'Mundos' }, el('ul', { class: 'world-grid' }, cards)),
    el(
      'footer',
      { class: 'home-footer' },
      iconButton({ iconName: 'gear', label: 'Preferencias', href: hrefFor('prefs') }),
      iconButton({ iconName: 'adult', label: 'Docentes y familias', href: hrefFor('teachers') }),
      muteButton(ctx)
    ),
    ctx.store.persistent
      ? null
      : el('p', { class: 'notice' }, 'Este navegador no permite guardar el progreso; se perderá al cerrar la página.')
  );

  return { el: view, title: 'Inicio' };
}
