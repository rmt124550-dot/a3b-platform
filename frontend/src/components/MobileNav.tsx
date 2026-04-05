'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { href:'#platforms', label:'Plataformas', isAnchor: true },
  { href:'#demo',      label:'Demo',        isAnchor: true },
  { href:'/pricing',   label:'Precios',     isAnchor: false },
  { href:'/affiliates',label:'Afiliados',   isAnchor: false },
  { href:'/blog',      label:'Blog',        isAnchor: false },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  // Cerrar menú al presionar Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    // Bloquear scroll del body cuando el menú está abierto
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Botón hamburguesa — solo visible en mobile */}
      <button
        onClick={() => setOpen(o => !o)}
        className="md:hidden flex items-center justify-center w-10 h-10 -mr-1
                   rounded-xl text-white/50 hover:text-white hover:bg-white/6
                   transition-all active:bg-white/10"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
        </svg>
      </button>

      {/* ── Overlay oscuro — cierra el menú al tocar fuera ─── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Dropdown — fixed justo debajo del nav (top-14) ─── */}
      {open && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-50
                        bg-[#080810] border-b border-white/8
                        shadow-2xl shadow-black/50">

          {/* Links de navegación */}
          <div className="px-3 py-3 space-y-0.5">
            {NAV_LINKS.map(item =>
              item.isAnchor ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3.5 rounded-xl
                             text-white/65 hover:text-white hover:bg-white/6
                             active:bg-white/10 transition-all text-sm font-medium">
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3.5 rounded-xl
                             text-white/65 hover:text-white hover:bg-white/6
                             active:bg-white/10 transition-all text-sm font-medium">
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Separador + botones auth */}
          <div className="px-3 pb-4 pt-1 border-t border-white/6 space-y-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl
                         border border-white/10 text-white/60 hover:text-white
                         hover:border-white/25 active:bg-white/5
                         transition-all text-sm font-medium">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full px-4 py-3.5 rounded-xl
                         bg-[#6366f1] hover:bg-[#5558e8] active:bg-[#4a4dd4]
                         text-white font-bold transition-all text-sm">
              🎁 Empezar 36 días gratis
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
