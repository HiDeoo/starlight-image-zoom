import { expect, test } from './test'

test('zooms an SVG image', async ({ testPage }) => {
  await testPage.goto('zoom')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
})

test('does not zoom an SVG image from the `<Icon>` component', async ({ testPage }) => {
  await testPage.goto('zoom')

  const svg = testPage.page.locator('.sl-markdown-content p + svg:nth-of-type(1)')
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

test('does not zoom an image using the `<Image>` component with the `zoom-off` data attribute', async ({
  testPage,
}) => {
  await testPage.goto('zoom-off')

  const zoomOffImage = testPage.getNthImage(2)
  await zoomOffImage.click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
})

test('does not zoom an SVG image inside an interactive element', async ({ testPage }) => {
  await testPage.goto('zoom')

  const linkImage = testPage.getNthImage(1)
  await linkImage.click()

  await expect(testPage.getZoomedImage()).not.toBeAttached()
  expect(testPage.page.url()).toBe('https://astro.build/')
})

test('does not set an ID on the zoomed image', async ({ testPage }) => {
  await testPage.goto('data-zoom-id')

  const imageWithNoId = testPage.getNthImage(0)
  await imageWithNoId.click()

  const zoomedImage = testPage.getZoomedImage()

  expect(await zoomedImage.getAttribute('id')).toBe(null)
  expect(await zoomedImage.getAttribute('data-zoom-id')).toBe(null)
})

test('preserves image ID in the `data-zoom-id` attribute', async ({ testPage }) => {
  await testPage.goto('data-zoom-id')

  const imageWithId = testPage.getNthImage(1)
  await imageWithId.click()

  const zoomedImage = testPage.getZoomedImage()

  expect(await zoomedImage.getAttribute('id')).toBe(null)
  expect(await zoomedImage.getAttribute('data-zoom-id')).toBe('astro-logo')
})
