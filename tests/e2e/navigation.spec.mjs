import { test, expect, seedState, FAST } from './fixtures.mjs';

test('la pantalla principal muestra los 6 mundos', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/Un Mundo Para Todos/);
  await expect(page.locator('.world-card')).toHaveCount(6);
  await expect(page.locator('.world-card--soon')).toHaveCount(3);
  await expect(page.getByRole('link', { name: /Los animales\. 0 de 15 estrellas/ })).toBeVisible();
});

test('los mundos en preparación lo dicen claramente y no tienen juegos falsos', async ({ page }) => {
  for (const world of ['letras', 'emociones', 'senas']) {
    await page.goto(`#/mundo/${world}`);
    await expect(page.locator('.bubble')).toContainText('Próximamente');
    await expect(page.getByRole('heading', { name: 'Este mundo está en preparación' })).toBeVisible();
    await expect(page.locator('.option, .activity-card, video')).toHaveCount(0);
  }
  await expect(page.locator('.lsec-status')).toContainText('Videos validados: 0 de');
  await expect(page.locator('.chip--ok')).toHaveCount(0);
});

test('navegar con teclado: Tab + Enter abre un mundo y el foco va al título', async ({ page }) => {
  await page.goto('./');
  const target = page.locator('.world-card[data-world="numeros"]');
  for (let i = 0; i < 20 && !(await target.evaluate((el) => el === document.activeElement)); i += 1) {
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: 'Los números' })).toBeFocused();
  // Elegir una opción de juego con el teclado.
  await page.goto('#/juego/numeros/numeros/1');
  const answer = await page.locator('.game').getAttribute('data-answer');
  await page.locator(`.option[data-key="${answer}"]`).focus();
  await page.keyboard.press('Space');
  await expect(page.locator(`.option[data-key="${answer}"]`)).toHaveClass(/is-correct/);
});

test('el foco es visible en los botones', async ({ page }) => {
  await page.goto('./');
  await page.keyboard.press('Tab'); // enlace "Saltar al contenido"
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  expect(outline).not.toBe('none');
});

test('una dirección desconocida muestra una página amable', async ({ page }) => {
  await page.goto('#/esto/no/existe');
  await expect(page.getByRole('heading', { name: 'No encontramos esta página' })).toBeVisible();
  await page.getByRole('link', { name: 'Ir al inicio' }).click();
  await expect(page.locator('.world-card')).toHaveCount(6);
});

test('sin desplazamiento horizontal en ninguna pantalla', async ({ page }) => {
  await seedState(page, FAST);
  for (const hash of [
    '',
    '#/mundo/animales',
    '#/juego/animales/reconocer/3',
    '#/juego/animales/memoria/3',
    '#/juego/colores/secuencias/3',
    '#/juego/numeros/sumar/3',
    '#/juego/numeros/relacionar/3',
    '#/juego/numeros/comparar/3',
    '#/mundo/senas',
    '#/preferencias',
    '#/docentes',
  ]) {
    await page.goto(hash || './');
    await page.waitForTimeout(150);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `desborde en ${hash || 'inicio'}`).toBeLessThanOrEqual(0);
  }
});

test('los botones de juego tienen tamaño táctil suficiente (≥ 44 px)', async ({ page }) => {
  await seedState(page, FAST);
  for (const hash of ['#/juego/animales/reconocer/3', '#/juego/numeros/contar/3', '#/juego/colores/colores/3']) {
    await page.goto(hash);
    const sizes = await page.locator('.option, .countable, .icon-btn').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return Math.min(r.width, r.height);
      })
    );
    for (const s of sizes) expect(s).toBeGreaterThanOrEqual(44);
  }
});
