import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for the reference site.
 *
 * FND-COMPAT-03: 3 engines (Chromium, Firefox, WebKit) for the functional smoke
 * suite. Tests run against the production `astro build` output via
 * `astro preview` (not the dev server) so they exercise the real artifact.
 *
 * Note: the browser binaries must be installed once via `pnpm exec playwright
 * install --with-deps` (or `npx playwright install`). CI images that lack them
 * will fail the webServer health check loudly rather than silently passing.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html"]] : "html",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    // Build first, then preview the static output. Preview serves the real
    // production artifact (correct 404s, real trailing-slash handling). Uses
    // npx so the command works whether the runner is pnpm/npm/yarn.
    command: "npx astro build && npx astro preview --port 4321",
    url: "http://localhost:4321/sr/",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: { ASTRO_TELEMETRY_DISABLED: "1" },
  },
});
