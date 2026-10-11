/**
 * Punto de entrada de Un Mundo Para Todos.
 * Crea los servicios compartidos (estado, voz, sonidos, LSEC) y dibuja la
 * pantalla que corresponde a la dirección (#/…).
 */
import { createStore } from './core/store.js';
import { createSpeech } from './core/speech.js';
import { createSfx } from './core/sfx.js';
import { parseHash } from './core/router.js';
import { lsecRegistry } from './data/lsec.js';
import { landscapeSvg, cloudSvg, sunSvg } from './art/scenes.js';
import { homeScreen } from './screens/home.js';
import { worldScreen } from './screens/world.js';
import { playScreen } from './screens/play.js';
import { prefsScreen } from './screens/prefs.js';
import { teachersScreen } from './screens/teachers.js';
import { notFoundScreen } from './screens/notFound.js';

const SCREENS = {
  home: homeScreen,
  world: worldScreen,
  play: playScreen,
  prefs: prefsScreen,
  teachers: teachersScreen,
  notFound: notFoundScreen,
};

const store = createStore();
const speech = createSpeech(() => store.prefs);
const sfx = createSfx(() => store.prefs);
const main = document.getElementById('main');
const announcer = document.getElementById('announcer');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

let cleanups = [];
let firstRender = true;

const ctx = {
  store,
  speech,
  sfx,
  lsec: lsecRegistry,
  navigate(href) {
    window.location.hash = href;
  },
  rerender: render,
  /** Mensaje para lectores de pantalla (región aria-live). */
  announce(text) {
    announcer.textContent = '';
    // Pequeña pausa para que el lector detecte el cambio aunque el texto se repita.
    setTimeout(() => {
      announcer.textContent = text;
    }, 60);
  },
  onCleanup(fn) {
    cleanups.push(fn);
  },
};

function applyPrefs(prefs) {
  const root = document.documentElement;
  const reduce = prefs.motion === 'reduce' || (prefs.motion === 'auto' && reducedMotionQuery.matches);
  root.classList.toggle('reduce-motion', reduce);
  root.classList.toggle('high-contrast', prefs.highContrast);
  root.classList.toggle('large-text', prefs.largeText);
  root.classList.toggle('color-labels', prefs.colorLabels);
}

function render() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  speech.cancel();

  const route = parseHash(window.location.hash);
  const screen = (SCREENS[route.name] || notFoundScreen)(ctx, route.params);
  main.replaceChildren(screen.el);
  main.dataset.screen = route.name;
  document.title = `${screen.title} · Un Mundo Para Todos`;
  window.scrollTo(0, 0);

  // Al cambiar de pantalla, el foco va al título para teclado y lectores de pantalla.
  if (!firstRender) main.querySelector('h1')?.focus({ preventScroll: true });
  firstRender = false;
  screen.onShow?.();
}

function paintSky() {
  const sky = document.getElementById('sky');
  sky.innerHTML = `<div class="sun">${sunSvg()}</div>
    <div class="cloud cloud--1">${cloudSvg()}</div>
    <div class="cloud cloud--2">${cloudSvg()}</div>
    <div class="cloud cloud--3">${cloudSvg()}</div>
    ${landscapeSvg()}`;
}

document.querySelector('.skip-link')?.addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
});

store.subscribe((state) => applyPrefs(state.prefs));
reducedMotionQuery.addEventListener?.('change', () => applyPrefs(store.prefs));
applyPrefs(store.prefs);
paintSky();
window.addEventListener('hashchange', render);
render();
document.documentElement.classList.add('app-ready');

// Aplicación instalable y con uso sin conexión (si el navegador lo permite).
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* sin service worker la plataforma funciona igual, sólo sin modo sin conexión */
    });
  });
}
