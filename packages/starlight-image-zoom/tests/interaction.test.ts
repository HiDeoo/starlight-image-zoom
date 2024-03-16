import { expect, test } from './test'

test('adds a button to trigger the zoom of an image', async ({ testPage }) => {
  await testPage.goto('zoom')

  // Focus the first link in the table of contents.
  await testPage.page.locator('starlight-toc a').focus()
  // Tab to the first image associated button.
  await testPage.page.keyboard.down('Tab')

  expect(await testPage.page.evaluate(() => document.activeElement?.ariaLabel)).toBe('Zoom image: Astro logo')

  // Click the button to zoom the image.
  await testPage.page.locator('*:focus').click()

  await expect(testPage.getZoomedImage()).toBeAttached()
})

test('adds a button to trigger the unzoom of an image', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  expect(await testPage.page.evaluate(() => document.activeElement?.ariaLabel)).toBe('Unzoom image')

  // Click the button to unzoom the image.
  await testPage.page.locator('*:focus').click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('removes the dialog after unzooming an image', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  expect(await testPage.page.evaluate(() => document.activeElement?.ariaLabel)).toBe('Unzoom image')

  // Click the button to unzoom the image.
  await testPage.page.locator('*:focus').click()

  await expect(testPage.page.locator('dialog.starlight-image-zoom-dialog')).not.toBeAttached()
})
