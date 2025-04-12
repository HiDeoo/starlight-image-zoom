# starlight-image-zoom

## 0.12.0

### Minor Changes

- [#39](https://github.com/HiDeoo/starlight-image-zoom/pull/39) [`837e543`](https://github.com/HiDeoo/starlight-image-zoom/commit/837e5430e971345b1d6c737657d607dbef73948b) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Adds a new `data-zoom-id` attribute to zoomed images matching the `id` of the original image if it exists.

  This can be useful if you are relying on the `id` attribute to customize the appearance of images using CSS and also want to apply the same styles to zoomed images.

## 0.11.1

### Patch Changes

- [#34](https://github.com/HiDeoo/starlight-image-zoom/pull/34) [`58dcce6`](https://github.com/HiDeoo/starlight-image-zoom/commit/58dcce681f52f0001c18adba15b4cb086cd14eb5) Thanks [@DaniFoldi](https://github.com/DaniFoldi)! - Moves `mdast-util-mdx-jsx` package to non-dev dependencies to prevent issues in monorepos with hoisting disabled.

## 0.11.0

### Minor Changes

- [#32](https://github.com/HiDeoo/starlight-image-zoom/pull/32) [`02a52df`](https://github.com/HiDeoo/starlight-image-zoom/commit/02a52df958e0bf814f9e51e92d4ed0ce46dff53a) Thanks [@HiDeoo](https://github.com/HiDeoo)! - ⚠️ **BREAKING CHANGE:** The minimum supported version of Starlight is now version `0.32.0`.

  Please use the `@astrojs/upgrade` command to upgrade your project:

  ```sh
  npx @astrojs/upgrade
  ```

## 0.10.1

### Patch Changes

- [#30](https://github.com/HiDeoo/starlight-image-zoom/pull/30) [`98ae50e`](https://github.com/HiDeoo/starlight-image-zoom/commit/98ae50e5c4d9102991f146570a76844e816602ed) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Fixes an issue where SVG images were not being properly identified as SVGs when running in development mode.

## 0.10.0

### Minor Changes

- [#27](https://github.com/HiDeoo/starlight-image-zoom/pull/27) [`e716c66`](https://github.com/HiDeoo/starlight-image-zoom/commit/e716c66dd585fe2fd78432add8d9895c8110131f) Thanks [@HiDeoo](https://github.com/HiDeoo)! - Adds support for Astro v5, drops support for Astro v4.

  ⚠️ **BREAKING CHANGE:** The minimum supported version of Starlight is now `0.30.0`.

  Please follow the [upgrade guide](https://github.com/withastro/starlight/releases/tag/%40astrojs/starlight%400.30.0) to update your project.
