import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env['CI']

export default defineConfig({
  forbidOnly: isCI,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Re-use system Chrome on CI to avoid re-installing it on every run.
        channel: isCI ? 'chrome' : undefined,
        headless: true,
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm build && pnpm preview',
      cwd: '../../docs',
      reuseExistingServer: !isCI,
      url: 'http://localhost:4321',
    },
    {
      command: 'pnpm build:no-caption && pnpm preview:no-caption',
      cwd: '../../docs',
      reuseExistingServer: !isCI,
      url: 'http://localhost:4322/no-caption/',
    },
  ],
})
