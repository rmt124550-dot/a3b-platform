'use client'
import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'

interface HistoryItem {
  id: string; original: string; translated: string
  platform: string; voiceUsed: string|null; createdAt: string
}

const PLATFORM_ICONS: Record<string,string> = {
  coursera:'🎓', youtube:'▶️', udemy:'📚',
  edx:'🏛️', linkedin:'💼', datacamp:'📊', 'khan-academy':'🌿',
}

export default function HistoryPage() {
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
        limit: String(PER_PAGE), offset: String((p-1)*PER_PAGE),
        ...(q ? { q } : {}),
      })
      const { data } = await api.get(`/api/history?${params}`)
      setItems(data.history ?? [])
      setTotal(data.total ?? 0)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { load('', 1) }, [load])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault(); setPage(1); load(search, 1)
  }

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-black">Historial de frases</h1>
        <span className="text-white/30 text-xs">{total} frases</span>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-5 sm:mb-6">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar en original o traducción..."
          className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#6366f1]/50"
        />
        <button type="submit"
          className="bg-[#6366f1] text-white font-bold px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm flex-shrink-0">
          🔍
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); setPage(1); load('', 1) }}
            className="border border-white/12 text-white/50 px-3 sm:px-4 py-2.5 rounded-xl hover:border-white/25 transition-all text-sm flex-shrink-0">
            ✕
          </button>
        )}
      </form>

      {/* Lista */}
      {loading ? (
        <div className="text-white/30 text-sm py-8 text-center">Cargando historial...</div>
      ) : items.length === 0 ? (
        <div className="bg-white/3 border border-white/8 rounded-2xl px-6 py-12 text-center">
          <div className="text-3xl sm:text-4xl mb-3">📭</div>
          <p className="text-white/40 text-sm">
            {search ? 'Sin resultados.' : 'Aún no hay frases. Activa el narrador en un video.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 mb-5 sm:mb-6">
          {items.map(item => (
            <div key={item.id} className="bg-white/3 border border-white/8 rounded-xl p-3 sm:p-4 hover:border-white/12 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{item.original}</p>
                  <p className="text-[#a5b4fc] text-sm leading-relaxed mt-1 line-clamp-2">{item.translated}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-lg sm:text-xl">{PLATFORM_ICONS[item.platform] ?? '📺'}</span>
                  <p className="text-white/25 text-[10px] mt-1">
                    {new Date(item.createdAt).toLocaleDateString('es', { month:'short', day:'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button onClick={() => { setPage(p => p-1); load(search, page-1) }}
            disabled={page===1}
            className="px-3 sm:px-4 py-2 border border-white/10 rounded-lg text-sm text-white/50 hover:border-white/25 disabled:opacity-30">
            ← Ant.
          </button>
          <span className="text-white/30 text-sm">{page} / {totalPages}</span>
          <button onClick={() => { setPage(p => p+1); load(search, page+1) }}
            disabled={page===totalPages}
            className="px-3 sm:px-4 py-2 border border-white/10 rounded-lg text-sm text-white/50 hover:border-white/25 disabled:opacity-30">
            Sig. →
          </button>
        </div>
      )}
    </div>
  )
}
