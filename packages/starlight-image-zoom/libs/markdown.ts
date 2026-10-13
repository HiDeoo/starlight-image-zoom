import type { Element, Parents } from 'hast'
import type { MdxJsxFlowElementHast, MdxJsxTextElementHast } from 'satteri'
import { CONTINUE, EXIT, visit } from 'unist-util-visit'

export const ElementTagNames = ['img', 'picture']
export const MdxJsxFlowElementNames = ['img', 'picture', 'astro-image', 'Image', 'Picture']

export function hasDataZoomOffAttribute(node: ZoomableImageNode) {
  return (
    (node.type === 'element' && 'dataZoomOff' in node.properties) ||
    (node.type === 'mdxJsxFlowElement' &&
      node.attributes.some((attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'data-zoom-off'))
  )
}

export function isZoomPreventedByAncestor(parent: Parents) {
  return (
    (parent.type === 'element' &&
      // Exclude images wrapped in an element with the CSS class `not-content`.
      (String(parent.properties['className']).includes('not-content') ||
        // Exclude images wrapped in an interactive element.
        parent.tagName === 'button' ||
        (parent.tagName === 'a' && 'href' in parent.properties))) ||
    // Exclude images wrapped in the `<Zoom>` component.
    (parent.type === 'mdxJsxFlowElement' && parent.name === 'Zoom')
  )
}

export function makeImageZoomButton(alt: string): Element {
  return {
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
  }
}

export function getAlt(node: ZoomableImageNode) {
  // The `<Picture>` component has its own `alt` attribute, unlike an HTML `<picture>` element.
  if ((node.type === 'element' ? node.tagName : node.name) !== 'picture') return readAlt(node)

  let alt = ''

  visit(node, (child) => {
    if (
      !(child.type === 'element' && child.tagName === 'img') &&
      !((child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement') && child.name === 'img')
    ) {
      return CONTINUE
    }

    alt = readAlt(child)

    return EXIT
  })

  return alt
}

function readAlt(node: ZoomableImageNode | MdxJsxTextElementHast) {
  const alt =
    node.type === 'element'
      ? node.properties['alt']
      : node.attributes.find((attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'alt')?.value

  return typeof alt === 'string' ? alt.trim() : ''
}

export type ZoomableImageNode = Element | MdxJsxFlowElementHast
