import type { Page } from '@playwright/test'

export class TestPage {
  constructor(public readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/tests/${slug.replace(/^\//, '')}`)
    await this.page.waitForLoadState('networkidle')
  }

  getNthImage(n: number) {
    return this.page.locator('.sl-markdown-content').getByRole('img').locator(`nth=${n}`)
  }
}
