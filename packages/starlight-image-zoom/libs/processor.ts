import type { AstroConfig } from 'astro'
import rehypeRaw from 'rehype-raw'

import { throwPluginError } from './error'
import { rehypeMetaString, rehypeStarlightImageZoom } from './rehype'

export function applyMarkdownPlugin(processor: MarkdownProcessor) {
  if (isSatteriProcessor(processor)) {
    throwPluginError(
      "The Sätteri Markdown processor is not yet supported by the starlight-image-zoom plugin. Switch to 'unified()' from '@astrojs/markdown-remark'.",
      'To follow the progress of Sätteri support, see https://github.com/HiDeoo/starlight-image-zoom/issues/63',
    )
  } else if (isUnifiedProcessor(processor)) {
    processor.options.rehypePlugins.push(rehypeMetaString, rehypeRaw, rehypeStarlightImageZoom)
  } else {
    throwPluginError("The configured 'markdown.processor' is not supported by the starlight-image-zoom plugin.")
  }
}

function isSatteriProcessor(processor: unknown): processor is SatteriMarkdownProcessor {
  if (typeof processor !== 'object' || processor === null) return false
  const candidate = processor as { name?: unknown; options?: { hastPlugins?: unknown } }
  return candidate.name === 'satteri' && Array.isArray(candidate.options?.hastPlugins)
}

function isUnifiedProcessor(processor: unknown): processor is UnifiedMarkdownProcessor {
  if (typeof processor !== 'object' || processor === null) return false
  const candidate = processor as { name?: unknown; options?: { rehypePlugins?: unknown } }
  return candidate.name === 'unified' && Array.isArray(candidate.options?.rehypePlugins)
}

type MarkdownProcessor = NonNullable<AstroConfig['markdown']['processor']>

interface SatteriMarkdownProcessor {
  name: 'satteri'
  options: { hastPlugins: unknown[] }
}

interface UnifiedMarkdownProcessor {
  name: 'unified'
  options: { rehypePlugins: unknown[] }
}
