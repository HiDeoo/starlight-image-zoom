import { expect, test } from './test'

test('zooms an SVG image', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
})

test('does not zoom an SVG image from the `<Icon>` component', async ({ testPage }) => {
  await testPage.goto('zoom')

  const svg = testPage.page.locator('.sl-markdown-content svg:nth-of-type(1)')
  await svg.click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('does not zoom an hero image', async ({ testPage }) => {
  await testPage.goto('hero')

  const heroImage = testPage.page.locator('.hero img')
  await heroImage.click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('does not zoom an image inside a parent with the `not-content` CSS class', async ({ testPage }) => {
  await testPage.goto('not-content')

  const notContentImage = testPage.getNthImage(1)
  await notContentImage.click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('does not zoom an image with the `zoom-off` data attribute', async ({ testPage }) => {
  await testPage.goto('zoom-off')

  const zoomOffImage = testPage.getNthImage(1)
  await zoomOffImage.click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('closes the zoomed image when using the `Tab` key', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  await testPage.page.keyboard.press('Tab')

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})
