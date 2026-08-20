import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'
import type { KBItem, IngestPayload, ContentType } from './types.js'

const STORE_DIR = join(homedir(), '.my-kb')
const STORE_PATH = join(STORE_DIR, 'items.json')

function load(): KBItem[] {
  try {
    return JSON.parse(readFileSync(STORE_PATH, 'utf-8')) as KBItem[]
  } catch {
    return []
  }
}

function save(items: KBItem[]): void {
  mkdirSync(STORE_DIR, { recursive: true })
  writeFileSync(STORE_PATH, JSON.stringify(items, null, 2))
}

export function addItem(payload: IngestPayload, type: ContentType): KBItem {
  const items = load()
  const item: KBItem = {
    id: randomUUID(),
    ...payload,
    type,
    createdAt: new Date().toISOString(),
  }
  items.unshift(item)
  save(items)
  return item
}

export function getAllItems(): KBItem[] {
  return load()
}

export function searchItems(query: string): KBItem[] {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  if (words.length === 0) return []
  return load().filter(item => {
    const haystack = [item.title, item.content, ...(item.tags ?? [])].join(' ').toLowerCase()
    return words.some(w => haystack.includes(w))
  })
}
