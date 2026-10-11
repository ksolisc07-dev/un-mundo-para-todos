import AxeBuilder from '@axe-core/playwright';
import { test, expect, seedState, FAST } from './fixtures.mjs';

const SCREENS = [
  ['inicio', './'],
  ['mundo', '#/mundo/animales'],
  ['próximamente (LSEC)', '#/mundo/senas'],
  ['juego de elección', '#/juego/animales/reconocer/2'],
  ['juego de colores', '#/juego/colores/objetos/2'],
  ['juego de contar', '#/juego/numeros/contar/2'],
  ['juego de comparar', '#/juego/numeros/comparar/3'],
  ['memoria', '#/juego/animales/memoria/1'],
  ['vocales', '#/juego/letras/vocales/2'],
  ['forma la palabra', '#/juego/letras/palabras/2'],
  ['¿qué dice?', '#/juego/letras/leer/3'],
  ['¿qué siente?', '#/juego/emociones/situaciones/3'],
  ['¿qué puedes hacer?', '#/juego/emociones/acciones/3'],
  ['preferencias', '#/preferencias'],
  ['docentes (acceso)', '#/docentes'],
];

async function audit(page, name) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
  expect(summary, `${name}:\n${summary.join('\n')}`).toEqual([]);
}

for (const [name, hash] of SCREENS) {
  test(`accesibilidad WCAG 2.x AA (axe): ${name}`, async ({ page }) => {
    await seedState(page, FAST);
    await page.goto(hash);
    await page.waitForTimeout(300);
    await audit(page, name);
  });
}

test('accesibilidad: alto contraste y panel docente', async ({ page }) => {
  await seedState(page, { ...FAST, prefs: { ...FAST.prefs, highContrast: true, largeText: true } });
  await page.goto('#/juego/colores/secuencias/3');
  await audit(page, 'alto contraste');
  await page.goto('#/docentes');
  const q = await page.locator('.gate-question').textContent();
  const [, a, b] = q.match(/(\d+) × (\d+)/);
  await page.getByLabel(/¿Cuánto es/).fill(String(a * b));
  await page.getByRole('button', { name: 'Entrar' }).click();
  await audit(page, 'docentes');
});

test('accesibilidad: pantalla final y estados de respuesta', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/animales/sombras/1');
  const answer = await page.locator('.game').getAttribute('data-answer');
  await page.locator(`.option:not([data-key="${answer}"])`).first().click();
  await page.locator(`.option[data-key="${answer}"]`).click();
  await audit(page, 'respuestas');
});
