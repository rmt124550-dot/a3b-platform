'use client'
import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

interface HistoryItem {
  id: string; original: string; translated: string
  platform: string; voiceUsed: string | null; createdAt: string
}

const PLATFORM_ICONS: Record<string, string> = {
  coursera: '🎓', youtube: '▶️', udemy: '📚',
  edx: '🏛️', linkedin: '💼', datacamp: '📊', 'khan-academy': '🌿',
}

export default function HistoryPage() {
  const { user }  = useAuthStore()
  const [items,   setItems]   = useState<HistoryItem[]>([])
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const PER_PAGE = 20

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: String(PER_PAGE),
        offset: String((p - 1) * PER_PAGE),
        ...(q ? { q } : {}),
      })
      const { data } = await api.get(`/api/history?${params}`)
      setItems(data.history ?? [])
      setTotal(data.total ?? 0)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { load('', 1) }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    load(search, 1)
  }

  const totalPages = Math.ceil(total / PER_PAGE)
  const isPro = user?.plan === 'pro' || user?.plan === 'team'

  if (!isPro && !user?.trialExpired) {
    // Durante el trial puede usar historial
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-2xl font-black">Historial de frases</h1>
        <span className="text-white/30 text-xs">{total} frases guardadas</span>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en original o traducción..."
          className="input flex-1 text-sm py-2.5"
        />
        <button type="submit"
          className="bg-[#6366f1] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
          🔍
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); setPage(1); load('', 1) }}
            className="border border-white/12 text-white/50 px-4 py-2.5 rounded-xl hover:border-white/25 transition-all text-sm">
            ✕
          </button>
        )}
      </form>

      {/* Lista */}
      {loading ? (
        <div className="text-white/30 text-sm py-8 text-center">Cargando historial...</div>
      ) : items.length === 0 ? (
        <div className="bg-white/3 border border-white/8 rounded-2xl px-6 py-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-white/40 text-sm">
            {search ? 'No hay resultados para esa búsqueda.' : 'Aún no hay frases en el historial. Activa el narrador en cualquier video.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {items.map(item => (
            <div key={item.id} className="bg-white/3 border border-white/8 rounded-xl p-4 hover:border-white/12 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-sm leading-relaxed">{item.original}</p>
                  <p className="text-[#a5b4fc] text-sm leading-relaxed mt-1">{item.translated}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-lg">{PLATFORM_ICONS[item.platform] ?? '📺'}</span>
                  <p className="text-white/25 text-[10px] mt-1">
                    {new Date(item.createdAt).toLocaleDateString('es', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => { setPage(p => p-1); load(search, page-1) }}
            disabled={page === 1}
            className="px-4 py-2 border border-white/10 rounded-lg text-sm text-white/50 hover:border-white/25 disabled:opacity-30">
            ← Anterior
          </button>
          <span className="text-white/30 text-sm">{page} / {totalPages}</span>
          <button onClick={() => { setPage(p => p+1); load(search, page+1) }}
            disabled={page === totalPages}
            className="px-4 py-2 border border-white/10 rounded-lg text-sm text-white/50 hover:border-white/25 disabled:opacity-30">
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
