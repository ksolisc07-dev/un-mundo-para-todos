import { test, expect, seedState, FAST, playToEnd } from './fixtures.mjs';

test('las preferencias se aplican y se guardan', async ({ page }) => {
  await page.goto('#/preferencias');
  await page.getByRole('switch', { name: 'Alto contraste' }).check();
  await page.getByRole('switch', { name: 'Texto más grande' }).check();
  await page.getByRole('radio', { name: 'Reducidas (sin movimiento)' }).check();
  await page.getByRole('switch', { name: 'Mostrar el nombre escrito de los colores' }).check();
  await page.reload();
  const classes = await page.evaluate(() => document.documentElement.className);
  expect(classes).toContain('high-contrast');
  expect(classes).toContain('large-text');
  expect(classes).toContain('reduce-motion');
  expect(classes).toContain('color-labels');
  await expect(page.getByRole('switch', { name: 'Alto contraste' })).toBeChecked();
  await page.goto('#/juego/colores/colores/1');
  await expect(page.locator('.option .color-name').first()).toBeVisible();
});

test('la opción de LSEC está deshabilitada y explica que no hay videos validados', async ({ page }) => {
  await page.goto('#/preferencias');
  const lsec = page.getByRole('switch', { name: /videos en LSEC/ });
  await expect(lsec).toBeDisabled();
  await expect(page.locator('.prefs-form')).toContainText('Todavía no hay videos LSEC validados');
});

test('el botón Sonido silencia y se recuerda', async ({ page }) => {
  await page.goto('./');
  const mute = page.locator('.home-footer .mute-btn');
  await expect(mute).toHaveAttribute('aria-pressed', 'true');
  await mute.click();
  await expect(mute).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(page.locator('.home-footer .mute-btn')).toHaveAttribute('aria-pressed', 'false');
});

test('docentes: la pregunta para adultos protege la sección', async ({ page }) => {
  await page.goto('#/docentes');
  await expect(page.getByRole('heading', { name: 'Sólo para personas adultas' })).toBeVisible();
  await page.getByLabel(/¿Cuánto es/).fill('1');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('alert')).toContainText('Esa no es la respuesta');
  await expect(page.getByRole('heading', { name: 'Actividades disponibles' })).toHaveCount(0);
});

async function unlockTeachers(page) {
  await page.goto('#/docentes');
  const question = await page.locator('.gate-question').textContent();
  const [, a, b] = question.match(/(\d+) × (\d+)/);
  await page.getByLabel(/¿Cuánto es/).fill(String(Number(a) * Number(b)));
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('heading', { name: 'Actividades disponibles' })).toBeVisible();
}

test('docentes: ocultar actividades, fijar dificultad y rondas', async ({ page }) => {
  await seedState(page, FAST);
  await unlockTeachers(page);
  await page.getByRole('checkbox', { name: 'Memoria de animales' }).uncheck();
  await page.getByRole('radio', { name: 'Nivel 3 (avanzado)' }).check();
  await page.getByRole('radio', { name: '8 rondas' }).check();
  await page.goto('#/mundo/animales');
  await expect(page.locator('.activity-card')).toHaveCount(4);
  await expect(page.locator('.activity-card[data-activity="memoria"]')).toHaveCount(0);
  await page.locator('.activity-card[data-activity="reconocer"]').click();
  await expect(page.locator('.level-chip')).toHaveText('Nivel 3');
  await expect(page.locator('.round-dots li')).toHaveCount(8);
  await expect(page.locator('.option')).toHaveCount(6);
});

test('docentes: ver el progreso y reiniciarlo', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/numeros/sumar/1');
  await playToEnd(page);
  await unlockTeachers(page);
  const row = page.locator('.progress-table tr', { hasText: 'Juntamos' });
  await expect(row.locator('.stars')).toHaveAttribute('aria-label', '1 de 3 estrellas');
  await expect(row).toContainText('100 %');
  page.once('dialog', (d) => d.accept());
  await page.locator('[data-action="reset-progress"]').click();
  await expect(page.locator('.progress-table tr', { hasText: 'Juntamos' }).locator('.stars')).toHaveAttribute(
    'aria-label',
    '0 de 3 estrellas'
  );
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('un-mundo-para-todos.v1')));
  expect(saved.progress).toEqual({});
  expect(saved.teacher.rounds).toBe(3); // la configuración se conserva
});

test('docentes: cancelar el reinicio no borra nada', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/numeros/sumar/1');
  await playToEnd(page);
  await unlockTeachers(page);
  page.once('dialog', (d) => d.dismiss());
  await page.locator('[data-action="reset-progress"]').click();
  await expect(page.locator('.progress-table tr', { hasText: 'Juntamos' }).locator('.stars')).toHaveAttribute(
    'aria-label',
    '1 de 3 estrellas'
  );
});
