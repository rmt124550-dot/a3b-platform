'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

interface HistoryItem {
  id: string; originalText: string; translatedText: string
  sourceLang: string; targetLang: string
  platform: string; createdAt: string
}

const PLATFORMS = ['all', 'coursera', 'youtube', 'udemy', 'edx', 'linkedin']

export default function HistoryPage() {
  const { user } = useAuthStore()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [platform, setPlatform] = useState('all')
  const [page, setPage] = useState(1)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '30' })
      if (q) params.set('q', q)
      if (platform !== 'all') params.set('platform', platform)
      const { data } = await api.get(`/api/history?${params}`)
      setItems(data.items)
      setTotal(data.total)
    } catch (err: any) {
      if (err.response?.status === 403) return // plan guard handled by UI
      toast.error('Error al cargar el historial')
    } finally { setLoading(false) }
  }, [q, platform, page])

  useEffect(() => { fetch() }, [fetch])

  async function deleteItem(id: string) {
    try {
      await api.delete(`/api/history/${id}`)
      setItems((prev) => prev.filter((i) => i.id !== id))
      setTotal((t) => t - 1)
      toast.success('Eliminado')
    } catch { toast.error('Error al eliminar') }
  }

  async function exportSRT() {
    try {
      const { data } = await api.get('/api/history/export/srt', { responseType: 'blob' })
      const url = URL.createObjectURL(data)
      const a = document.createElement('a'); a.href = url; a.download = 'subtitles.srt'; a.click()
    } catch { toast.error('Exportación requiere plan Team') }
  }

  const fmt = (iso: string) => new Date(iso).toLocaleDateString('es', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (user?.plan === 'free') {
    return (
      <div className="p-4 md:p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl mb-1">Historial</h1>
          <p className="text-sm text-white/40">Tus traducciones guardadas</p>
        </div>
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4 opacity-20">◷</div>
          <h2 className="font-serif text-2xl mb-3">Requiere plan PRO</h2>
          <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
            El historial de traducciones está disponible en el plan PRO y superiores.
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-6">Ver planes →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4 mb-8 animate-fadeup">
        <div>
          <h1 className="font-serif text-3xl mb-1">Historial</h1>
          <p className="text-sm text-white/40">{total} traducciones guardadas</p>
        </div>
        <div className="flex gap-2">
          {user?.plan === 'team' && (
            <button onClick={exportSRT} className="btn-ghost text-xs px-4">↓ Exportar SRT</button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fadeup delay-100">
        <input
          className="input flex-1 text-sm"
          placeholder="Buscar traducciones..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1) }}
        />
        <div className="flex gap-2 overflow-x-auto">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => { setPlatform(p); setPage(1) }}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                platform === p ? 'bg-indigo/20 text-indigo' : 'bg-s2 text-white/40 hover:text-white/70'
              }`}
            >
              {p === 'all' ? 'Todos' : p}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2 animate-fadeup">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-4 h-16 opacity-30 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center animate-fadeup">
          <div className="text-3xl mb-3 opacity-20">◷</div>
          <p className="text-sm text-white/35">No hay traducciones guardadas</p>
          <p className="text-xs text-white/20 mt-1">Las traducciones se guardan automáticamente mientras usas la extensión</p>
        </div>
      ) : (
        <div className="space-y-2 animate-fadeup delay-100">
          {items.map((item) => (
            <div key={item.id} className="card p-4 group hover:border-white/15 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/30 font-mono mb-1.5 flex items-center gap-2">
                    <span>{item.sourceLang.toUpperCase()} → {item.targetLang.toUpperCase()}</span>
                    <span>·</span>
                    <span className="capitalize">{item.platform}</span>
                    <span>·</span>
                    <span>{fmt(item.createdAt)}</span>
                  </div>
                  <div className="text-sm text-white/60 truncate">{item.originalText}</div>
                  <div className="text-sm font-medium truncate mt-0.5">{item.translatedText}</div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-rose text-xs px-2 py-1 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {total > 30 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-ghost text-xs px-4">← Anterior</button>
              <span className="text-xs text-white/35 font-mono">Pág {page} de {Math.ceil(total/30)}</span>
              <button onClick={() => setPage(p => p+1)} disabled={page >= Math.ceil(total/30)} className="btn-ghost text-xs px-4">Siguiente →</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
