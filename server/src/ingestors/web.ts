import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import type { IngestPayload } from '../types.js'

export async function ingestWeb(url: string): Promise<IngestPayload> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; my-kb/1.0)' },
    signal: AbortSignal.timeout(15_000),
  })

  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`)

  const html = await res.text()
  const dom = new JSDOM(html, { url })
  const article = new Readability(dom.window.document).parse()

  if (!article) throw new Error('Could not extract article content — this URL may not be an article page')

  const tags = ['web', article.siteName].filter((t): t is string => Boolean(t))

  return {
    title: article.title || url,
    content: article.textContent.replace(/\s+/g, ' ').trim().slice(0, 50_000),
    source: url,
    tags,
  }
}
