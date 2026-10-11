/**
 * Enrutador por "hash" (#/mundo/animales). Funciona en GitHub Pages sin
 * configurar el servidor y sin romper las rutas bajo /un-mundo-para-todos/.
 */

const ROUTES = [
  { name: 'home', pattern: [] },
  { name: 'world', pattern: ['mundo', ':world'] },
  { name: 'play', pattern: ['juego', ':world', ':activity'] },
  { name: 'play', pattern: ['juego', ':world', ':activity', ':level'] },
  { name: 'prefs', pattern: ['preferencias'] },
  { name: 'teachers', pattern: ['docentes'] },
];

export function parseHash(hash = '') {
  const parts = hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((p) => decodeURIComponent(p));

  for (const route of ROUTES) {
    if (route.pattern.length !== parts.length) continue;
    const params = {};
    const ok = route.pattern.every((segment, i) => {
      if (segment.startsWith(':')) {
        params[segment.slice(1)] = parts[i];
        return true;
      }
      return segment === parts[i];
    });
    if (ok) {
      if (params.level !== undefined) {
        const level = Number(params.level);
        if (![1, 2, 3].includes(level)) continue;
        params.level = level;
      }
      return { name: route.name, params };
    }
  }
  return { name: 'notFound', params: {} };
}

export function hrefFor(name, params = {}) {
  switch (name) {
    case 'world':
      return `#/mundo/${params.world}`;
    case 'play':
      return `#/juego/${params.world}/${params.activity}${params.level ? `/${params.level}` : ''}`;
    case 'prefs':
      return '#/preferencias';
    case 'teachers':
      return '#/docentes';
    default:
      return '#/';
  }
}
