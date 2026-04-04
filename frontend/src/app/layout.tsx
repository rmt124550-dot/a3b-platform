import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'A3B Narrator — Aprende en Coursera en Español',
  description: 'Extensión gratuita de Chrome que traduce y narra los subtítulos de Coursera en español en tiempo real. Compatible con YouTube, Udemy, edX y LinkedIn Learning.',
}],
  metadataBase: new URL('https://a3bhub.cloud'),
  openGraph: {
    type: 'website', locale: 'es_ES', url: 'https://a3bhub.cloud',
    siteName: 'A3B Narrator',
    title: 'A3B Narrator — Aprende en Coursera en Español',
    description: 'Extensión gratuita para aprender en Coursera en español.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'A3B Narrator' }],
  },
  twitter: { card: 'summary_large_image', title: 'A3B Narrator', images: ['/og-image.png'] },
  alternates: { canonical: 'https://a3bhub.cloud' },
},

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.svg" />
        <meta name="theme-color" content="#080810" />
      </head>
      <body className="bg-surface text-white antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161620',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#161620' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#161620' } },
          }}
        />
      </body>
    </html>
  )
}
