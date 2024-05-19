import { expect, test } from './test'

test('mdx: zooms an image using the `<Image>` component', async ({ testPage }) => {
  await testPage.goto('specific-syntax-mdx')

  await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
})

test('mdx: zooms an image using the `<Picture>` component', async ({ testPage }) => {
  await testPage.goto('specific-syntax-mdx')

  await expect(testPage.getNthImage(1)).toBeZoomedAfterClick()
})

test('md: preserves code block metadata', async ({ testPage }) => {
  await testPage.goto('specific-syntax-md')

  await expect(testPage.page.getByText('// src/example.js')).toBeVisible()
})
