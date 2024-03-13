import { expect, test } from './test'

test('zooms an image using Markdown syntax', async ({ testPage }) => {
  await testPage.goto('markdown')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
})

test('zooms a remote image using Markdown syntax', async ({ testPage }) => {
  await testPage.goto('markdown')

  await expect(testPage.getNthImage(1)).toBeZoomedAfterClick()
})

test('zooms an image using Markdown syntax with no caption', async ({ testPage }) => {
  await testPage.goto('markdown')

  await expect(testPage.getNthImage(2)).toBeZoomedAfterClick()
})

test('zooms an image using HTML syntax with the `img` tag', async ({ testPage }) => {
  await testPage.goto('markdown')

  await expect(testPage.getNthImage(3)).toBeZoomedAfterClick()
})

test('zooms an image using HTML syntax with the `picture` tag', async ({ testPage }) => {
  await testPage.goto('markdown')

  await expect(testPage.getNthImage(4)).toBeZoomedAfterClick()
})

test('zooms the expected image when using HTML syntax with the `picture` tag', async ({ testPage }) => {
  await testPage.page.emulateMedia({ colorScheme: 'light' })
  await testPage.goto('markdown')

  const image = testPage.getNthImage(4)
  await image.click()

  expect(await testPage.getZoomedImage().getAttribute('src')).toMatch(/-dark.png$/)

  await testPage.closeZoomedImage()

  await testPage.page.emulateMedia({ colorScheme: 'dark' })
  await testPage.page.reload()

  await image.click()

  expect(await testPage.getZoomedImage().getAttribute('src')).toMatch(/-light.png$/)
})
