import { expect, test } from './test'

const formats = ['md', 'mdx']

for (const format of formats) {
  const slug = `shared-syntax-${format}`

  test(`${format}: zooms an image using Markdown syntax`, async ({ testPage }) => {
    await testPage.goto(slug)

    await expect(testPage.getNthImage(0)).toBeZoomedAfterClick()
  })

  test(`${format}: zooms a remote image using Markdown syntax`, async ({ testPage }) => {
    await testPage.goto(slug)

    await expect(testPage.getNthImage(1)).toBeZoomedAfterClick()
  })

  test(`${format}: zooms an image using Markdown syntax with no caption`, async ({ testPage }) => {
    await testPage.goto(slug)

    await expect(testPage.getNthImage(2)).toBeZoomedAfterClick()
  })

  test(`${format}: zooms an image using HTML syntax with the \`<img>\` tag`, async ({ testPage }) => {
    await testPage.goto(slug)

    await expect(testPage.getNthImage(3)).toBeZoomedAfterClick()
  })

  test(`${format}: zooms an image using HTML syntax with the \`<picture>\` tag`, async ({ testPage }) => {
    await testPage.goto(slug)

    await expect(testPage.getNthImage(4)).toBeZoomedAfterClick()
  })

  test(`${format}: zooms the expected image when using HTML syntax with the \`<picture>\` tag`, async ({
    testPage,
  }) => {
    await testPage.page.emulateMedia({ colorScheme: 'light' })
    await testPage.goto(slug)

    const image = testPage.getNthImage(4)
    await testPage.zoomImage(image)

    expect(await testPage.getZoomedImage().getAttribute('src')).toMatch(/-dark.png$/)

    await testPage.closeZoomedImage()

    await testPage.page.emulateMedia({ colorScheme: 'dark' })
    await testPage.page.reload()

    await testPage.zoomImage(image)

    expect(await testPage.getZoomedImage().getAttribute('src')).toMatch(/-light.png$/)
  })
}
