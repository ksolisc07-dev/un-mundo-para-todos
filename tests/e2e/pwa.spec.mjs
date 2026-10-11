import { test, expect } from './fixtures.mjs';

test('el manifiesto y el service worker funcionan; la app abre sin conexión', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Service worker probado en Chromium');
  await page.goto('./');
  const manifest = await page.evaluate(async () => (await fetch('manifest.webmanifest')).json());
  expect(manifest.start_url).toBe('./');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload(); // ahora controlada por el service worker
  await expect(page.locator('.world-card')).toHaveCount(6);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.world-card')).toHaveCount(6);
  await page.goto('#/juego/numeros/contar/1');
  await expect(page.locator('.option').first()).toBeVisible();
  await context.setOffline(false);
});
