import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cómo obtener certificados de Coursera gratis en 2026 — A3B',
  description: 'Guía completa para auditar cursos de Coursera gratis, obtener ayuda financiera y narrar el contenido en español con A3B Narrator. Certifícate sin pagar.',
  keywords: ['coursera gratis','certificado coursera gratis','auditar coursera','ayuda financiera coursera'],
}

export default function ArticleCourseraGratis() {
  return (
    <main className="min-h-screen bg-[#080810] text-white px-4 sm:px-6 py-12 sm:py-16 max-w-2xl mx-auto">
      <Link href="/blog" className="text-white/30 hover:text-white/60 text-sm mb-8 block">← Blog</Link>

      <div className="mb-8">
        <div className="text-5xl mb-4">🏆</div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-white/30 text-sm">4 abril 2026</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-sm">6 min lectura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-4 leading-tight">
          Cómo obtener certificados de Coursera gratis en 2026 (guía completa)
        </h1>
        <p className="text-white/50 text-sm sm:text-base">
          Coursera tiene cientos de cursos que puedes auditar completamente gratis. 
          Te explicamos cómo acceder y cómo narrarlos en español para aprender más rápido.
        </p>
      </div>

      <div className="space-y-6 text-white/70 text-sm leading-relaxed">
        <h2 className="text-lg sm:text-xl font-black text-white">¿Qué es auditar un curso en Coursera?</h2>
        <p>
          Auditar significa acceder al contenido del curso — videos, lecturas y algunos ejercicios —
          de forma gratuita, sin pagar por el certificado. La mayoría de los cursos de universidades
          como Stanford, Michigan o Google permiten auditoría.
        </p>

        <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-5">
          <p className="font-bold text-emerald-400 mb-2">✅ Cómo auditar un curso gratis:</p>
          <ol className="space-y-2 text-white/65 text-sm">
            <li><strong className="text-white">1.</strong> Ve al curso en Coursera y haz clic en "Inscribirse"</li>
            <li><strong className="text-white">2.</strong> Cuando te pidan pago, busca "Auditar el curso" (enlace pequeño debajo)</li>
            <li><strong className="text-white">3.</strong> Accedes a todos los videos sin pagar</li>
          </ol>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white">Ayuda financiera — Certificado gratis</h2>
        <p>
          Si quieres el certificado oficial sin pagar, Coursera ofrece ayuda financiera.
          El proceso toma 15 días hábiles pero es aprobado frecuentemente para usuarios
          de Latinoamérica y España que demuestren necesidad económica.
        </p>
        <ol className="space-y-2 pl-4">
          {['Ve al curso → "Inscribirse" → "Solicitar ayuda financiera"',
            'Rellena el formulario (inglés, ~400 palabras sobre por qué necesitas el curso)',
            'Espera 15 días hábiles → aprobación por email',
            'Acceso completo con certificado incluido'].map((s,i) => (
            <li key={i}><strong className="text-white">{i+1}.</strong> {s}</li>
          ))}
        </ol>

        <h2 className="text-lg sm:text-xl font-black text-white">Cómo narrar los cursos en español con A3B</h2>
        <p>
          Una vez dentro del curso auditado, instala A3B Narrator y activa los subtítulos CC.
          La extensión traduce y narra cada subtítulo en tiempo real — puedes seguir
          cursos técnicos en inglés aunque tu nivel no sea avanzado.
        </p>

        <div className="bg-[#6366f1]/8 border border-[#6366f1]/20 rounded-xl p-5 text-center">
          <p className="font-bold text-white mb-1">Empieza con 36 días gratis</p>
          <p className="text-white/35 text-xs mb-4">Sin tarjeta · Coursera incluido en el trial</p>
          <Link href="/register"
            className="inline-block bg-[#6366f1] text-white font-black px-8 py-3 rounded-xl hover:bg-[#5558e8] transition-all text-sm">
            Instalar A3B Narrator →
          </Link>
        </div>
      </div>
    </main>
  )
}
