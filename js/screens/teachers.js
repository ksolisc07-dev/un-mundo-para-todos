/** Espacio para docentes y familias (protegido por una pregunta para adultos). */
import { el } from '../core/dom.js';
import { hrefFor } from '../core/router.js';
import { WORLDS } from '../data/worlds.js';
import { ROUND_OPTIONS } from '../core/store.js';
import { activitiesFor, activityKey } from '../games/registry.js';
import { topBar, starRow } from '../components/ui.js';
import { prefsForm } from '../components/prefsForm.js';
import { randInt } from '../core/random.js';

// El desbloqueo dura sólo mientras la página esté abierta; no se guarda.
let unlocked = false;

const READY_WORLDS = WORLDS.filter((w) => w.status === 'ready');

function adultGate(ctx, onUnlock) {
  const a = randInt(3, 9);
  const b = randInt(3, 9);
  const error = el('p', { class: 'form-error', role: 'alert' });
  const input = el('input', {
    id: 'gate-answer',
    type: 'text',
    inputmode: 'numeric',
    autocomplete: 'off',
    pattern: '[0-9]*',
    'aria-describedby': 'gate-help',
  });
  const form = el(
    'form',
    {
      class: 'panel gate',
      onsubmit: (event) => {
        event.preventDefault();
        if (Number(input.value.trim()) === a * b) {
          unlocked = true;
          onUnlock();
        } else {
          error.textContent = 'Esa no es la respuesta. Inténtalo otra vez.';
          input.select();
        }
      },
    },
    el('h2', {}, 'Sólo para personas adultas'),
    el(
      'p',
      { id: 'gate-help' },
      'Esta sección permite cambiar la configuración y borrar el progreso. Para entrar, responde:'
    ),
    el('label', { for: 'gate-answer', class: 'gate-question' }, `¿Cuánto es ${a} × ${b}?`),
    input,
    error,
    el('button', { type: 'submit', class: 'btn btn--primary' }, 'Entrar')
  );
  return form;
}

function activitiesSection(ctx) {
  return el(
    'section',
    { class: 'panel', 'aria-labelledby': 't-activities' },
    el('h2', { id: 't-activities' }, 'Actividades disponibles'),
    el('p', {}, 'Desmarca las actividades que no quieres mostrar a las niñas y los niños.'),
    READY_WORLDS.map((world) =>
      el(
        'fieldset',
        { class: 'field field--checks' },
        el('legend', {}, world.name),
        activitiesFor(world.id).map((activity) => {
          const key = activityKey(world.id, activity.id);
          const id = `act-${world.id}-${activity.id}`;
          return el(
            'div',
            { class: 'check' },
            el('input', {
              type: 'checkbox',
              id,
              checked: ctx.store.isActivityEnabled(key),
              'aria-describedby': `${id}-goal`,
              onchange: (e) => ctx.store.setActivityEnabled(key, e.target.checked),
            }),
            el('label', { for: id }, activity.title),
            el('p', { class: 'help', id: `${id}-goal` }, activity.goal)
          );
        })
      )
    )
  );
}

function difficultySection(ctx) {
  const choices = [
    ['auto', 'Automática', 'Empieza en el nivel 1 y avanza cuando se completa cada nivel.'],
    [1, 'Nivel 1 (inicial)', 'Menos opciones y cantidades pequeñas.'],
    [2, 'Nivel 2 (intermedio)', 'Más opciones y elementos nuevos.'],
    [3, 'Nivel 3 (avanzado)', 'Todas las opciones y cantidades hasta 10.'],
  ];
  const rounds = ROUND_OPTIONS.map((n) => [n, `${n} rondas`]);
  return el(
    'section',
    { class: 'panel', 'aria-labelledby': 't-difficulty' },
    el('h2', { id: 't-difficulty' }, 'Dificultad y duración'),
    el(
      'fieldset',
      { class: 'field field--radios' },
      el('legend', {}, 'Dificultad'),
      choices.map(([value, label, help]) => {
        const id = `diff-${value}`;
        return el(
          'div',
          { class: 'radio' },
          el('input', {
            type: 'radio',
            name: 'difficulty',
            id,
            checked: ctx.store.teacher.difficulty === value,
            'aria-describedby': `${id}-help`,
            onchange: () => ctx.store.updateTeacher({ difficulty: value }),
          }),
          el('label', { for: id }, label),
          el('p', { class: 'help', id: `${id}-help` }, help)
        );
      })
    ),
    el(
      'fieldset',
      { class: 'field field--radios field--inline' },
      el('legend', {}, 'Rondas por juego (no aplica a Memoria)'),
      rounds.map(([value, label]) => {
        const id = `rounds-${value}`;
        return el(
          'div',
          { class: 'radio' },
          el('input', {
            type: 'radio',
            name: 'rounds',
            id,
            checked: ctx.store.teacher.rounds === value,
            onchange: () => ctx.store.updateTeacher({ rounds: value }),
          }),
          el('label', { for: id }, label)
        );
      })
    ),
    el(
      'details',
      {},
      el('summary', {}, 'Qué cambia en cada nivel'),
      READY_WORLDS.map((world) =>
        el(
          'div',
          {},
          el('h3', {}, world.name),
          el(
            'ul',
            { class: 'level-list' },
            activitiesFor(world.id).map((a) =>
              el(
                'li',
                {},
                el('strong', {}, `${a.title}: `),
                [1, 2, 3].map((l) => `Nivel ${l}: ${a.levels[l]} `).join(' ')
              )
            )
          )
        )
      )
    )
  );
}

function progressSection(ctx, rerender) {
  const rows = READY_WORLDS.flatMap((world) =>
    activitiesFor(world.id).map((activity) => {
      const key = activityKey(world.id, activity.id);
      const p = ctx.store.getProgress(key);
      const pct = p.answered ? `${Math.round((p.firstTry / p.answered) * 100)} %` : '—';
      return el(
        'tr',
        {},
        el('td', {}, world.name),
        el('th', { scope: 'row' }, activity.title),
        el('td', {}, starRow(ctx.store.starsFor(key))),
        el('td', {}, String(p.completions)),
        el('td', {}, pct),
        el('td', {}, p.last || '—')
      );
    })
  );
  const reset = el(
    'button',
    {
      type: 'button',
      class: 'btn btn--danger',
      'data-action': 'reset-progress',
      onclick: () => {
        if (window.confirm('¿Borrar todo el progreso guardado en este dispositivo? Esta acción no se puede deshacer.')) {
          ctx.store.resetProgress();
          ctx.announce('Progreso borrado.');
          rerender('t-progress');
        }
      },
    },
    'Borrar el progreso'
  );
  const resetAll = el(
    'button',
    {
      type: 'button',
      class: 'btn',
      'data-action': 'reset-all',
      onclick: () => {
        if (window.confirm('¿Restablecer todo? Se borrará el progreso y volverán las preferencias y la configuración iniciales.')) {
          ctx.store.resetAll();
          ctx.announce('Todo fue restablecido.');
          rerender('t-progress');
        }
      },
    },
    'Restablecer todo'
  );
  return el(
    'section',
    { class: 'panel', 'aria-labelledby': 't-progress' },
    el('h2', { id: 't-progress', tabindex: '-1' }, 'Progreso en este dispositivo'),
    el(
      'p',
      {},
      'El progreso se guarda sólo en este navegador y es compartido por quienes usen este dispositivo. No se guardan nombres ni datos personales.'
    ),
    el(
      'div',
      { class: 'table-wrap', tabindex: '0', role: 'region', 'aria-label': 'Tabla de progreso' },
      el(
        'table',
        { class: 'progress-table' },
        el('caption', { class: 'visually-hidden' }, 'Progreso por actividad'),
        el(
          'thead',
          {},
          el(
            'tr',
            {},
            ['Mundo', 'Actividad', 'Niveles completados', 'Veces terminada', 'Aciertos al primer intento', 'Última vez'].map((h) =>
              el('th', { scope: 'col' }, h)
            )
          )
        ),
        el('tbody', {}, rows)
      )
    ),
    el('div', { class: 'actions' }, reset, resetAll)
  );
}

function recommendations() {
  const tips = [
    ['Sesiones cortas y acompañadas', 'Entre 10 y 15 minutos son suficientes en educación inicial. Juega junto a la niña o el niño, nombra lo que aparece y conversa sobre ello.'],
    ['Primero mostrar, luego dejar hacer', 'El botón de ayuda (bombillo) señala la respuesta con una mano: úsalo como demostración la primera vez.'],
    ['El error es parte del aprendizaje', 'No hay castigos ni tiempo límite. Celebra el esfuerzo y la constancia, no la rapidez. Evita comparar resultados entre niños.'],
    ['Del juego al mundo real', 'Cuenta objetos reales del aula, busca colores en la ropa, imita sonidos de animales, clasifica bloques por forma.'],
    ['Niñas y niños que aún no leen', 'Mantén activas las instrucciones habladas y la lectura automática. Todas las respuestas se eligen con imágenes.'],
    ['Niñas y niños sordos', 'Los juegos de sombras, memoria, figuras, secuencias, clasificación, contar y comparar no requieren audio. La LSEC se aprende con personas competentes y con la comunidad sorda: esta plataforma sólo mostrará videos de LSEC auténticos y validados.'],
    ['Baja visión', 'Activa «Alto contraste» y «Texto más grande». También puedes usar el zoom del navegador (Ctrl y +).'],
    ['Motricidad', 'Los botones son grandes. Todo se puede usar con teclado (Tab para moverse, Enter o Espacio para elegir) y con pulsadores que emulen el teclado.'],
    ['Sensibilidad sensorial (por ejemplo, TEA)', 'Reduce las animaciones, desactiva el confeti o los sonidos y usa 3 rondas por juego.'],
    ['Grupos diversos', 'Usa la dificultad automática para el avance individual o fija un nivel para trabajar con todo el grupo a la vez.'],
  ];
  return el(
    'section',
    { class: 'panel', 'aria-labelledby': 't-tips' },
    el('h2', { id: 't-tips' }, 'Recomendaciones pedagógicas'),
    el('dl', { class: 'tips' }, tips.flatMap(([t, d]) => [el('dt', {}, t), el('dd', {}, d)]))
  );
}

export function teachersScreen(ctx) {
  const content = el('div', { class: 'teacher-content' });

  function renderContent(focusId) {
    content.replaceChildren(
      el(
        'nav',
        { class: 'panel toc', 'aria-label': 'Secciones' },
        el(
          'ul',
          {},
          [
            ['t-activities', 'Actividades'],
            ['t-difficulty', 'Dificultad'],
            ['t-progress', 'Progreso'],
            ['prefs-audio', 'Sonido y vista'],
            ['t-tips', 'Recomendaciones'],
          ].map(([id, label]) =>
            el(
              'li',
              {},
              el(
                'button',
                {
                  type: 'button',
                  class: 'link-btn',
                  onclick: () => {
                    const target = document.getElementById(id);
                    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    target?.setAttribute('tabindex', '-1');
                    target?.focus({ preventScroll: true });
                  },
                },
                label
              )
            )
          )
        )
      ),
      activitiesSection(ctx),
      difficultySection(ctx),
      progressSection(ctx, renderContent),
      prefsForm(ctx),
      recommendations(),
      el(
        'section',
        { class: 'panel', 'aria-labelledby': 't-privacy' },
        el('h2', { id: 't-privacy' }, 'Privacidad'),
        el(
          'p',
          {},
          'Un Mundo Para Todos no tiene registro de usuarios, publicidad, compras ni rastreadores, y no envía datos a ningún servidor. Todo se guarda en este navegador (almacenamiento local) y se puede borrar con los botones de la sección Progreso.'
        )
      )
    );
    if (focusId) document.getElementById(focusId)?.focus();
  }

  const body = el('div', {});
  const view = el(
    'div',
    { class: 'screen screen--form' },
    topBar(ctx, { backHref: hrefFor('home'), backLabel: 'Inicio', title: 'Docentes y familias' }),
    body
  );

  if (unlocked) {
    renderContent();
    body.append(content);
  } else {
    body.append(
      adultGate(ctx, () => {
        renderContent();
        body.replaceChildren(content);
        content.querySelector('h2')?.setAttribute('tabindex', '-1');
        content.querySelector('h2')?.focus();
      })
    );
  }

  return { el: view, title: 'Docentes y familias' };
}

