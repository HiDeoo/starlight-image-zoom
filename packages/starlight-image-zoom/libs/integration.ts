import type { AstroIntegration } from 'astro'

import type { StarlightImageZoomConfig } from '..'

import { applyMarkdownPlugin } from './processor'
import { vitePluginStarlightImageZoomConfig } from './vite'

export function starlightImageZoomIntegration(config: StarlightImageZoomConfig): AstroIntegration {
  return {
    name: 'starlight-image-zoom-integration',
    hooks: {
      'astro:config:setup': ({ config: astroConfig, updateConfig }) => {
        applyMarkdownPlugin(astroConfig.markdown.processor)

        updateConfig({
          vite: {
            plugins: [vitePluginStarlightImageZoomConfig(config)],
          },
        })
      },
    },
  }
}
