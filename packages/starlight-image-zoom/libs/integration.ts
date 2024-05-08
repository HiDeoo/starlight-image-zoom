import type { AstroIntegration } from 'astro'
import rehypeRaw from 'rehype-raw'

import type { StarlightImageZoomConfig } from '..'

import { rehypeStarlightImageZoom } from './rehype'
import { vitePluginStarlightImageZoomConfig } from './vite'

export function starlightImageZoomIntegration(config: StarlightImageZoomConfig): AstroIntegration {
  return {
    name: 'starlight-image-zoom-integration',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            rehypePlugins: [rehypeRaw, rehypeStarlightImageZoom],
          },
          vite: {
            plugins: [vitePluginStarlightImageZoomConfig(config)],
          },
        })
      },
    },
  }
}
