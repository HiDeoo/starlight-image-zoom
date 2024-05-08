import type { ViteUserConfig } from 'astro'

import type { StarlightImageZoomConfig } from '..'

export function vitePluginStarlightImageZoomConfig(config: StarlightImageZoomConfig): VitePlugin {
  const moduleId = 'virtual:starlight-image-zoom-config'
  const resolvedModuleId = `\0${moduleId}`
  const moduleContent = `export default ${JSON.stringify(config)}`

  return {
    name: 'vite-plugin-starlight-image-zoom-config',
    load(id) {
      return id === resolvedModuleId ? moduleContent : undefined
    },
    resolveId(id) {
      return id === moduleId ? resolvedModuleId : undefined
    },
  }
}

type VitePlugin = NonNullable<ViteUserConfig['plugins']>[number]
