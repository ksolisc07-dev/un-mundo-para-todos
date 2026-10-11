# Guía para agregar nuevos juegos

La mayoría de los juegos son **juegos de elección**: una instrucción y varias opciones,
una de ellas correcta. Para crear uno sólo hay que escribir una función que genere
rondas; el motor (`js/components/choiceGame.js`) se encarga de la voz, la ayuda, la
retroalimentación, las estrellas, la accesibilidad y el guardado.

## 1. Escribe la actividad

Ejemplo: «¿Quién es más grande?» en el mundo de los animales
(`js/games/animals.js`).

```js
export const tamanos = {
  id: 'tamanos',                         // único dentro del mundo; aparece en la URL
  title: '¿Quién es más grande?',        // corto: lo leen niños y docentes
  goal: 'Comparar tamaños de animales.', // para la guía docente
  levels: { 1: '2 animales muy distintos.', 2: '3 animales.', 3: '4 animales.' },
  kind: 'choice',
  icon: () => animalSvg('elefante'),
  createRound({ level = 1, rng = defaultRng, previous } = {}) {
    // …elige animales con rng (nunca Math.random directamente)…
    return {
      key: 'elefante-raton',            // identifica la pregunta (evita repetir la anterior)
      say: '¿Quién es más grande?',     // instrucción hablada
      text: '¿Quién es más grande?',    // instrucción escrita
      promptHtml: '<div class="prompt-picture">…pictograma…</div>',
      promptLabel: 'Dibujo: un animal grande y uno pequeño',
      options: [
        { key: 'elefante', label: 'Elefante', html: animalSvg('elefante') },
        { key: 'gato', label: 'Gato', html: animalSvg('gato') },
      ],
      answer: 'elefante',
      optionKind: 'picture',            // picture | numeral | swatch | bin | group
      lsec: 'animal:elefante',          // concepto LSEC relacionado (o null)
      successSay: '¡Sí! El elefante es más grande.',
    };
  },
};
```

Añádela a la lista del final del archivo:

```js
export const ANIMAL_ACTIVITIES = [reconocer, sonidos, sombras, rasgos, memoria, tamanos];
```

¡Listo! Aparece en el mundo, en el panel docente y en la tabla de progreso.

## 2. Reglas de calidad (las pruebas las verifican)

- **Una sola respuesta correcta.** Si dos opciones podrían ser defendibles, el juego
  confunde. Ejemplo real: un cuadrado también es un rectángulo, por eso
  `CONFUSABLE_SHAPES` impide mostrarlos juntos.
- **Nombre accesible en cada opción** (`label`).
- **Instrucción comprensible sin leer**: `promptHtml` debe mostrar algo visual
  (dibujo, pictograma, cantidad) siempre que sea posible.
- **Español correcto**: concordancia de género y número («una manzana», «la fresa es roja»).
  Usa `quantityPhrase()` y `colorAdjective()` de `js/data/colors.js`.
- **Usa `rng`** para todo lo aleatorio, así las pruebas son reproducibles.
- **Sin temporizadores ni castigos.**

Las pruebas de `tests/unit/games.test.mjs` recorren automáticamente todas las
actividades registradas (300 rondas por nivel). Si tu juego tiene reglas propias,
agrega una prueba específica como las de «¿Dónde hay más?» o «Juntamos».

### Otros tipos de juego

- `kind: 'memory'` con `createBoard({ level, rng })` → `{ pairs, cards: [{ key, label, html }], say, text }`
  (ver «Memoria de emociones»).
- `kind: 'spell'` con `createWord({ level, rng, previous })` → `{ key, word, say, text, pictureHtml, tiles: [{ key, letter }] }`
  (ver «Forma la palabra»).

## 3. Activar un mundo «próximamente»

1. Crea `js/games/letras.js` con sus actividades y exporta `LETTER_ACTIVITIES`.
2. Regístralo en `js/games/registry.js`:
   ```js
   import { LETTER_ACTIVITIES } from './letras.js';
   export const ACTIVITIES_BY_WORLD = { …, letras: LETTER_ACTIVITIES };
   ```
3. En `js/data/worlds.js` cambia `status: 'soon'` por `status: 'ready'`.
4. Actualiza la prueba «cada mundo jugable tiene 5 actividades…» si cambia el total.

## 4. Nuevas ilustraciones

- Animales: `js/art/animals.js` (lienzo 100×100, mirando a la izquierda, trazo `STROKE`).
- Objetos: `js/art/objects.js` (aceptan un color para «pintarlos»).
- Figuras: `js/art/shapes.js`. Íconos de interfaz: `js/art/icons.js` (24×24).
- Mantén el estilo: formas simples, contorno oscuro, colores alegres, sin texto dentro
  del dibujo. Las imágenes son decorativas (`aria-hidden`): el nombre accesible lo da
  el botón que las contiene.
- Si agregas un animal, añade también su entrada en `js/data/animals.js` y su concepto
  en `js/data/lsec.js` (con estado pendiente).

## 5. Publicar los archivos nuevos sin conexión

Si creaste **archivos nuevos**, agrégalos a la lista `ASSETS` de `sw.js` y sube
`CACHE_VERSION` (por ejemplo, de `'v1'` a `'v2'`). La prueba
«el service worker precarga todos los archivos» falla si olvidas alguno.

## 6. Comprobar

```bash
npm run test:unit
npm run test:e2e
npm run lint
```

## Extensión pendiente: grabaciones reales de sonidos de animales

Hoy «¿Quién hace así?» usa la onomatopeya hablada por la voz del navegador y escrita
en pantalla. Para usar grabaciones reales habría que:

1. Conseguir audios con licencia libre compatible (por ejemplo, CC0) y anotar su autoría.
2. Guardarlos en `assets/audio/animales/<id>.mp3` y añadir un campo `soundFile` en
   `js/data/animals.js`.
3. Reproducirlos desde `choiceGame.js` respetando las preferencias de volumen y silencio,
   manteniendo siempre la onomatopeya escrita para quienes no oyen.
4. Añadirlos a `sw.js` y a la sección de atribuciones del README.

Esta extensión **no está implementada** en la versión actual.
