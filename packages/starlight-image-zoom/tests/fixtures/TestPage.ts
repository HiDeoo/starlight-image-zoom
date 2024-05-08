import type { Locator, Page } from '@playwright/test'

export class TestPage {
  static #zoomedImageSelector = '.starlight-image-zoom-image'

  static async zoomImage(image: Locator) {
    await image.click()

    // Wait for the zoomed image to be stable.
    const zoomedImageLocator = image.page().locator(TestPage.#zoomedImageSelector)
    const zoomedImageHandle = await zoomedImageLocator.elementHandle()
    await zoomedImageHandle?.waitForElementState('stable')
    await zoomedImageHandle?.waitForElementState('stable')
  }

  constructor(public readonly page: Page) {}

  async goto(slug: string, noCaption = false) {
    await this.page.goto(`http://localhost:${noCaption ? '4322/no-caption' : '4321'}/tests/${slug.replace(/^\//, '')}`)
    await this.page.waitForLoadState('networkidle')
  }

  getNthImage(n: number) {
    // Note that `getByRole('img')` cannot be used as images with no alt attribute would not be found.
    return this.page.locator('.sl-markdown-content img').locator(`nth=${n}`)
  }

  getZoomedImage() {
    return this.page.locator(TestPage.#zoomedImageSelector)
  }

  zoomImage(image: Locator) {
    return TestPage.zoomImage(image)
  }

  closeZoomedImage() {
    return this.page.locator(TestPage.#zoomedImageSelector).click()
  }
}
