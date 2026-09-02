import { unified } from '@astrojs/markdown-remark'

import config from './astro.config'

const unifiedConfig: typeof config = {
  ...config,
  markdown: { processor: unified() },
  base: '/unified/',
  outDir: './dist/unified',
}

export default unifiedConfig
