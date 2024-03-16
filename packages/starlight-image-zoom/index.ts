import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types'

import { starlightImageZoomIntegration } from './libs/integration'

export default function starlightImageZoomPlugin(): StarlightPlugin {
  return {
    name: 'starlight-image-zoom-plugin',
    hooks: {
      setup({ addIntegration, config, logger, updateConfig }) {
        const updatedConfig: Partial<StarlightUserConfig> = { components: { ...config.components } }

        if (!updatedConfig.components) {
          updatedConfig.components = {}
        }

        if (config.components?.MarkdownContent) {
          logger.warn(
            'It looks like you already have a `MarkdownContent` component override in your Starlight configuration.',
          )
          logger.warn(
            'To use `starlight-image-zoom`, either remove the override or manually render `starlight-image-zoom/components/ImageZoom.astro`.',
          )
        } else {
          updatedConfig.components.MarkdownContent = 'starlight-image-zoom/overrides/MarkdownContent.astro'
        }

        addIntegration(starlightImageZoomIntegration())
        updateConfig(updatedConfig)
      },
    },
  }
}
