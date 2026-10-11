import { test as base, expect } from '@playwright/test';

/**
 * Cada prueba falla si la página produce errores de JavaScript, errores en
 * consola o pide archivos que no existen (404).
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    const problems = [];
    page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error') problems.push(`console: ${m.text()}`);
    });
    page.on('response', (r) => {
      if (r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`);
    });
    await use(page);
    expect(problems, problems.join('\n')).toEqual([]);
  },
});

export { expect };

/** Prepara el almacenamiento local antes de cargar la página (p. ej. 3 rondas). */
export async function seedState(page, state) {
  await page.addInitScript((value) => {
    if (!sessionStorage.getItem('__seeded')) {
      localStorage.setItem('un-mundo-para-todos.v1', JSON.stringify(value));
      sessionStorage.setItem('__seeded', '1');
    }
  }, state);
}

export const FAST = {
  version: 1,
  // Voz apagada: el navegador de pruebas no tiene voces y así las rondas avanzan sin esperas.
  prefs: { voice: false, autoSpeak: false, motion: 'reduce', celebrations: false },
  teacher: { difficulty: 'auto', rounds: 3, disabled: {} },
  progress: {},
};

/** Juega una actividad completa respondiendo bien (usa data-answer). */
export async function playToEnd(page) {
  const game = page.locator('.game');
  await expect(game).toBeVisible();
  if (await game.evaluate((el) => el.classList.contains('game--memory'))) {
    const keys = await page.locator('.memory-card').evaluateAll((cards) => cards.map((c) => c.dataset.key));
    for (const key of [...new Set(keys)]) {
      const pair = page.locator(`.memory-card[data-key="${key}"]`);
      await pair.nth(0).click();
      await pair.nth(1).click();
      await expect(pair.nth(0)).toHaveClass(/is-matched/);
    }
  } else {
    for (;;) {
      if (await page.locator('.finish').isVisible()) break;
      const answer = await game.getAttribute('data-answer');
      const option = page.locator(`.option[data-key="${answer}"]`);
      await option.click();
      await expect(option).toHaveClass(/is-correct/);
      // Espera a la siguiente ronda (sin opción marcada) o a la pantalla final.
      await page.waitForFunction(() => document.querySelector('.finish') || !document.querySelector('.option.is-correct'), null, {
        timeout: 12000,
      });
    }
  }
  await expect(page.locator('.finish h2')).toContainText('¡Lo lograste');
}
