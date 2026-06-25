import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types'
import { z } from 'astro/zod'

import { throwPluginError } from './libs/error'
import { starlightImageZoomIntegration } from './libs/integration'

const starlightImageZoomConfigSchema = z
  .object({
    /**
     * Whether an image alternate text should be displayed as a caption when the image is zoomed.
     * Disabling this options is useful if you are already using another approach to display captions.
     *
     * @default true
     */
    showCaptions: z.boolean().default(true),
  })
  .prefault({})

export default function starlightImageZoomPlugin(userConfig?: StarlightImageZoomUserConfig): StarlightPlugin {
  const parsedConfig = starlightImageZoomConfigSchema.safeParse(userConfig)

  if (!parsedConfig.success) {
    throwPluginError(`Invalid starlight-image-zoom configuration:

${z.prettifyError(parsedConfig.error)}
`)
  }

  return {
    name: 'starlight-image-zoom-plugin',
    hooks: {
      'config:setup'({ addIntegration, config, updateConfig }) {
        const updatedConfig: Partial<StarlightUserConfig> = { components: { ...config.components } }

        updatedConfig.components ??= {}

        if (!config.components?.MarkdownContent) {
          updatedConfig.components.MarkdownContent = 'starlight-image-zoom/overrides/MarkdownContent.astro'
        }

        addIntegration(starlightImageZoomIntegration(parsedConfig.data))
        updateConfig(updatedConfig)
      },
    },
  }
}

export type StarlightImageZoomUserConfig = z.input<typeof starlightImageZoomConfigSchema>
export type StarlightImageZoomConfig = z.output<typeof starlightImageZoomConfigSchema>
