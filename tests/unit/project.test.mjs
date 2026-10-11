import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));

async function listFiles(dir) {
  const out = [];
  for (const name of await readdir(join(ROOT, dir))) {
    const rel = join(dir, name);
    if ((await stat(join(ROOT, rel))).isDirectory()) out.push(...(await listFiles(rel)));
    else out.push(rel.split('\\').join('/'));
  }
  return out;
}

test('el service worker precarga todos los archivos de la aplicación', async () => {
  const sw = await readFile(join(ROOT, 'sw.js'), 'utf8');
  const listed = [...sw.matchAll(/'\.\/([^']*)'/g)].map((m) => m[1]).filter(Boolean);
  const needed = [...(await listFiles('js')), ...(await listFiles('css')), ...(await listFiles('assets/icons'))];
  for (const file of needed) assert.ok(listed.includes(file), `falta en sw.js: ${file}`);
  for (const file of listed) await stat(join(ROOT, file)); // existe
});

test('no hay rutas absolutas que fallen bajo /un-mundo-para-todos/', async () => {
  const files = ['index.html', 'manifest.webmanifest', 'sw.js', ...(await listFiles('js')), ...(await listFiles('css'))];
  for (const file of files) {
    const text = await readFile(join(ROOT, file), 'utf8');
    assert.doesNotMatch(text, /(href|src)=["']\/(?!\/)/, `${file}: ruta absoluta`);
    assert.doesNotMatch(text, /url\(\s*['"]?\/(?!\/)/, `${file}: url() absoluta`);
    assert.doesNotMatch(text, /"start_url":\s*"\//, `${file}: start_url absoluta`);
  }
});

test('todos los módulos importados existen (rutas relativas correctas)', async () => {
  for (const file of await listFiles('js')) {
    const text = await readFile(join(ROOT, file), 'utf8');
    for (const [, spec] of text.matchAll(/from\s+'([^']+)'/g)) {
      assert.ok(spec.startsWith('.'), `${file}: import no relativo ${spec}`);
      const target = join(ROOT, file, '..', spec);
      await stat(target).catch(() => assert.fail(`${file} importa ${spec}, que no existe`));
    }
  }
});

test('sin rastreadores, publicidad ni servicios externos', async () => {
  const files = ['index.html', ...(await listFiles('js')), ...(await listFiles('css'))];
  for (const file of files) {
    const text = await readFile(join(ROOT, file), 'utf8');
    assert.doesNotMatch(text, /google-analytics|googletagmanager|gtag\(|facebook\.net|hotjar|doubleclick|adsbygoogle/i, file);
    assert.doesNotMatch(text, /fetch\(\s*['"]https?:/, `${file}: llamada a servidor externo`);
  }
  assert.ok(relative(ROOT, ROOT) === '');
});
