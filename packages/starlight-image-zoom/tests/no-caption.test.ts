import { expect, test } from './test'

test('does not add a caption if the `showCaptions` option is disabled', async ({ testPage }) => {
  await testPage.goto('zoom', true)

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
})
