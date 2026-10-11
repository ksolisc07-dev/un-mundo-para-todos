/** Pantalla de juego: ejecuta una actividad y muestra el final con estrellas. */
import { el } from '../core/dom.js';
import { worldById } from '../data/worlds.js';
import { getActivity, activityKey } from '../games/registry.js';
import { hrefFor } from '../core/router.js';
import { mascotSvg } from '../art/mascot.js';
import { icon } from '../art/icons.js';
import { topBar, starRow } from '../components/ui.js';
import { choiceGame } from '../components/choiceGame.js';
import { memoryGame } from '../components/memoryGame.js';
import { celebrate } from '../components/celebrate.js';
import { notFoundScreen } from './notFound.js';

export function playScreen(ctx, params) {
  const world = worldById(params.world);
  const activity = world && getActivity(world.id, params.activity);
  if (!activity) return notFoundScreen(ctx);
  const key = activityKey(world.id, activity.id);
  if (!ctx.store.isActivityEnabled(key)) {
    ctx.navigate(hrefFor('world', { world: world.id }));
    return { el: el('div'), title: world.name };
  }

  const level = params.level || ctx.store.levelFor(key);
  const rounds = ctx.store.teacher.rounds;
  const worldHref = hrefFor('world', { world: world.id });

  const progress = el('ol', { class: 'round-dots' });
  const levelChip = el('span', { class: 'level-chip' }, `Nivel ${level}`);
  const container = el('div', { class: 'play-area' });
  const view = el(
    'div',
    { class: 'screen screen--play', style: `--world-color: ${world.color}` },
    topBar(ctx, { backHref: worldHref, backLabel: 'Juegos', title: activity.title, extra: [levelChip] }),
    progress,
    container
  );

  function renderProgress(done, total) {
    progress.setAttribute('aria-label', `Progreso: ${Math.min(done, total)} de ${total}`);
    progress.replaceChildren(
      ...Array.from({ length: total }, (_, i) =>
        el('li', { class: `dot ${i < done ? 'dot--done' : ''} ${i === done ? 'dot--current' : ''}`, html: i < done ? icon('star') : '' })
      )
    );
  }

  function finish(stats) {
    const before = ctx.store.starsFor(key);
    const hadLevel = Boolean(ctx.store.getProgress(key).levels[level]);
    ctx.store.recordCompletion(key, level, stats);
    const after = ctx.store.starsFor(key);
    const newStar = !hadLevel;
    const message = newStar ? '¡Lo lograste! Ganaste una estrella.' : '¡Lo lograste otra vez!';
    const showNext = level < 3 && ctx.store.teacher.difficulty === 'auto';

    const finishView = el(
      'section',
      { class: 'finish', 'aria-labelledby': 'finish-title' },
      el('span', { class: 'finish-mascot', html: mascotSvg('happy', 'is-flying') }),
      el('h2', { id: 'finish-title', tabindex: '-1' }, message),
      starRow(after, 3, { highlight: newStar && after > before ? after : null }),
      el(
        'div',
        { class: 'finish-actions' },
        el(
          'button',
          {
            type: 'button',
            class: 'btn btn--big',
            'data-action': 'replay',
            onclick: () => {
              const href = hrefFor('play', { world: world.id, activity: activity.id, level });
              if (window.location.hash === href) ctx.rerender();
              else ctx.navigate(href);
            },
          },
          el('span', { html: icon('replay') }),
          'Jugar otra vez'
        ),
        showNext
          ? el(
              'a',
              {
                class: 'btn btn--big btn--primary',
                href: hrefFor('play', { world: world.id, activity: activity.id, level: level + 1 }),
                'data-action': 'next',
              },
              el('span', { html: icon('next') }),
              `Nivel ${level + 1}`
            )
          : null,
        el('a', { class: 'btn btn--big', href: worldHref, 'data-action': 'back' }, el('span', { html: icon('back') }), 'Otros juegos')
      )
    );
    container.replaceChildren(finishView);
    finishView.querySelector('h2').focus();
    ctx.sfx.play('celebrate');
    celebrate(ctx.store.prefs, { big: true });
    ctx.speech.speak(message);
    ctx.announce(message);
  }

  const game =
    activity.kind === 'memory'
      ? memoryGame(ctx, activity, { level, onProgress: renderProgress, onFinish: finish })
      : choiceGame(ctx, activity, { level, rounds, onProgress: renderProgress, onFinish: finish });
  container.append(game.el);
  ctx.onCleanup(() => game.destroy());

  return {
    el: view,
    title: `${activity.title} (nivel ${level})`,
    onShow: () => game.start(),
  };
}
