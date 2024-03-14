import { expect, test } from './test'

test('zooms an SVG image', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
})

test('closes the zoomed image when using the `Tab` key', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  await testPage.page.keyboard.press('Tab')

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})
