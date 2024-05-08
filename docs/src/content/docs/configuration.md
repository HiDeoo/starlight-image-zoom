---
title: Configuration
description: An overview of all the configuration options supported by the Starlight Image Zoom plugin.
---

The Starlight Image Zoom plugin can be configured inside the `astro.config.mjs` configuration file of your project:

```js {11}
// astro.config.mjs
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightImageZoom from 'starlight-image-zoom'

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightImageZoom({
          // Configuration options go here.
        }),
      ],
      title: 'My Docs',
    }),
  ],
})
```

## Configuration options

The Starlight Image Zoom plugin accepts the following configuration options:

### `showCaptions`

**Type:** `boolean`  
**Default:** `true`

Whether an image alternate text should be displayed as a caption when the image is zoomed.
Disabling this options is useful if you are already using another approach to display captions.
