import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types'

export default function starlightMediumZoomPlugin(): StarlightPlugin {
  return {
    name: 'starlight-medium-zoom-plugin',
    hooks: {
      setup({ config, logger, updateConfig }) {
        const updatedConfig: Partial<StarlightUserConfig> = { components: { ...config.components } }

        if (!updatedConfig.components) {
          updatedConfig.components = {}
        }

        if (config.components?.MarkdownContent) {
          logger.warn(
            'It looks like you already have a `MarkdownContent` component override in your Starlight configuration.',
          )
          logger.warn(
            'To use `starlight-medium-zoom`, either remove the override or manually render `starlight-medium-zoom/components/MediumZoom.astro`.',
          )
        } else {
          updatedConfig.components.MarkdownContent = 'starlight-medium-zoom/overrides/MarkdownContent.astro'
        }

        updateConfig(updatedConfig)
      },
    },
  }
}
