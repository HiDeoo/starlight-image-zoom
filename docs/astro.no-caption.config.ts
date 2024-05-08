import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightImageZoom from 'starlight-image-zoom'

export default defineConfig({
  base: '/no-caption/',
  integrations: [
    starlight({
      plugins: [starlightImageZoom({ showCaptions: false })],
      title: 'Starlight Image Zoom No Caption Example',
    }),
  ],
  server: {
    port: 4322,
  },
})
