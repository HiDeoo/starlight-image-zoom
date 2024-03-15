import type { AstroIntegration } from 'astro'
import rehypeRaw from 'rehype-raw'

import { rehypeStarlightImageZoom } from './rehype'

export function starlightImageZoomIntegration(): AstroIntegration {
  return {
    name: 'starlight-image-zoom-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            rehypePlugins: [rehypeRaw, rehypeStarlightImageZoom],
          },
        })
      },
    },
  }
}
