import { test, expect, seedState, FAST, playToEnd } from './fixtures.mjs';

const ACTIVITIES = {
  animales: ['reconocer', 'sonidos', 'sombras', 'rasgos', 'memoria'],
  colores: ['colores', 'objetos', 'figuras', 'clasificar', 'secuencias'],
  numeros: ['contar', 'relacionar', 'numeros', 'comparar', 'sumar'],
  letras: ['vocales', 'inicial', 'sonidos', 'palabras', 'leer'],
  emociones: ['iguales', 'nombrar', 'situaciones', 'acciones', 'memoria'],
};

for (const [world, list] of Object.entries(ACTIVITIES)) {
  for (const activity of list) {
    test(`se puede jugar ${world}/${activity} hasta ganar la estrella`, async ({ page }) => {
      await seedState(page, FAST);
      await page.goto(`#/mundo/${world}`);
      await page.locator(`.activity-card[data-activity="${activity}"]`).click();
      await expect(page.locator('.level-chip')).toHaveText('Nivel 1');
      await playToEnd(page);
      await expect(page.locator('.finish .stars')).toHaveAttribute('aria-label', '1 de 3 estrellas');

      // El progreso queda guardado y se ve al volver al mundo (incluso tras recargar).
      await page.locator('[data-action="back"]').click();
      await page.reload();
      await expect(page.locator(`.activity-card[data-activity="${activity}"] .stars`)).toHaveAttribute('aria-label', '1 de 3 estrellas');

      // La siguiente vez empieza en el nivel 2.
      await page.locator(`.activity-card[data-activity="${activity}"]`).click();
      await expect(page.locator('.level-chip')).toHaveText('Nivel 2');
    });
  }
}

test('los niveles 2 y 3 también se pueden completar', async ({ page }) => {
  await seedState(page, FAST);
  for (const path of ['animales/reconocer/3', 'colores/secuencias/3', 'numeros/sumar/3', 'animales/memoria/3']) {
    await page.goto(`#/juego/${path}`);
    await playToEnd(page);
  }
  await page.goto('#/juego/colores/clasificar/2');
  await playToEnd(page);
  await page.locator('[data-action="next"]').click();
  await expect(page.locator('.level-chip')).toHaveText('Nivel 3');
});

test('equivocarse no penaliza: ánimo, opción descartada y ayuda tras dos intentos', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/animales/reconocer/3');
  const answer = await page.locator('.game').getAttribute('data-answer');
  const wrong = page.locator(`.option:not([data-key="${answer}"])`);
  await wrong.nth(0).click();
  await expect(page.locator('.feedback')).toContainText(/Intenta|prueba/i);
  await expect(wrong.nth(0)).toBeDisabled();
  await expect(page.locator('.option.is-hint')).toHaveCount(0);
  await wrong.nth(1).click();
  await expect(page.locator(`.option[data-key="${answer}"]`)).toHaveClass(/is-hint/);
  await page.locator(`.option[data-key="${answer}"]`).click();
  await expect(page.locator(`.option[data-key="${answer}"]`)).toHaveClass(/is-correct/);
  await expect(page.locator('.feedback')).toContainText(/Muy bien|Excelente|Lo lograste|Genial|Bravo/);
});

test('el botón Ayuda señala la respuesta', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/colores/figuras/1');
  const answer = await page.locator('.game').getAttribute('data-answer');
  await page.getByRole('button', { name: 'Ayuda' }).click();
  await expect(page.locator(`.option[data-key="${answer}"]`)).toHaveClass(/is-hint/);
});

test('en "Cuenta" se puede tocar cada objeto para contarlo', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/numeros/contar/2');
  const items = page.locator('.prompt .countable');
  const n = await items.count();
  for (let i = 0; i < n; i += 1) await items.nth(i).click();
  await expect(items.nth(n - 1).locator('.count-badge')).toHaveText(String(n));
  expect(String(n)).toBe(await page.locator('.game').getAttribute('data-answer'));
});

test('en "¿De qué color es?" el objeto se pinta al acertar', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/colores/objetos/1');
  await expect(page.locator('.prompt .object--unpainted')).toHaveCount(1);
  const answer = await page.locator('.game').getAttribute('data-answer');
  await page.locator(`.option[data-key="${answer}"]`).click();
  await expect(page.locator('.prompt .object--unpainted')).toHaveCount(0);
});

test('memoria: dos cartas distintas se vuelven a tapar', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/animales/memoria/1');
  const cards = page.locator('.memory-card');
  const keys = await cards.evaluateAll((els) => els.map((c) => c.dataset.key));
  const second = keys.findIndex((k) => k !== keys[0]);
  await cards.nth(0).click();
  await cards.nth(second).click();
  await expect(cards.nth(0)).toHaveClass(/is-up/);
  await expect(cards.nth(0)).not.toHaveClass(/is-up/, { timeout: 4000 });
  await expect(cards.nth(0)).toHaveAttribute('aria-label', /boca abajo/);
});

test('no hay temporizadores: la ronda espera sin límite', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/numeros/comparar/1');
  const before = await page.locator('.game').getAttribute('data-answer');
  await page.waitForTimeout(4000);
  await expect(page.locator('.game')).toHaveAttribute('data-answer', before);
  await expect(page.locator('.dot--done')).toHaveCount(0);
});

test('con la voz activada el juego avanza solo, aunque el navegador no avise el fin de la voz', async ({ page }) => {
  await seedState(page, { ...FAST, prefs: { ...FAST.prefs, voice: true, autoSpeak: true } });
  await page.goto('#/juego/numeros/relacionar/1');
  await playToEnd(page);
});

test('Forma la palabra: una letra equivocada no castiga y se puede escribir con el teclado', async ({ page }) => {
  await seedState(page, FAST);
  await page.goto('#/juego/letras/palabras/2');
  const word = await page.locator('.game').getAttribute('data-answer');
  const wrong = page.locator(`.tile:not([data-letter="${word[0]}"])`).first();
  await wrong.click();
  await expect(page.locator('.feedback')).toContainText('Prueba otra');
  await expect(page.locator('.slot--filled')).toHaveCount(0);
  await wrong.click();
  await expect(page.locator('.tile.is-hint')).toHaveAttribute('data-letter', word[0]);
  for (const letter of word) await page.keyboard.press(letter);
  await expect(page.locator('.word-slots')).toHaveClass(/is-complete/);
  await expect(page.locator('.slot--filled')).toHaveCount(word.length);
});
