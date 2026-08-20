import { useState, useEffect, useCallback } from 'react'
import type { KBItem, View } from './types'
import { getFeed, search } from './api'
import SearchBar from './components/SearchBar'
import ResultFeed from './components/ResultFeed'
import AddContentForm from './components/AddContentForm'
import HealthBadge from './components/HealthBadge'

export default function App() {
  const [view, setView] = useState<View>('feed')
  const [items, setItems] = useState<KBItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const loadFeed = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await getFeed())
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q)
    setLoading(true)
    try {
      setItems(q ? await search(q) : await getFeed())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (view === 'feed') loadFeed()
  }, [view, loadFeed])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-white tracking-tight">my-kb</span>
          <div className="flex gap-1">
            {(['feed', 'add'] as View[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  view === v ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {v === 'feed' ? 'Browse' : '+ Add'}
              </button>
            ))}
          </div>
        </div>
        <HealthBadge />
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {view === 'feed' && (
          <>
            <div className="mb-5">
              <SearchBar onSearch={handleSearch} loading={loading && query.length > 0} />
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {query
                ? `Results for "${query}"`
                : `${items.length} item${items.length !== 1 ? 's' : ''} in your knowledge base`}
            </p>
            <ResultFeed
              items={items}
              loading={loading}
              emptyMessage='Nothing added yet — go to "+ Add" to get started.'
            />
          </>
        )}

        {view === 'add' && (
          <AddContentForm
            onAdded={() => {
              setView('feed')
              loadFeed()
            }}
          />
        )}
      </main>
    </div>
  )
}
