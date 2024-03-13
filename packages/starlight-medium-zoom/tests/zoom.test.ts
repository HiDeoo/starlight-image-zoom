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
