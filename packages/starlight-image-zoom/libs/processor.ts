import type { AstroConfig } from 'astro'
import rehypeRaw from 'rehype-raw'

import { throwPluginError } from './error'
import { rehypeMetaString, rehypeStarlightImageZoom } from './rehype'
import { satteriPreserveCodeMetadata, satteriRestoreCodeMetadata, satteriStarlightImageZoom } from './satteri'

export function applyMarkdownPlugin(processor: MarkdownProcessor) {
  if (isSatteriProcessor(processor)) {
    processor.options.features.rawHtml = true
    processor.options.mdastPlugins.push(satteriPreserveCodeMetadata())
    processor.options.hastPlugins.unshift(satteriRestoreCodeMetadata())
    processor.options.hastPlugins.push(satteriStarlightImageZoom())
  } else if (isUnifiedProcessor(processor)) {
    processor.options.rehypePlugins.push(rehypeMetaString, rehypeRaw, rehypeStarlightImageZoom)
  } else {
    throwPluginError("The configured 'markdown.processor' is not supported by the starlight-image-zoom plugin.")
  }
}

function isSatteriProcessor(processor: unknown): processor is SatteriMarkdownProcessor {
  if (typeof processor !== 'object' || processor === null) return false
  const candidate = processor as { name?: unknown; options?: { hastPlugins?: unknown; mdastPlugins?: unknown } }
  return (
    candidate.name === 'satteri' &&
    Array.isArray(candidate.options?.hastPlugins) &&
    Array.isArray(candidate.options.mdastPlugins)
  )
}

function isUnifiedProcessor(processor: unknown): processor is UnifiedMarkdownProcessor {
  if (typeof processor !== 'object' || processor === null) return false
  const candidate = processor as { name?: unknown; options?: { rehypePlugins?: unknown } }
  return candidate.name === 'unified' && Array.isArray(candidate.options?.rehypePlugins)
}

type MarkdownProcessor = NonNullable<AstroConfig['markdown']['processor']>

interface SatteriMarkdownProcessor {
  name: 'satteri'
  options: {
    features: { rawHtml?: boolean }
    hastPlugins: unknown[]
    mdastPlugins: unknown[]
  }
}

interface UnifiedMarkdownProcessor {
  name: 'unified'
  options: { rehypePlugins: unknown[] }
}
