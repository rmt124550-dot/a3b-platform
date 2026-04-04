import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — A3B Narrator',
  description: 'Guías y consejos para estudiar en plataformas de aprendizaje online en español.',
}

const POSTS = [
  {
    slug:    'coursera-en-espanol',
    title:   'Cómo estudiar en Coursera en español (sin perder el tiempo con subtítulos)',
    excerpt: 'Coursera tiene más de 7,000 cursos en inglés. Si no dominas el idioma, te pierdes el 95% del contenido. Aquí te explicamos cómo narrarlo todo en español en tiempo real.',
    date:    '2026-04-04',
    readTime: '5 min',
    tags:    ['Coursera', 'español', 'extensión Chrome'],
    cover:   '🎓',
  },
  {
    slug:    'mejores-extensiones-aprender-ingles',
    title:   'Las mejores extensiones de Chrome para aprender inglés en 2026',
    excerpt: 'Comparamos las herramientas más populares para aprender mientras estudias online: desde traductores hasta narradores de subtítulos. Cuál vale la pena y cuál no.',
    date:    '2026-04-04',
    readTime: '7 min',
    tags:    ['extensiones Chrome', 'aprender inglés', 'herramientas'],
    cover:   '🔧',
  },
  {
    slug:    'coursera-gratis-certificado',
    title:   'Cómo obtener certificados de Coursera gratis en 2026 (guía completa)',
    excerpt: 'Coursera ofrece auditoría gratuita en cientos de cursos. Te explicamos cómo acceder, qué plataformas usar y cómo narrar el contenido en español para aprender más rápido.',
    date:    '2026-04-04',
    readTime: '6 min',
    tags:    ['Coursera', 'certificados', 'gratis'],
    cover:   '🏆',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-surface grain px-6 py-16 max-w-3xl mx-auto">
      <Link href="/" className="text-white/30 hover:text-white/60 text-sm mb-8 block">← Volver al inicio</Link>

      <div className="mb-12">
        <h1 className="text-4xl font-black mb-3">Blog</h1>
        <p className="text-white/40 text-sm">Guías para aprender más rápido en plataformas online.</p>
      </div>

      <div className="space-y-6">
        {POSTS.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="block bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all group">
            <div className="flex items-start gap-5">
              <div className="text-4xl flex-shrink-0">{post.cover}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white/25 text-xs">{post.date}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/25 text-xs">{post.readTime} lectura</span>
                </div>
                <h2 className="font-black text-base mb-2 group-hover:text-[#a5b4fc] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-white/45 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-white/5 border border-white/8 text-white/35 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
