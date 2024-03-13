import type { Page } from '@playwright/test'

export class TestPage {
  constructor(public readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/tests/${slug.replace(/^\//, '')}`)
    await this.page.waitForLoadState('networkidle')
  }

  getNthImage(n: number) {
    // Note that `getByRole('img')` cannot be used as images with no alt attribute would not be found.
    return this.page.locator('.sl-markdown-content img').locator(`nth=${n}`)
  }

  getZoomedImage() {
    return this.page.locator('.medium-zoom-image--opened')
  }

  closeZoomedImage() {
    return this.page.locator('.medium-zoom-image--opened').click()
  }
}
