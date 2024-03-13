import { expect, test } from './test'

test('zoom an image using Markdown syntax', async ({ testPage }) => {
  await testPage.goto('markdown')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
})

test('zoom a remote image using Markdown syntax', async ({ testPage }) => {
  await testPage.goto('markdown')

  await expect(testPage.getNthImage(1)).toBeZoomedAfterClick()
})
