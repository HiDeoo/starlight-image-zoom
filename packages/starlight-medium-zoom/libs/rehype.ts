import 'mdast-util-mdx-jsx'
import type { Root } from 'hast'
import { CONTINUE, EXIT, SKIP, visit } from 'unist-util-visit'
import { visitParents } from 'unist-util-visit-parents'

import { STARLIGHT_MEDIUM_ZOOM_ZOOMABLE_TAG } from './constants'

const elementTagNames = new Set(['img', 'picture'])
const mdxJsxFlowElementNames = new Set(['img', 'picture', 'astro-image', 'Image', 'Picture'])

export function rehypeStarlightMediumZoom() {
  return function transformer(tree: Root) {
    visitParents(tree, ['element', 'mdxJsxFlowElement'], (node, parents) => {
      if (node.type !== 'element' && node.type !== 'mdxJsxFlowElement') return CONTINUE
      if (node.type === 'element' && !elementTagNames.has(node.tagName)) return CONTINUE
      if (node.type === 'mdxJsxFlowElement' && node.name && !mdxJsxFlowElementNames.has(node.name)) return CONTINUE

      // Skip images with the `data-zoom-off` attribute.
      if (node.type === 'element' && 'dataZoomOff' in node.properties) return SKIP

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
        tagName: STARLIGHT_MEDIUM_ZOOM_ZOOMABLE_TAG,
        properties: {},
        children: [
          node,
          {
            type: 'element',
            tagName: 'button',
            properties: {
              'aria-label': `Zoom image${alt.length > 0 ? `: ${alt}` : ''}`,
              class: 'starlight-medium-zoom-control',
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
                      href: '#starlight-medium-zoom-icon-zoom',
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
