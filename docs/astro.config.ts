import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightImageZoom from 'starlight-image-zoom'

const site =
  process.env['VERCEL_ENV'] !== 'production' && process.env['VERCEL_URL']
    ? `https://${process.env['VERCEL_URL']}`
    : 'https://starlight-image-zoom.vercel.app/'

export default defineConfig({
  integrations: [
    starlight({
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-image-zoom/edit/main/docs/',
      },
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: new URL('og.jpg', site).href },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:alt',
            content: 'Starlight plugin adding zoom capabilities to your documentation images.',
          },
        },
      ],
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
            { label: 'Zoom component', link: '/components/zoom/' },
            { label: 'Customization', link: '/customization/' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { label: 'Showcase', link: '/resources/showcase/' },
            { label: 'Plugins and Tools', link: '/resources/starlight/' },
          ],
        },
        { label: 'Demo', link: '/demo/' },
      ],
      social: [
        {
          href: 'https://bsky.app/profile/hideoo.dev',
          icon: 'blueSky',
          label: 'Bluesky',
        },
        {
          href: 'https://github.com/HiDeoo/starlight-image-zoom',
          icon: 'github',
          label: 'GitHub',
        },
      ],
      title: 'Starlight Image Zoom',
    }),
  ],
  site,
})
