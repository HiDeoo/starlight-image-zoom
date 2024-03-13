import { expect as baseExpect, test as base, type Locator } from '@playwright/test'

import { TestPage } from './fixtures/TestPage'

export const test = base.extend<Fixtures>({
  testPage: async ({ page }, use) => {
    const testPage = new TestPage(page)

    await use(testPage)
  },
})

export const expect = baseExpect.extend({
  async toBeZoomedAfterClick(image: Locator) {
    const page = image.page()

    const assertionName = 'toHaveZoomedImage'
    let matcherResult: MatcherResult | undefined
    let expected: unknown
    let pass = false

    await image.scrollIntoViewIfNeeded()

    let imageAlt = await image.getAttribute('alt')
    imageAlt = imageAlt?.trim() ?? ''

    await image.click()

    try {
      // The overlay should be visible.
      expected = 'visible'
      await baseExpect(page.locator('.medium-zoom-overlay')).toBeVisible()

      // The zoomed image should be visible.
      expected = 'visible'
      await baseExpect(page.locator('.medium-zoom-image--opened')).toBeVisible()

      const captionLocator = page.locator('.smz-caption')

      if (imageAlt.length === 0) {
        // If the image has no alt attribute, the caption should not be visible.
        expected = 'hidden'
        await baseExpect(captionLocator).not.toBeVisible()
      } else {
        // The caption should be the image's alt attribute.
        expected = imageAlt
        baseExpect(await captionLocator.textContent()).toBe(expected)
      }

      pass = true
    } catch (error) {
      if (isExpectError(error)) {
        matcherResult = error.matcherResult
      }
    }

    const message = () =>
      `${this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot })}\n\n` +
      `Locator: ${String(image)}\n` +
      `Expected: ${pass ? (this.isNot ? 'not' : '') : ''}${this.utils.printExpected(expected)}\n${
        matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : ''
      }`

    return {
      actual: matcherResult?.actual,
      expected,
      message,
      name: assertionName,
      pass,
    }
  },
})

function isExpectError(error: unknown): error is ExpectError {
  return 'matcherResult' in (error as ExpectError)
}

interface Fixtures {
  testPage: TestPage
}

interface ExpectError extends Error {
  matcherResult: MatcherResult
}

interface MatcherResult {
  actual?: unknown
}
