import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env['CI']

const browser = {
  ...devices['Desktop Chrome'],
  // Re-use system Chrome on CI to avoid re-installing it on every run.
  channel: isCI ? 'chrome' : undefined,
  headless: true,
}

const noCaptionTest = /no-caption\.test\.ts/

export default defineConfig({
  forbidOnly: isCI,
  projects: [
    {
      name: 'satteri',
      testIgnore: noCaptionTest,
      use: {
        ...browser,
        baseURL: 'http://localhost:4321/',
      },
    },
    {
      name: 'no-caption',
      testMatch: noCaptionTest,
      use: {
        ...browser,
        baseURL: 'http://localhost:4321/no-caption/',
      },
    },
    {
      name: 'unified',
      testIgnore: noCaptionTest,
      use: {
        ...browser,
        baseURL: 'http://localhost:4321/unified/',
      },
    },
  ],
  webServer: {
    command: 'pnpm build && pnpm build:no-caption && pnpm build:unified && pnpm preview',
    cwd: '../../docs',
    reuseExistingServer: !isCI,
    url: 'http://localhost:4321',
  },
})
