export type ContentType = 'web' | 'youtube' | 'file' | 'note'

export interface KBItem {
  id: string
  title: string
  content: string
  source?: string
  tags?: string[]
  type: ContentType
  createdAt: string
  score?: number
}

export type View = 'feed' | 'add'
