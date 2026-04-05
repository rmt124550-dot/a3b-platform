'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="md:hidden p-2 -mr-1 rounded-xl text-white/50 hover:text-white hover:bg-white/6 transition-all"
        aria-label="Abrir menú">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Dropdown mobile */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#080810]/98 backdrop-blur-xl border-b border-white/8 py-4 px-4 space-y-1 z-50">
          {[
            { href:'#platforms', label:'Plataformas' },
            { href:'#demo',      label:'Demo' },
            { href:'/pricing',   label:'Precios' },
            { href:'/affiliates',label:'Afiliados' },
            { href:'/blog',      label:'Blog' },
          ].map(item => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}
              className="flex items-center px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
              {item.label}
            </a>
          ))}
          <div className="border-t border-white/8 pt-3 mt-2 flex flex-col gap-2">
            <Link href="/login" onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-white/50 text-sm text-center hover:text-white hover:bg-white/5 transition-all">
              Iniciar sesión
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}
              className="bg-[#6366f1] text-white font-bold px-4 py-3 rounded-xl text-sm text-center hover:bg-[#5558e8] transition-all">
              🎁 Empezar gratis
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
