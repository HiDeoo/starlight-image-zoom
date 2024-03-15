import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightImageZoom from 'starlight-image-zoom'

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-image-zoom/edit/main/docs/',
      },
      plugins: [starlightImageZoom()],
      social: {
        github: 'https://github.com/HiDeoo/starlight-image-zoom',
      },
      title: '// TODO(HiDeoo) ',
    }),
  ],
})
