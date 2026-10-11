/** Pantalla de un mundo: lista de actividades, o "próximamente". */
import { el } from '../core/dom.js';
import { worldById } from '../data/worlds.js';
import { worldSvg } from '../art/scenes.js';
import { icon } from '../art/icons.js';
import { mascotSvg } from '../art/mascot.js';
import { LSEC_CATEGORIES } from '../data/lsec.js';
import { activitiesFor, activityKey } from '../games/registry.js';
import { hrefFor } from '../core/router.js';
import { topBar, starRow, speakButton } from '../components/ui.js';
import { notFoundScreen } from './notFound.js';

const REPO_DOCS = 'https://github.com/ksolisc07-dev/un-mundo-para-todos/blob/main/docs/LSEC_VIDEOS.md';

export function worldScreen(ctx, { world: worldId }) {
  const world = worldById(worldId);
  if (!world) return notFoundScreen(ctx);
  if (world.status !== 'ready') return comingSoon(ctx, world);

  const activities = activitiesFor(world.id).filter((a) => ctx.store.isActivityEnabled(activityKey(world.id, a.id)));

  const cards = activities.map((activity) => {
    const key = activityKey(world.id, activity.id);
    const stars = ctx.store.starsFor(key);
    return el(
      'li',
      {},
      el(
        'a',
        {
          class: 'activity-card',
          href: hrefFor('play', { world: world.id, activity: activity.id }),
          'aria-label': `${activity.title}. ${stars} de 3 estrellas.`,
          'data-activity': activity.id,
        },
        el('span', { class: 'activity-art', html: activity.icon() }),
        el('span', { class: 'activity-title' }, activity.title),
        starRow(stars)
      )
    );
  });

  const body = cards.length
    ? el('ul', { class: 'activity-grid', style: `--world-color: ${world.color}` }, cards)
    : el(
        'p',
        { class: 'notice' },
        'No hay actividades activas en este mundo. Una persona adulta puede activarlas en «Docentes y familias».'
      );

  const view = el(
    'div',
    { class: 'screen screen--world', style: `--world-color: ${world.color}` },
    topBar(ctx, { backHref: hrefFor('home'), backLabel: 'Inicio', title: world.name }),
    el(
      'div',
      { class: 'world-banner' },
      el('span', { class: 'world-banner-art', html: worldSvg(world.id) }),
      el('p', { class: 'bubble' }, speakButton(ctx, () => `${world.say}. Elige un juego.`, 'Escuchar'), 'Elige un juego')
    ),
    body
  );

  return {
    el: view,
    title: world.name,
    onShow: () => {
      if (ctx.store.prefs.autoSpeak) ctx.speech.speak(`${world.say}. Elige un juego.`);
    },
  };
}

function comingSoon(ctx, world) {
  const extra =
    world.id === 'senas'
      ? el(
          'section',
          { class: 'panel lsec-status', 'aria-labelledby': 'lsec-status-title' },
          el('h2', { id: 'lsec-status-title' }, 'Estado de los videos LSEC'),
          el(
            'p',
            {},
            `Videos validados: ${ctx.lsec.publishableCount()} de ${ctx.lsec.entries.length}. `,
            'Mientras no existan videos auténticos y validados, esta sección no muestra señas.'
          ),
          ...LSEC_CATEGORIES.map((cat) => {
            const items = ctx.lsec.entries.filter((e) => e.category === cat.id);
            return el(
              'details',
              {},
              el('summary', {}, `${cat.name} (${items.length})`),
              el(
                'ul',
                { class: 'chip-list' },
                items.map((e) =>
                  el(
                    'li',
                    { class: `chip chip--${ctx.lsec.videoFor(e.concept) ? 'ok' : 'pending'}` },
                    e.label,
                    ' — ',
                    ctx.lsec.videoFor(e.concept) ? 'video validado' : 'pendiente'
                  )
                )
              )
            );
          }),
          el(
            'p',
            {},
            '¿Eres parte de la comunidad sorda ecuatoriana, intérprete o docente de LSEC y quieres colaborar? ',
            el('a', { href: REPO_DOCS, target: '_blank', rel: 'noopener' }, 'Lee la guía para aportar videos de LSEC'),
            '.'
          )
        )
      : null;

  const view = el(
    'div',
    { class: 'screen screen--soon', style: `--world-color: ${world.color}` },
    topBar(ctx, { backHref: hrefFor('home'), backLabel: 'Inicio', title: world.name }),
    el(
      'div',
      { class: 'soon-hero' },
      el('span', { class: 'world-banner-art', html: worldSvg(world.id) }),
      el('span', { class: 'soon-mascot', html: mascotSvg('normal') }),
      el(
        'p',
        { class: 'bubble' },
        speakButton(ctx, () => world.say, 'Escuchar'),
        el('span', { html: icon('clock'), class: 'inline-icon' }),
        ' Próximamente'
      )
    ),
    el(
      'section',
      { class: 'panel', 'aria-labelledby': 'planned-title' },
      el('h2', { id: 'planned-title' }, 'Este mundo está en preparación'),
      el('p', {}, 'Todavía no tiene juegos. Estas son las actividades planificadas:'),
      el('ul', { class: 'planned-list' }, world.planned.map((p) => el('li', {}, p))),
      world.note ? el('p', { class: 'note' }, world.note) : null
    ),
    extra
  );
  return {
    el: view,
    title: world.name,
    onShow: () => {
      if (ctx.store.prefs.autoSpeak) ctx.speech.speak(world.say);
    },
  };
}
