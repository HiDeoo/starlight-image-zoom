import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightMediumZoom from 'starlight-medium-zoom'

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-medium-zoom/edit/main/docs/',
      },
      plugins: [starlightMediumZoom()],
      social: {
        github: 'https://github.com/HiDeoo/starlight-medium-zoom',
      },
      title: '// TODO(HiDeoo) ',
    }),
  ],
})
