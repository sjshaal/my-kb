export type ContentType = 'web' | 'youtube' | 'file' | 'note'

export interface KBItem {
  id: string
  title: string
  content: string
  source?: string
  tags?: string[]
  type: ContentType
  createdAt: string
}

export interface IngestPayload {
  title: string
  content: string
  source?: string
  tags?: string[]
}

export interface IngestRequest {
  type: ContentType
  url?: string
  title?: string
  text?: string
  tags?: string[]
}

export interface OSpipeSearchResult {
  title?: string
  content?: string
  source?: string
  tags?: string[]
  score?: number
  [key: string]: unknown
}
