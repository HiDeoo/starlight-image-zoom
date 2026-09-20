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

test('zooms further inside the opened image', async ({ testPage }) => {
  await testPage.goto('zoom')
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  const dialog = testPage.page.locator('dialog.starlight-image-zoom-dialog')
  const zoomIn = dialog.locator('[data-zoom="in"]')
  const zoomOut = dialog.locator('[data-zoom="out"]')
  const zoomLevel = dialog.locator('output')

  await expect(zoomLevel).toHaveText('100%')
  await zoomOut.click()
  await expect(zoomLevel).toHaveText('100%')

  await zoomIn.click()
  await expect(zoomLevel).toHaveText('125%')

  await zoomIn.click()
  await expect(zoomLevel).toHaveText('150%')

  await zoomIn.click()
  await expect(zoomLevel).toHaveText('200%')

  await zoomIn.click()
  await expect(zoomLevel).toHaveText('300%')

  await zoomIn.click()
  await expect(zoomLevel).toHaveText('400%')

  // Maximum zoom level.
  await zoomIn.click()
  await expect(zoomLevel).toHaveText('400%')

  await zoomOut.click()
  await expect(zoomLevel).toHaveText('300%')
})

test('operates zoom controls with the keyboard', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  const dialog = testPage.page.locator('dialog.starlight-image-zoom-dialog')
  const zoomIn = dialog.locator('[data-zoom="in"]')
  const zoomLevel = dialog.locator('output')

  await zoomIn.focus()
  await testPage.page.keyboard.press('Enter')
  await expect(zoomLevel).toHaveText('125%')

  await testPage.page.keyboard.press('Space')
  await expect(zoomLevel).toHaveText('150%')
})

test('allows scrolling the image after zooming', async ({ testPage }) => {
  await testPage.page.setViewportSize({ width: 320, height: 240 })
  await testPage.goto('zoom')
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  const dialog = testPage.page.locator('dialog.starlight-image-zoom-dialog')
  await dialog.locator('[data-zoom="in"]').click()
  await dialog.locator('[data-zoom="in"]').click()
  await dialog.locator('[data-zoom="in"]').click()

  expect(
    await dialog
      .locator('figure')
      .evaluate((figure: HTMLElement) => figure.scrollWidth > figure.clientWidth || figure.scrollHeight > figure.clientHeight),
  ).toBe(true)
})

test('closes when the image is clicked after opening', async ({ testPage }) => {
  await testPage.goto('zoom')
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  await testPage.getZoomedImage().click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('does not close when the wheel is used in the modal', async ({ testPage }) => {
  await testPage.goto('zoom')
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  await testPage.page.locator('figure').dispatchEvent('wheel')

  await expect(testPage.getZoomedImage()).toBeAttached()
})

test('closes with Escape', async ({ testPage }) => {
  await testPage.goto('zoom')
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  await testPage.page.keyboard.press('Escape')

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('closes when the background is clicked', async ({ testPage }) => {
  await testPage.goto('zoom')
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  await testPage.page.locator('figure').click({ position: { x: 1, y: 1 } })

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('resets the zoom level when closed', async ({ testPage }) => {
  await testPage.goto('zoom')
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()

  const dialog = testPage.page.locator('dialog.starlight-image-zoom-dialog')
  await dialog.locator('[data-zoom="in"]').click()
  await dialog.locator('[data-zoom="in"]').click()
  await dialog.locator('[data-zoom="in"]').click()
  await dialog.locator('[aria-label="Unzoom image"]').click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
  await expect(testPage.page.locator('dialog output')).toHaveText('100%')
})

test.describe('zoom component', () => {
  test('adds a button to trigger the zoom of an image', async ({ testPage }) => {
    await testPage.goto('zoom')

    // Focus the first link in the table of contents.
    await testPage.page.locator('starlight-toc a').focus()
    // Tab to the third image associated button.
    await testPage.page.keyboard.down('Tab')
    await testPage.page.keyboard.down('Tab')
    await testPage.page.keyboard.down('Tab')

    expect(await testPage.page.evaluate(() => document.activeElement?.ariaLabel)).toBe(
      'Zoom image: Astro logo SVG component',
    )

    // Click the button to zoom the image.
    await testPage.page.locator('*:focus').click()

    await expect(testPage.getZoomedImage()).toBeAttached()
  })

  test('adds a button to trigger the unzoom of an image', async ({ testPage }) => {
    await testPage.goto('zoom')

    await expect(testPage.getNthImage(3)).toBeZoomedAfterClick()

    expect(await testPage.page.evaluate(() => document.activeElement?.ariaLabel)).toBe('Unzoom image')

    // Click the button to unzoom the image.
    await testPage.page.locator('*:focus').click()

    await expect(testPage.getZoomedImage()).not.toBeAttached()
  })

  test('removes the dialog after unzooming an image', async ({ testPage }) => {
    await testPage.goto('zoom')

    await expect(testPage.getNthImage(3)).toBeZoomedAfterClick()

    expect(await testPage.page.evaluate(() => document.activeElement?.ariaLabel)).toBe('Unzoom image')

    // Click the button to unzoom the image.
    await testPage.page.locator('*:focus').click()

    await expect(testPage.page.locator('dialog.starlight-image-zoom-dialog')).not.toBeAttached()
  })
})
