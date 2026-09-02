import type { Properties } from 'hast'
import {
  defineHastPlugin,
  defineMdastPlugin,
  type HastNode,
  type HastPluginDefinition,
  type HastVisitorContext,
  type MdastPluginDefinition,
} from 'satteri'
import { CONTINUE, EXIT, visit } from 'unist-util-visit'

import { STARLIGHT_IMAGE_ZOOM_ZOOMABLE_TAG } from './constants'
import {
  ElementTagNames,
  hasDataZoomOffAttribute,
  isZoomPreventedByAncestor,
  makeImageZoomButton,
  MdxJsxFlowElementNames,
  type ZoomableImageNode,
} from './markdown'

const CODE_LANG_PROPERTY = 'dataStarlightImageZoomLang'
const CODE_META_PROPERTY = 'dataStarlightImageZoomMeta'

export function satteriPreserveCodeMetadata(): MdastPluginDefinition {
  return defineMdastPlugin({
    name: 'starlight-image-zoom-preserve-code-metadata',
    code(node, ctx) {
      const data = node.data as CodeDataWithHProperties | undefined

      ctx.setProperty(node, 'data', {
        ...data,
        hProperties: {
          ...data?.hProperties,
          [CODE_LANG_PROPERTY]: node.lang,
          [CODE_META_PROPERTY]: node.meta,
        },
      })
    },
  })
}

export function satteriRestoreCodeMetadata(): HastPluginDefinition {
  return defineHastPlugin({
    name: 'starlight-image-zoom-restore-code-metadata',
    element: {
      filter: ['pre'],
      visit(node, ctx) {
        const lang = node.properties[CODE_LANG_PROPERTY]
        const meta = node.properties[CODE_META_PROPERTY]

        if (typeof lang !== 'string' && typeof meta !== 'string') return

        ctx.setProperty(node, CODE_LANG_PROPERTY, null)
        ctx.setProperty(node, CODE_META_PROPERTY, null)

        const code = node.children.find((child) => child.type === 'element' && child.tagName === 'code')

        if (!code) return

        ctx.setProperty(code, 'data', {
          ...code.data,
          ...(typeof lang === 'string' && { lang }),
          ...(typeof meta === 'string' && { meta }),
        })
      },
    },
  })
}

export function satteriStarlightImageZoom(): HastPluginDefinition {
  return defineHastPlugin({
    name: 'starlight-image-zoom',
    element: {
      filter: ElementTagNames,
      visit: wrapImage,
    },
    mdxJsxFlowElement: {
      filter: MdxJsxFlowElementNames,
      visit: wrapImage,
    },
  })
}

function wrapImage(node: ZoomableImageNode, ctx: HastVisitorContext) {
  if (shouldSkipImage(node, ctx)) return

  const alt = getAlt(node)

  ctx.wrapNode(node, {
    type: 'element',
    tagName: STARLIGHT_IMAGE_ZOOM_ZOOMABLE_TAG,
    properties: {},
    children: [makeImageZoomButton(alt)],
  })
}

function shouldSkipImage(node: ZoomableImageNode, ctx: HastVisitorContext) {
  if (hasDataZoomOffAttribute(node)) return true

  let parent = ctx.parent(node)

  while (parent) {
    if (isPicture(parent) || isZoomPreventedByAncestor(parent)) return true
    parent = ctx.parent(parent)
  }

  return false
}

function getAlt(node: ZoomableImageNode) {
  if (node.type === 'mdxJsxFlowElement') {
    const altAttribute = node.attributes.find(
      (attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'alt',
    )

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return String(altAttribute?.value).trim()
  }

  if (node.tagName === 'img') {
    return String(node.properties['alt']).trim()
  }

  let alt = ''

  visit(node, 'element', (child) => {
    if (child.tagName !== 'img') {
      return CONTINUE
    }

    alt = String(child.properties['alt']).trim()
    return EXIT
  })

  return alt
}

function isPicture(node: HastNode) {
  return (
    (node.type === 'element' && node.tagName === 'picture') ||
    (node.type === 'mdxJsxFlowElement' && (node.name === 'picture' || node.name === 'Picture'))
  )
}

interface CodeDataWithHProperties {
  hProperties?: Properties | undefined
}
