/**
 * Estado persistente de la plataforma, guardado SÓLO en el navegador
 * (localStorage). No se guarda ningún dato personal: ni nombres, ni edades,
 * ni identificadores. Sólo preferencias y qué niveles se completaron.
 */

export const STORAGE_KEY = 'un-mundo-para-todos.v1';
export const LEVELS = [1, 2, 3];

export const DEFAULT_PREFS = Object.freeze({
  muted: false, // silencio rápido (botón de la barra superior)
  voice: true, // instrucciones habladas
  autoSpeak: true, // leer la instrucción al empezar cada ronda
  sfx: true, // sonidos de recompensa
  volume: 0.8, // 0..1
  rate: 0.9, // velocidad de la voz
  motion: 'auto', // 'auto' (según el sistema) | 'reduce' | 'full'
  celebrations: true, // confeti y animaciones de logro
  highContrast: false,
  largeText: false,
  colorLabels: false, // mostrar el nombre escrito de cada color
  lsec: false, // mostrar videos LSEC validados cuando existan
  lsecCamera: false, // práctica de señas frente a la cámara (lo activa una persona adulta)
});

export const DEFAULT_TEACHER = Object.freeze({
  difficulty: 'auto', // 'auto' | 1 | 2 | 3
  rounds: 5,
  disabled: {}, // { 'animales/memoria': true }
});

export const ROUND_OPTIONS = [3, 5, 8];

function defaultState() {
  return {
    version: 1,
    prefs: { ...DEFAULT_PREFS },
    teacher: { ...DEFAULT_TEACHER, disabled: {} },
    progress: {},
  };
}

function emptyProgress() {
  return { levels: {}, completions: 0, answered: 0, firstTry: 0, last: null };
}

function safeStorage() {
  try {
    const storage = globalThis.localStorage;
    const probe = '__umpt_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null; // modo privado o almacenamiento bloqueado: se usa memoria
  }
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

/** Limpia datos guardados (pueden venir de versiones viejas o estar dañados). */
export function sanitize(raw) {
  const state = defaultState();
  if (!raw || typeof raw !== 'object') return state;

  const prefs = raw.prefs && typeof raw.prefs === 'object' ? raw.prefs : {};
  for (const [key, def] of Object.entries(DEFAULT_PREFS)) {
    if (typeof prefs[key] === typeof def) state.prefs[key] = prefs[key];
  }
  state.prefs.volume = clampNumber(state.prefs.volume, 0, 1, DEFAULT_PREFS.volume);
  state.prefs.rate = clampNumber(state.prefs.rate, 0.5, 1.5, DEFAULT_PREFS.rate);
  if (!['auto', 'reduce', 'full'].includes(state.prefs.motion)) state.prefs.motion = 'auto';

  const teacher = raw.teacher && typeof raw.teacher === 'object' ? raw.teacher : {};
  if (teacher.difficulty === 'auto' || LEVELS.includes(teacher.difficulty)) {
    state.teacher.difficulty = teacher.difficulty;
  }
  if (ROUND_OPTIONS.includes(teacher.rounds)) state.teacher.rounds = teacher.rounds;
  if (teacher.disabled && typeof teacher.disabled === 'object') {
    for (const [key, value] of Object.entries(teacher.disabled)) {
      if (value === true) state.teacher.disabled[key] = true;
    }
  }

  if (raw.progress && typeof raw.progress === 'object') {
    for (const [key, entry] of Object.entries(raw.progress)) {
      if (!entry || typeof entry !== 'object') continue;
      const clean = emptyProgress();
      for (const level of LEVELS) if (entry.levels?.[level] === true) clean.levels[level] = true;
      clean.completions = clampNumber(entry.completions, 0, 1e6, 0);
      clean.answered = clampNumber(entry.answered, 0, 1e7, 0);
      clean.firstTry = clampNumber(entry.firstTry, 0, clean.answered, 0);
      clean.last = typeof entry.last === 'string' ? entry.last : null;
      state.progress[key] = clean;
    }
  }
  return state;
}

export function createStore(storage = safeStorage()) {
  let state = load();
  const listeners = new Set();

  function load() {
    if (!storage) return defaultState();
    try {
      return sanitize(JSON.parse(storage.getItem(STORAGE_KEY)));
    } catch {
      return defaultState();
    }
  }

  function save() {
    if (storage) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* almacenamiento lleno o bloqueado: el juego sigue funcionando */
      }
    }
    listeners.forEach((fn) => fn(state));
  }

  return {
    /** true si el progreso se puede guardar entre sesiones. */
    persistent: Boolean(storage),
    get prefs() {
      return state.prefs;
    },
    get teacher() {
      return state.teacher;
    },
    updatePrefs(patch) {
      state = sanitize({ ...state, prefs: { ...state.prefs, ...patch } });
      save();
    },
    updateTeacher(patch) {
      state = sanitize({ ...state, teacher: { ...state.teacher, ...patch } });
      save();
    },
    setActivityEnabled(key, enabled) {
      const disabled = { ...state.teacher.disabled };
      if (enabled) delete disabled[key];
      else disabled[key] = true;
      this.updateTeacher({ disabled });
    },
    isActivityEnabled(key) {
      return !state.teacher.disabled[key];
    },
    getProgress(key) {
      return state.progress[key] || emptyProgress();
    },
    /** Guarda el resultado de un nivel terminado. */
    recordCompletion(key, level, { answered = 0, firstTry = 0 } = {}, now = new Date()) {
      const entry = { ...this.getProgress(key) };
      entry.levels = { ...entry.levels, [level]: true };
      entry.completions += 1;
      entry.answered += answered;
      entry.firstTry += Math.min(firstTry, answered);
      entry.last = now.toISOString().slice(0, 10); // sólo la fecha, sin hora
      state.progress = { ...state.progress, [key]: entry };
      save();
    },
    /** Estrellas = niveles completados. */
    starsFor(key) {
      const levels = this.getProgress(key).levels;
      return LEVELS.filter((l) => levels[l]).length;
    },
    /** Nivel que corresponde jugar según la dificultad configurada. */
    levelFor(key) {
      const { difficulty } = state.teacher;
      if (difficulty !== 'auto') return difficulty;
      const levels = this.getProgress(key).levels;
      return LEVELS.find((l) => !levels[l]) || LEVELS[LEVELS.length - 1];
    },
    resetProgress() {
      state.progress = {};
      save();
    },
    resetAll() {
      state = defaultState();
      save();
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
