import type { KBItem } from './types'

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText })) as { error?: string }
    throw new Error(err.error ?? res.statusText)
  }
  return res.json() as Promise<T>
}

export async function getFeed(): Promise<KBItem[]> {
  return handle(await fetch('/api/search'))
}

export async function search(q: string): Promise<KBItem[]> {
  return handle(await fetch(`/api/search?q=${encodeURIComponent(q)}`))
}

export async function ingestWeb(url: string): Promise<{ item: KBItem }> {
  return handle(
    await fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'web', url }),
    })
  )
}

export async function ingestNote(title: string, text: string): Promise<{ item: KBItem }> {
  return handle(
    await fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'note', title, text }),
    })
  )
}

export async function getHealth(): Promise<{ ok: boolean; ospipe: boolean }> {
  return handle(await fetch('/api/health'))
}
