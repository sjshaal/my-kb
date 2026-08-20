import type { KBItem } from '../types'
import ResultCard from './ResultCard'

interface Props {
  items: KBItem[]
  loading?: boolean
  emptyMessage?: string
}

export default function ResultFeed({ items, loading, emptyMessage = 'Nothing here yet.' }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-3" />
            <div className="h-3 bg-gray-700 rounded w-full mb-1.5" />
            <div className="h-3 bg-gray-700 rounded w-5/6" />
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-5xl mb-4">🧠</div>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map(item => (
        <ResultCard key={item.id ?? `${item.source}-${item.createdAt}`} item={item} />
      ))}
    </div>
  )
}
