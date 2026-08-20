import { readFileSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'

const STORE_PATH = join(homedir(), '.my-kb', 'items.json')
const OSPIPE_URL = 'http://localhost:3030/v2/ingest'

interface KBItem {
  id: string
  title: string
  content: string
  source?: string
  tags?: string[]
}

const items: KBItem[] = JSON.parse(readFileSync(STORE_PATH, 'utf-8'))
console.log(`Backfilling ${items.length} items into OSpipe…`)

async function main() {
  let ok = 0
  let fail = 0
  for (const item of items) {
    const res = await fetch(OSPIPE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: item.title, content: item.content, source: item.source, tags: item.tags }),
    })
    if (res.ok) {
      ok++
      console.log(`  ✓ ${item.title}`)
    } else {
      fail++
      console.warn(`  ✗ ${item.title} — ${res.status} ${await res.text()}`)
    }
  }
  console.log(`\nDone: ${ok} ingested, ${fail} failed`)
}

main()
