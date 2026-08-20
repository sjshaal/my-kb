import type { IngestPayload } from '../types.js'

interface NoteInput {
  title: string
  text: string
  tags?: string[]
}

export function ingestNote(input: NoteInput): IngestPayload {
  return {
    title: input.title,
    content: input.text,
    source: 'note',
    tags: ['note', ...(input.tags ?? [])],
  }
}
