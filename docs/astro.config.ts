import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [
    starlight({
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-medium-zoom/edit/main/docs/',
      },
      plugins: [],
      social: {
        github: 'https://github.com/HiDeoo/starlight-medium-zoom',
      },
      title: '// TODO(HiDeoo) ',
    }),
  ],
})
