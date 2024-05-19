import 'mdast-util-mdx-jsx'
import type { Root } from 'hast'
import { CONTINUE, EXIT, SKIP, visit } from 'unist-util-visit'
import { visitParents } from 'unist-util-visit-parents'

import { STARLIGHT_IMAGE_ZOOM_ZOOMABLE_TAG } from './constants'

const elementTagNames = new Set(['img', 'picture'])
const mdxJsxFlowElementNames = new Set(['img', 'picture', 'astro-image', 'Image', 'Picture'])

export function rehypeStarlightImageZoom() {
  return function transformer(tree: Root) {
    visitParents(tree, ['element', 'mdxJsxFlowElement'], (node, parents) => {
      if (node.type !== 'element' && node.type !== 'mdxJsxFlowElement') return CONTINUE
      if (node.type === 'element' && !elementTagNames.has(node.tagName)) return CONTINUE
      if (node.type === 'mdxJsxFlowElement' && node.name && !mdxJsxFlowElementNames.has(node.name)) return CONTINUE

      // Skip images with the `data-zoom-off` attribute.
      if (
        (node.type === 'element' && 'dataZoomOff' in node.properties) ||
        (node.type === 'mdxJsxFlowElement' &&
          node.attributes.some(
            (attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'data-zoom-off',
          ))
      ) {
        return SKIP
      }

      const isInvalidImage = parents.some((parent) => {
        return (
          parent.type === 'element' &&
          // Exclude images wrapped in an element with the CSS class `not-content`.
          (String(parent.properties['className']).includes('not-content') ||
            // Exclude images wrapped in an interactive element.
            parent.tagName === 'button' ||
            (parent.tagName === 'a' && 'href' in parent.properties))
        )
      })

      if (isInvalidImage) return SKIP

      let alt = ''

      if (node.type === 'element' && node.tagName === 'img') {
        alt = String(node.properties['alt']).trim()
      } else if (node.type === 'element' && node.tagName === 'picture') {
        visit(node, 'element', (child) => {
          if (child.tagName !== 'img') {
            return CONTINUE
          }

          alt = String(child.properties['alt']).trim()
          return EXIT
        })
      } else if (node.type === 'mdxJsxFlowElement') {
        const altAttribute = node.attributes.find(
          (attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'alt',
        )
        alt = String(altAttribute?.value).trim()
      }

      const parent = parents.at(-1)
      const index = parent?.children.indexOf(node)

      if (!parent || index === undefined) return CONTINUE

      parent.children[index] = {
        type: 'element',
        tagName: STARLIGHT_IMAGE_ZOOM_ZOOMABLE_TAG,
        properties: {},
        children: [
          node,
          {
            type: 'element',
            tagName: 'button',
            properties: {
              'aria-label': `Zoom image${alt.length > 0 ? `: ${alt}` : ''}`,
              class: 'starlight-image-zoom-control',
            },
            children: [
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  'aria-hidden': 'true',
                  fill: 'currentColor',
                  viewBox: '0 0 24 24',
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'use',
                    properties: {
                      href: '#starlight-image-zoom-icon-zoom',
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      }

      return SKIP
    })
  }
}

/**
 * rehype-raw strips the `meta` property from code blocks so we manually moved it to a `metastring` property which is
 * supported by expressive-code.
 *
 * @see https://github.com/syntax-tree/hast-util-raw/issues/13
 * @see https://github.com/expressive-code/expressive-code/blob/21fdaa441c89d6a6ac38f5d522b6b60741df2f5d/packages/rehype-expressive-code/src/utils.ts#L15
 */
export function rehypeMetaString() {
  return function (tree: Root) {
    visit(tree, ['element'], (node) => {
      if (node.type === 'element' && node.tagName === 'code' && node.data?.meta) {
        node.properties['metastring'] = node.data.meta
      }
    })
  }
}

declare module 'hast' {
  interface Data {
    meta?: string
  }
}
