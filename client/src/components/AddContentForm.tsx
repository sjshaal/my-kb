import { useState } from 'react'
import { ingestNote, ingestWeb } from '../api'

type Tab = 'url' | 'note'
type Status = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  onAdded: () => void
}

export default function AddContentForm({ onAdded }: Props) {
  const [tab, setTab] = useState<Tab>('url')
  const [url, setUrl] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [noteText, setNoteText] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const reset = () => {
    setUrl('')
    setNoteTitle('')
    setNoteText('')
    setStatus('idle')
    setErrorMsg('')
  }

  const canSubmit =
    status !== 'loading' &&
    ((tab === 'url' && url.trim().startsWith('http')) ||
      (tab === 'note' && noteTitle.trim() && noteText.trim()))

  const submit = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      if (tab === 'url') {
        await ingestWeb(url.trim())
      } else {
        await ingestNote(noteTitle.trim(), noteText.trim())
      }
      setStatus('success')
      setTimeout(() => {
        reset()
        onAdded()
      }, 1200)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong')
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-white font-semibold text-lg mb-5">Add to your knowledge base</h2>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-lg p-1 mb-6 w-fit">
        {(['url', 'note'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); reset() }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              tab === t ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t === 'url' ? 'Web URL' : 'Note'}
          </button>
        ))}
      </div>

      {tab === 'url' && (
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Article or page URL</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canSubmit && submit()}
            placeholder="https://…"
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            The article text will be extracted and stored locally.
          </p>
        </div>
      )}

      {tab === 'note' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Title</label>
            <input
              type="text"
              value={noteTitle}
              onChange={e => setNoteTitle(e.target.value)}
              placeholder="What's this about?"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Content</label>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={6}
              placeholder="Paste text, write a summary, capture ideas…"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="text-sm">
          {status === 'error' && <p className="text-red-400">{errorMsg}</p>}
          {status === 'success' && <p className="text-green-400">Added to your knowledge base!</p>}
          {status === 'loading' && (
            <p className="text-indigo-400">
              {tab === 'url' ? 'Fetching and extracting article…' : 'Saving note…'}
            </p>
          )}
        </div>
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          {status === 'loading' ? 'Adding…' : 'Add'}
        </button>
      </div>
    </div>
  )
}
