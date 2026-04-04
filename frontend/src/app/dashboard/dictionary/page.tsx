'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/auth-store'

interface Entry { id: string; term: string; translation: string; notes: string | null; createdAt: string }

export default function DictionaryPage() {
  const { user } = useAuthStore()
  const [items, setItems] = useState<Entry[]>([])
  const [total, setTotal] = useState(0)
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ term: '', translation: '', notes: '' })
  const [saving, setSaving] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (q) params.set('q', q)
      const { data } = await api.get(`/api/dictionary?${params}`)
      setItems(data.items)
      setTotal(data.total)
    } catch {} finally { setLoading(false) }
  }, [q])

  useEffect(() => { fetch() }, [fetch])

  async function save() {
    if (!form.term.trim() || !form.translation.trim()) return toast.error('Completa el término y la traducción')
    setSaving(true)
    try {
      await api.post('/api/dictionary', form)
      toast.success('Término guardado')
      setForm({ term: '', translation: '', notes: '' })
      setShowForm(false)
      fetch()
    } catch { toast.error('Error al guardar') }
    finally { setSaving(false) }
  }

  async function deleteEntry(id: string) {
    try {
      await api.delete(`/api/dictionary/${id}`)
      setItems(prev => prev.filter(i => i.id !== id))
      setTotal(t => t - 1)
    } catch { toast.error('Error al eliminar') }
  }

  if (user?.plan === 'free') {
    return (
      <div className="p-4 md:p-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="font-serif text-3xl mb-1">Diccionario personal</h1>
          <p className="text-sm text-white/40">Tus términos técnicos personalizados</p>
        </div>
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4 opacity-20">◉</div>
          <h2 className="font-serif text-2xl mb-3">Requiere plan PRO</h2>
          <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
            Crea tu propio diccionario de términos técnicos que la extensión usará automáticamente.
          </p>
          <Link href="/pricing" className="btn-primary text-sm px-6">Ver planes →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-8 animate-fadeup">
        <div>
          <h1 className="font-serif text-3xl mb-1">Diccionario personal</h1>
          <p className="text-sm text-white/40">{total} términos guardados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-4">
          {showForm ? '✕ Cancelar' : '+ Agregar término'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card p-5 mb-5 animate-fadeup">
          <h3 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-4">Nuevo término</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Término (original)</label>
              <input className="input text-sm" placeholder="machine learning"
                value={form.term} onChange={e => setForm({...form, term: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Traducción</label>
              <input className="input text-sm" placeholder="aprendizaje automático"
                value={form.translation} onChange={e => setForm({...form, translation: e.target.value})} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-white/40 mb-1.5">Notas (opcional)</label>
            <input className="input text-sm" placeholder="Contexto o aclaración..."
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <button onClick={save} disabled={saving} className="btn-primary text-sm px-5">
            {saving ? 'Guardando...' : 'Guardar término'}
          </button>
        </div>
      )}

      {/* Search */}
      <div className="mb-4 animate-fadeup delay-100">
        <input className="input text-sm" placeholder="Buscar términos..."
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_,i) => <div key={i} className="card h-14 opacity-20 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center animate-fadeup">
          <div className="text-3xl mb-3 opacity-20">◉</div>
          <p className="text-sm text-white/35">{q ? 'No se encontraron términos' : 'Tu diccionario está vacío'}</p>
          {!q && <p className="text-xs text-white/20 mt-1">Agrega términos técnicos de tus cursos</p>}
        </div>
      ) : (
        <div className="space-y-2 animate-fadeup delay-100">
          {items.map(item => (
            <div key={item.id} className="card p-4 group flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-medium text-indigo">{item.term}</span>
                  <span className="text-white/20 text-xs">→</span>
                  <span className="text-sm font-medium truncate">{item.translation}</span>
                </div>
                {item.notes && <div className="text-xs text-white/35 mt-1 truncate">{item.notes}</div>}
              </div>
              <button
                onClick={() => deleteEntry(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-rose text-xs flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
