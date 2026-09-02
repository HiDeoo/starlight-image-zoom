import 'mdast-util-mdx-jsx'
import type { Root } from 'hast'
import { CONTINUE, EXIT, SKIP, visit } from 'unist-util-visit'
import { visitParents } from 'unist-util-visit-parents'

import { STARLIGHT_IMAGE_ZOOM_ZOOMABLE_TAG } from './constants'
import {
  ElementTagNames,
  hasDataZoomOffAttribute,
  isZoomPreventedByAncestor,
  makeImageZoomButton,
  MdxJsxFlowElementNames,
} from './markdown'

export function rehypeStarlightImageZoom() {
  return function transformer(tree: Root) {
    visitParents(tree, ['element', 'mdxJsxFlowElement'], (node, parents) => {
      if (node.type !== 'element' && node.type !== 'mdxJsxFlowElement') return CONTINUE
      if (node.type === 'element' && !ElementTagNames.includes(node.tagName)) return CONTINUE
      if (node.type === 'mdxJsxFlowElement' && node.name && !MdxJsxFlowElementNames.includes(node.name)) return CONTINUE

      // Skip images with the `data-zoom-off` attribute.
      if (hasDataZoomOffAttribute(node)) return SKIP

      const isInvalidImage = parents.some(isZoomPreventedByAncestor)
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
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        alt = String(altAttribute?.value).trim()
      }

      const parent = parents.at(-1)
      const index = parent?.children.indexOf(node)

      if (!parent || index === undefined) return CONTINUE

      parent.children[index] = {
        type: 'element',
        tagName: STARLIGHT_IMAGE_ZOOM_ZOOMABLE_TAG,
        properties: {},
        children: [node, makeImageZoomButton(alt)],
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
