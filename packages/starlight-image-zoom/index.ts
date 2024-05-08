import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types'
import { AstroError } from 'astro/errors'
import { z } from 'astro/zod'

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
  .default({})

export default function starlightImageZoomPlugin(userConfig?: StarlightImageZoomUserConfig): StarlightPlugin {
  const parsedConfig = starlightImageZoomConfigSchema.safeParse(userConfig)

  if (!parsedConfig.success) {
    throw new AstroError(
      `The provided plugin configuration is invalid.\n${parsedConfig.error.issues.map((issue) => issue.message).join('\n')}`,
      `See the error report above for more informations.\n\nIf you believe this is a bug, please file an issue at https://github.com/HiDeoo/starlight-image-zoom/issues/new/choose`,
    )
  }

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

        addIntegration(starlightImageZoomIntegration(parsedConfig.data))
        updateConfig(updatedConfig)
      },
    },
  }
}

export type StarlightImageZoomUserConfig = z.input<typeof starlightImageZoomConfigSchema>
export type StarlightImageZoomConfig = z.output<typeof starlightImageZoomConfigSchema>
