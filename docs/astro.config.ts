import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightImageZoom from 'starlight-image-zoom'

export default defineConfig({
  integrations: [
    starlight({
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-image-zoom/edit/main/docs/',
      },
      plugins: [starlightImageZoom()],
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'Getting Started', link: '/getting-started/' },
            { label: 'Configuration', link: '/configuration/' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Ignoring Images', link: '/ignoring-images/' },
            { label: 'Customization', link: '/customization/' },
          ],
        },
        { label: 'Demo', link: '/demo/' },
      ],
      social: {
        github: 'https://github.com/HiDeoo/starlight-image-zoom',
      },
      title: 'Starlight Image Zoom',
    }),
  ],
})
