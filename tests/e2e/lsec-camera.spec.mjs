import { test, expect, seedState, FAST } from './fixtures.mjs';

// Simula que existen videos LSEC validados (sólo en esta prueba) reescribiendo
// el registro al vuelo. En el sitio real todas las entradas siguen pendientes.
test.use({ serviceWorkers: 'block' });

async function withValidatedVideos(page) {
  await page.route('**/js/data/lsec.js', async (route) => {
    const response = await route.fetch();
    const body = (await response.text())
      .replace("status: LSEC_STATUS.PENDING,", 'status: LSEC_STATUS.VALIDATED,')
      .replace("src: null, //", "src: 'assets/lsec/videos/prueba.webm', //")
      .replace("license: null, //", "license: 'Licencia de prueba', //")
      .replace("validation: null, //", "validation: { reviewers: ['Revisión de prueba'], date: '2026-01-01' }, //")
      .replace('consent: false,', 'consent: true,');
    await route.fulfill({ response, body });
  });
  await page.route('**/assets/lsec/videos/prueba.webm', (route) =>
    route.fulfill({ status: 200, contentType: 'video/webm', body: '' })
  );
}

test('con videos validados: el video aparece en el juego y la cámara funciona como espejo', async ({ page }) => {
  await withValidatedVideos(page);
  await seedState(page, { ...FAST, prefs: { ...FAST.prefs, lsec: true, lsecCamera: true } });
  await page.goto('#/juego/numeros/numeros/1');
  await expect(page.locator('.lsec-player')).toBeVisible();
  await expect(page.locator('.lsec-player figcaption')).toContainText('Validado por: Revisión de prueba');
  const toggle = page.getByRole('button', { name: 'Practicar con mi cámara' });
  await toggle.click();
  await expect(page.locator('.camera-practice')).toHaveClass(/is-on/);
  await expect(page.locator('.camera-privacy')).toContainText('no se graba ni se envía');
  await expect.poll(() => page.locator('.camera-video').evaluate((v) => Boolean(v.srcObject?.active))).toBe(true);
  await page.getByRole('button', { name: 'Apagar la cámara' }).click();
  await expect(page.locator('.camera-practice')).not.toHaveClass(/is-on/);
});

test('la cámara no aparece si una persona adulta no la permitió', async ({ page }) => {
  await withValidatedVideos(page);
  await seedState(page, { ...FAST, prefs: { ...FAST.prefs, lsec: true } });
  await page.goto('#/juego/numeros/numeros/1');
  await expect(page.locator('.lsec-player')).toBeVisible();
  await expect(page.locator('.camera-practice')).toHaveCount(0);
});

test('sin videos validados, la cámara está deshabilitada en el panel docente', async ({ page }) => {
  await page.goto('#/docentes');
  const q = await page.locator('.gate-question').textContent();
  const [, a, b] = q.match(/(\d+) × (\d+)/);
  await page.getByLabel(/¿Cuánto es/).fill(String(a * b));
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('switch', { name: /practicar señas frente a la cámara/i })).toBeDisabled();
});
