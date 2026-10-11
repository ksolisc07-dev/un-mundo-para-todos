# Arquitectura

## Decisiones principales (y por qué)

| Decisión | Motivo |
| --- | --- |
| **Sitio estático sin compilación** (HTML, CSS y módulos ES nativos) | Funciona directamente en GitHub Pages, sin servidor ni paso de *build*. Cualquier docente o voluntario puede editar un archivo y publicarlo. |
| **Enrutamiento por hash** (`#/mundo/animales`) | GitHub Pages no permite reescribir rutas; con el hash, recargar cualquier pantalla funciona bajo `/un-mundo-para-todos/` sin un `404.html` especial. |
| **Sólo rutas relativas** (`css/styles.css`, `./sw.js`) | El sitio vive en un subdirectorio. Una prueba automatizada rechaza rutas absolutas. |
| **Ilustraciones SVG generadas en JavaScript** | Originales, livianas, nítidas en cualquier pantalla, sin problemas de licencia y fáciles de recolorear (por ejemplo, pintar objetos o mostrar siluetas). |
| **Generadores de rondas puros** | La lógica de cada juego no toca el DOM: recibe nivel y un generador aleatorio y devuelve una ronda. Así se prueba en Node con miles de rondas. |
| **Voz del navegador (Web Speech API)** y **sonidos con Web Audio** | Sin archivos de audio, sin claves, sin conexión. Si no hay voz, todo sigue funcionando con imágenes y texto. |
| **`localStorage` con saneamiento** | Guarda progreso y preferencias sin servidor. Los datos se validan al cargar para tolerar versiones viejas o datos dañados. |
| **Service worker "red primero"** | Con internet siempre se ve la última versión publicada; sin internet se usa la copia guardada. Evita que docentes queden con versiones viejas. |
| **Registro LSEC con validación estricta** | Impide técnicamente mostrar una seña que no tenga video, licencia, consentimiento y validadores. |

## Capas

```
index.html ─► js/app.js ─► js/screens/*  (pantallas)
                  │              │
                  │              ├─► js/components/* (motores de juego, UI, LSEC)
                  │              │         │
                  │              │         └─► js/games/* (generadores de rondas, puros)
                  │              │                   │
                  │              │                   ├─► js/data/*  (contenido)
                  │              │                   └─► js/art/*   (SVG)
                  └─► js/core/*  (estado, voz, sonidos, enrutador, utilidades)
```

### `js/core/`
- `store.js`: estado persistente (`prefs`, `teacher`, `progress`) en la clave
  `un-mundo-para-todos.v1`. `sanitize()` limpia cualquier dato desconocido.
  `levelFor()` decide el nivel según la dificultad automática o fija.
- `speech.js`: elige la mejor voz en español disponible (es-EC, es-419, es-US, es-MX…).
- `sfx.js`: sonidos cortos sintetizados (acierto, intento, celebración).
- `router.js`: `parseHash()` y `hrefFor()`.
- `random.js`: azar con semilla opcional (pruebas reproducibles).
- `dom.js`: `el()` para crear elementos y `escapeHtml()`.

### `js/games/`
Cada archivo exporta actividades. Una actividad de elección tiene esta forma:

```js
{
  id: 'reconocer',
  title: '¿Quién es?',
  goal: 'Reconocer animales por su nombre.',        // para docentes
  levels: { 1: '…', 2: '…', 3: '…' },               // qué cambia en cada nivel
  kind: 'choice',                                    // o 'memory'
  icon: () => '<svg…>',
  createRound({ level, rng, previous }) { return ronda; },
}
```

El contrato completo de una **ronda** está documentado al inicio de
`js/games/helpers.js`. `registry.js` agrupa las actividades por mundo.

### `js/components/`
- `choiceGame.js`: motor de juegos de elección (instrucción, opciones, ayuda,
  retroalimentación, conteo táctil, panel LSEC).
- `memoryGame.js`: juego de parejas.
- `lsecPlayer.js`: reproductor de videos LSEC validados.
- `prefsForm.js`: formulario de preferencias (usado en dos pantallas).
- `ui.js`: barra superior, botones con ícono, estrellas, botón de silencio.
- `celebrate.js`: confeti opcional.

### `js/screens/`
Cada pantalla es una función `(ctx, params) => { el, title, onShow? }`.
`ctx` contiene `store`, `speech`, `sfx`, `lsec`, `navigate()`, `announce()` (para
lectores de pantalla), `rerender()` y `onCleanup()`.

## Flujo de una partida

1. `#/juego/animales/reconocer` → `playScreen` calcula el nivel (`store.levelFor`).
2. `choiceGame` pide una ronda a `activity.createRound()` y la dibuja.
3. Si la preferencia lo permite, se lee la instrucción en voz alta.
4. Acierto → marca ✓, sonido, confeti opcional, frase de ánimo, siguiente ronda.
   Error → la opción se descarta (sin castigo); tras 2 errores aparece la mano de ayuda.
5. Al terminar las rondas → `store.recordCompletion()` y pantalla final con estrellas.

## Datos guardados

```json
{
  "version": 1,
  "prefs": { "voice": true, "muted": false, "volume": 0.8, "…": "…" },
  "teacher": { "difficulty": "auto", "rounds": 5, "disabled": { "animales/memoria": true } },
  "progress": {
    "animales/reconocer": { "levels": { "1": true }, "completions": 2, "answered": 10, "firstTry": 8, "last": "2026-10-11" }
  }
}
```

No hay identificadores de personas. El progreso es del dispositivo, no de un niño.

## Pruebas

- `tests/unit/` (Node, `node:test`): núcleo, generadores de rondas (300 rondas por
  actividad y nivel), registro LSEC, lista del service worker, rutas relativas,
  importaciones y ausencia de rastreadores.
- `tests/e2e/` (Playwright, escritorio y móvil): juego completo de las 15 actividades,
  errores y ayuda, memoria, conteo, preferencias, docentes, teclado, tamaños táctiles,
  desbordes, PWA sin conexión y auditoría axe.
- `tests/server.mjs` sirve el sitio bajo `/un-mundo-para-todos/` como GitHub Pages
  y devuelve 404 a todo lo que esté fuera (detecta rutas absolutas).
