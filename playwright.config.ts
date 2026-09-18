import { defineConfig, devices } from '@playwright/test';

/**
 * Runs against the built site rather than the dev server, so what is tested is
 * what Cloudflare will actually serve.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // --ignore-lock: Astro refuses to start if a stale lock file from an
    // earlier run is still on disk, which Playwright reports as "exited early".
    command: 'npm run build && npx astro preview --port 4321 --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
