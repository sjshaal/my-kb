import type { IngestPayload, OSpipeSearchResult } from './types.js'

const BASE = 'http://localhost:3030'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('OSpipe request timed out')), ms)
    ),
  ])
}

export async function ospipeIngest(payload: IngestPayload): Promise<void> {
  const res = await withTimeout(
    fetch(`${BASE}/v2/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: payload.title, content: payload.content, source: payload.source }),
    }),
    10_000
  )
  if (!res.ok) throw new Error(`OSpipe ingest failed: ${res.status} ${await res.text()}`)
}

export async function ospipeSearch(query: string): Promise<OSpipeSearchResult[]> {
  const res = await withTimeout(
    fetch(`${BASE}/v2/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, k: 10 }),
    }),
    10_000
  )
  if (!res.ok) throw new Error(`OSpipe search failed: ${res.status}`)
  const data = (await res.json()) as Array<{ id: string; score: number; content: string; source: string; metadata: Record<string, unknown> }>
  return data.map(r => ({
    title: (r.metadata['window_title'] as string | undefined) ?? r.source,
    content: r.content,
    source: r.source,
    score: r.score,
  }))
}

export async function ospipeHealth(): Promise<boolean> {
  try {
    const res = await withTimeout(fetch(`${BASE}/v2/health`), 3_000)
    return res.ok
  } catch {
    return false
  }
}
