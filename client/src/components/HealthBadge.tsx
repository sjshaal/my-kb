import { useEffect, useState } from 'react'
import { getHealth } from '../api'

type Status = 'loading' | 'ok' | 'down'

export default function HealthBadge() {
  const [status, setStatus] = useState<Status>('loading')

  const check = () =>
    getHealth()
      .then(h => setStatus(h.ospipe ? 'ok' : 'down'))
      .catch(() => setStatus('down'))

  useEffect(() => {
    check()
    const id = setInterval(check, 15_000)
    return () => clearInterval(id)
  }, [])

  const dot: Record<Status, string> = {
    loading: 'bg-yellow-400',
    ok: 'bg-green-400',
    down: 'bg-red-400',
  }

  const label: Record<Status, string> = {
    loading: 'Checking…',
    ok: 'OSpipe connected',
    down: 'OSpipe offline',
  }

  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      <span className={`w-2 h-2 rounded-full ${dot[status]}`} />
      {label[status]}
    </span>
  )
}
