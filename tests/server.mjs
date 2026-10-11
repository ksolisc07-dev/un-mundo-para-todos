/**
 * Servidor estático mínimo para desarrollo y pruebas. Sirve el proyecto bajo
 * /un-mundo-para-todos/ igual que GitHub Pages, para detectar rutas absolutas
 * incorrectas antes de publicar.
 *   node tests/server.mjs        → http://localhost:4173/un-mundo-para-todos/
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const BASE = '/un-mundo-para-todos/';
const PORT = Number(process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.vtt': 'text/vtt',
  '.md': 'text/markdown; charset=utf-8',
};

export function startServer(port = PORT) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/' || url.pathname === '/un-mundo-para-todos') {
      res.writeHead(302, { Location: BASE });
      return res.end();
    }
    if (!url.pathname.startsWith(BASE)) {
      res.writeHead(404);
      return res.end('Fuera de /un-mundo-para-todos/ (en GitHub Pages esto también fallaría)');
    }
    let file = normalize(join(ROOT, decodeURIComponent(url.pathname.slice(BASE.length))));
    if (!file.startsWith(ROOT + sep) && file !== ROOT) {
      res.writeHead(403);
      return res.end();
    }
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end('No encontrado');
    }
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await startServer();
  console.log(`Un Mundo Para Todos: http://localhost:${PORT}${BASE}`);
}
