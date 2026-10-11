# Un Mundo Para Todos

Plataforma educativa **gratuita, inclusiva y de código abierto** para aprender jugando.
Está pensada para escuelas de Ecuador y para cualquier lugar donde haga falta: funciona
en el navegador de computadoras, tablets y teléfonos, sin registro, sin publicidad y
sin recopilar datos de niñas y niños.

**Sitio:** https://ksolisc07-dev.github.io/un-mundo-para-todos/ (cuando se active GitHub Pages; ver [docs/PUBLICAR.md](docs/PUBLICAR.md))

> Ningún niño debe quedar excluido por no saber leer, escribir o escuchar.

---

## Qué incluye esta primera versión

| Mundo | Estado | Actividades |
| --- | --- | --- |
| 🦁 Los animales | **Jugable** | ¿Quién es? · ¿Quién hace así? · ¿De quién es la sombra? · ¿Quién tiene…? · Memoria |
| 🎨 Colores y formas | **Jugable** | Toca el color · ¿De qué color es? · Encuentra la figura · Ordena en cajas · ¿Qué sigue? |
| 🔢 Los números | **Jugable** | Cuenta · Número y cantidad · Encuentra el número · ¿Dónde hay más? · Juntamos |
| 🔤 Las letras | Próximamente | Pantalla informativa con las actividades planificadas |
| 😊 Las emociones | Próximamente | Pantalla informativa con las actividades planificadas |
| 🤟 Manitos que hablan (LSEC) | En preparación | Estado del vocabulario LSEC; **no muestra señas** hasta tener videos auténticos validados |

Cada actividad jugable tiene **3 niveles** de dificultad progresiva, rondas configurables
(3, 5 u 8), intentos ilimitados y ninguna penalización.

### Funcionalidades

- **Instrucciones en varias formas**: dibujo o pictograma, texto corto y voz en español
  (síntesis de voz del navegador, sin conexión). Botón para repetir la instrucción.
- **Retroalimentación positiva**: ante un error, la mascota anima («¡Casi! Intenta otra vez»),
  la opción elegida se descarta y, tras dos intentos, una mano señala la respuesta.
  El botón **Ayuda** (bombillo) hace lo mismo cuando se quiera.
- **Recompensas sin presión**: una estrella por nivel completado, confeti opcional y
  sonidos suaves desactivables. Sin rankings, sin temporizadores, sin compras.
- **Progreso guardado localmente** (`localStorage`) y botón para empezar de nuevo.
- **Preferencias de accesibilidad**: silencio total, voz, lectura automática, volumen,
  velocidad de voz, animaciones (según el sistema / reducidas / completas), confeti,
  alto contraste, texto grande y nombres escritos de los colores.
- **Espacio para docentes y familias** (protegido con una pregunta para adultos):
  elegir actividades, fijar dificultad y rondas, ver el progreso, reiniciar y leer
  recomendaciones pedagógicas.
- **Preparado para LSEC**: registro de videos con validación obligatoria y reproductor
  accesible (repetir, subtítulos opcionales, créditos y licencia).
- **Aplicación instalable (PWA)** y uso sin conexión después de la primera visita.
- **Ilustraciones originales en SVG** (animales, mascota Tito el colibrí, objetos, figuras).

## Accesibilidad (WCAG 2.2 AA)

- Todo se puede usar con **teclado** (Tab, Enter, Espacio) y el foco siempre es visible.
- Botones grandes (64 px o más en los juegos) y separados.
- Cada imagen interactiva tiene un **nombre accesible**; los cambios importantes se
  anuncian a lectores de pantalla con una región `aria-live`.
- Nada depende sólo del color: los estados correcto/descartado usan ícono, borde y forma;
  los colores pueden mostrar su nombre escrito.
- **Sin límites de tiempo** y sin penalizaciones.
- Respeta `prefers-reduced-motion` y permite desactivar animaciones manualmente.
- Las pruebas automáticas auditan cada pantalla con **axe-core** (reglas WCAG 2.0/2.1/2.2 A y AA).

Lo que una herramienta automática no puede asegurar (por ejemplo, la comprensión real
por parte de niñas y niños con distintas necesidades) debe validarse con pruebas de uso
en aula. Ver [Funcionalidades pendientes](#funcionalidades-pendientes).

## Ejecutar en tu computadora

No hace falta compilar nada. Sólo se necesita un servidor web estático porque los
navegadores no cargan módulos JavaScript desde `file://`.

**Opción A — con Node.js (recomendada, imita GitHub Pages):**

```bash
git clone https://github.com/ksolisc07-dev/un-mundo-para-todos.git
cd un-mundo-para-todos
node tests/server.mjs
# Abre http://localhost:4173/un-mundo-para-todos/
```

**Opción B — con Python:**

```bash
cd un-mundo-para-todos
python3 -m http.server 8000
# Abre http://localhost:8000/
```

## Pruebas

```bash
npm install                 # instala Playwright, axe-core y ESLint (sólo para pruebas)
npm run test:unit           # pruebas unitarias (node:test), no necesitan navegador
npm run test:e2e            # pruebas de navegador con Playwright (escritorio y móvil)
npm run lint                # análisis estático con ESLint
npm test                    # unitarias + navegador
```

Si es la primera vez que usas Playwright: `npx playwright install chromium`.

Las pruebas cubren: que cada ronda tenga una única respuesta correcta y opciones
válidas (300 rondas por actividad y nivel), que las 15 actividades se puedan jugar
hasta el final en escritorio y móvil, el guardado del progreso, el panel docente,
las preferencias, la navegación por teclado, el tamaño de los botones, la ausencia
de desplazamiento horizontal, el modo sin conexión, las rutas bajo
`/un-mundo-para-todos/` y la auditoría de accesibilidad con axe.

## Estructura del proyecto

```
index.html              Página única de la aplicación
manifest.webmanifest    Manifiesto PWA
sw.js                   Service worker (uso sin conexión)
css/styles.css          Estilos (responsive, alto contraste, movimiento reducido)
js/app.js               Punto de entrada y enrutamiento de pantallas
js/core/                Estado local, voz, sonidos, enrutador, utilidades
js/art/                 Ilustraciones SVG originales
js/data/                Mundos, animales, colores, figuras, registro LSEC
js/games/               Generadores de rondas de cada actividad (lógica pura)
js/components/          Motores de juego, reproductor LSEC, formularios
js/screens/             Pantallas: inicio, mundo, juego, preferencias, docentes
assets/                 Íconos de la app y carpeta para videos LSEC
tests/                  Pruebas unitarias, de navegador y servidor local
docs/                   Documentación
```

Más detalle en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

## Documentación

- [Arquitectura del proyecto](docs/ARQUITECTURA.md)
- [Guía para docentes y familias](docs/GUIA_DOCENTES.md)
- [Guía para agregar nuevos juegos](docs/NUEVOS_JUEGOS.md)
- [Guía para incorporar videos auténticos de LSEC](docs/LSEC_VIDEOS.md)
- [Publicar con GitHub Pages](docs/PUBLICAR.md)

## Privacidad

- Sin registro de usuarios, sin publicidad, sin compras, sin rastreadores ni analíticas.
- No se envía ningún dato a servidores. No se usan APIs con claves ni servicios de pago.
- En el navegador sólo se guardan preferencias, configuración docente y qué niveles se
  completaron (con la fecha, sin hora). Nunca nombres ni datos que identifiquen a menores.
- Se puede borrar todo desde «Docentes y familias → Progreso».

## Funcionalidades pendientes

- **Mundo 4 (Las letras)** y **Mundo 5 (Las emociones)**: diseñados, aún sin juegos.
- **Mundo 6 (Manitos que hablan)**: requiere videos auténticos de LSEC con permisos y
  validación de la comunidad sorda ecuatoriana. El sistema ya está listo para recibirlos.
- **Sonidos reales de animales**: hoy se usan onomatopeyas habladas y escritas. Se pueden
  añadir grabaciones con licencia libre (ver [docs/NUEVOS_JUEGOS.md](docs/NUEVOS_JUEGOS.md)).
- **Locución grabada**: la voz depende de las voces en español instaladas en cada
  dispositivo; algunos equipos no tienen voz en español (la app lo avisa en Preferencias).
- **Validación con usuarios reales**: pruebas en aula con niñas y niños, docentes de
  educación inicial y especial, y con lectores de pantalla reales (NVDA, VoiceOver, TalkBack).
- Revisión pedagógica externa del vocabulario y de la progresión de niveles.

## Licencia y atribuciones

- **Código**: licencia [MIT](LICENSE).
- **Ilustraciones, textos educativos y documentación**: [CC BY 4.0](LICENSE-CONTENIDO.md).
- Todas las ilustraciones (animales, mascota Tito, objetos, figuras, paisaje, íconos) son
  **originales de este proyecto**, dibujadas como SVG en el código. No se usan imágenes,
  fuentes tipográficas ni sonidos de terceros: los sonidos se generan con Web Audio y la
  voz es la del propio navegador.
- Herramientas usadas **sólo para pruebas** (no se publican con el sitio):
  [Playwright](https://playwright.dev) (Apache-2.0), [axe-core](https://github.com/dequelabs/axe-core)
  (MPL-2.0) y [ESLint](https://eslint.org) (MIT).
- Los futuros videos de LSEC tendrán su propia licencia y créditos, indicados en
  `js/data/lsec.js` y visibles junto a cada video.

## Cómo contribuir

Las contribuciones son bienvenidas, especialmente de docentes, familias, especialistas
en educación inclusiva y de la comunidad sorda ecuatoriana. Antes de enviar cambios,
ejecuta `npm test` y `npm run lint`.
