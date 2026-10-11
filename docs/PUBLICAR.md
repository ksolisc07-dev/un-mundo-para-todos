# Publicar con GitHub Pages

El sitio es 100 % estático: GitHub Pages lo publica tal cual, sin compilar.
Dirección final: **https://ksolisc07-dev.github.io/un-mundo-para-todos/**

## Configuración (una sola vez)

1. Asegúrate de que el código esté en la rama `main` del repositorio
   `ksolisc07-dev/un-mundo-para-todos` (por ejemplo, aceptando el *pull request* de
   la rama de desarrollo).
2. En GitHub, abre el repositorio → **Settings** → **Pages**.
3. En **Build and deployment → Source** elige **Deploy from a branch**.
4. En **Branch** elige `main` y la carpeta `/ (root)`. Pulsa **Save**.
5. Espera 1 o 2 minutos y abre https://ksolisc07-dev.github.io/un-mundo-para-todos/
6. (Recomendado) Marca **Enforce HTTPS**. El service worker y la instalación como
   aplicación necesitan HTTPS.

El archivo `.nojekyll` de la raíz indica a GitHub Pages que publique los archivos
sin procesarlos con Jekyll.

## Publicar una nueva versión

1. Haz los cambios y ejecuta `npm test` y `npm run lint`.
2. Si agregaste o cambiaste archivos, sube `CACHE_VERSION` en `sw.js`
   (por ejemplo, `'v1'` → `'v2'`) para que los dispositivos renueven su copia sin conexión.
3. Sube los cambios a `main` (directamente o mediante un *pull request*).
4. GitHub Pages publica automáticamente en uno o dos minutos.

## Integración continua

`.github/workflows/pruebas.yml` ejecuta el análisis estático, las pruebas unitarias
y las de navegador en cada *push* y *pull request*. No publica nada: sólo avisa si
algo se rompió.

## Comprobar después de publicar

- La página carga sin errores en la consola del navegador (F12).
- Se pueden abrir los tres mundos jugables y terminar una actividad.
- Al recargar una pantalla interna (por ejemplo `#/mundo/animales`) se mantiene.
- En el teléfono, el navegador ofrece «Agregar a la pantalla principal».

## Problemas frecuentes

| Problema | Solución |
| --- | --- |
| Página 404 | Revisa que Pages use la rama `main` y la carpeta raíz, y espera unos minutos. |
| Se ve una versión vieja | Sube `CACHE_VERSION` en `sw.js` y vuelve a publicar; recarga la página dos veces. |
| No hay voz | Depende de las voces en español instaladas en el dispositivo; la app lo indica en Preferencias. |
| No funciona abriendo `index.html` con doble clic | Los navegadores bloquean módulos en `file://`. Usa un servidor local (ver README). |
