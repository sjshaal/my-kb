import type { KBItem } from '../types'

const TYPE_STYLE: Record<string, string> = {
  web: 'bg-blue-900 text-blue-200',
  youtube: 'bg-red-900 text-red-200',
  file: 'bg-purple-900 text-purple-200',
  note: 'bg-green-900 text-green-200',
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ResultCard({ item }: { item: KBItem }) {
  const snippet = item.content.replace(/\s+/g, ' ').trim().slice(0, 220)
  const badge = TYPE_STYLE[item.type] ?? 'bg-gray-700 text-gray-300'

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-colors flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 flex-1">
          {item.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
            {item.type}
          </span>
          {item.score !== undefined && (
            <span className="text-xs text-gray-500">{Math.round(item.score * 100)}%</span>
          )}
        </div>
      </div>

      <p className="text-gray-400 text-xs leading-relaxed">
        {snippet}{snippet.length >= 220 ? '…' : ''}
      </p>

      <div className="flex items-center justify-between mt-auto pt-1">
        <div className="flex gap-1 flex-wrap">
          {item.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-600 shrink-0">{timeAgo(item.createdAt)}</span>
      </div>

      {item.source?.startsWith('http') && (
        <a href={item.source} target="_blank" rel="noopener noreferrer"
          className="text-xs text-indigo-400 hover:text-indigo-300 truncate">
          {item.source}
        </a>
      )}
    </div>
  )
}
