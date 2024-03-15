import type { AstroIntegration } from 'astro'
import rehypeRaw from 'rehype-raw'

import { rehypeStarlightMediumZoom } from './rehype'

export function starlightMediumZoomIntegration(): AstroIntegration {
  return {
    name: 'starlight-medium-zoom-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            rehypePlugins: [rehypeRaw, rehypeStarlightMediumZoom],
          },
        })
      },
    },
  }
}
