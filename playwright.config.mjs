import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}/un-mundo-para-todos/`,
    locale: 'es-EC',
    trace: 'retain-on-failure',
    // Cámara simulada para probar la práctica de señas sin hardware real.
    launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
  },
  webServer: {
    command: `node tests/server.mjs`,
    url: `http://localhost:${PORT}/un-mundo-para-todos/`,
    reuseExistingServer: true,
    env: { PORT: String(PORT) },
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] } } },
    { name: 'movil', use: { ...devices['Pixel 5'], launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] } } },
  ],
});
