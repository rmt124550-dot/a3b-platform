import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'A3B Narrator — Aprende en Coursera en Español | Extensión Chrome',
  description: 'Extensión gratuita de Chrome que traduce y narra en voz alta los subtítulos de Coursera en español. Sin API keys. Compatible con YouTube, Udemy, edX y LinkedIn Learning (PRO).',
  keywords: [
    'coursera en español', 'extensión chrome coursera', 'traductor subtítulos',
    'narrador coursera', 'aprender inglés coursera', 'a3b narrator',
    'subtítulos español automático', 'coursera traducción automática',
  ],
  authors: [{ name: 'A3B Cloud', url: 'https://a3bhub.cloud' }],
  creator: 'A3B Cloud',
  metadataBase: new URL('https://a3bhub.cloud'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://a3bhub.cloud',
    siteName: 'A3B Narrator',
    title: 'A3B Narrator — Aprende en Coursera en Español',
    description: 'Extensión gratuita de Chrome que traduce y narra subtítulos de Coursera en español en tiempo real. 7 días PRO gratis.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'A3B Narrator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A3B Narrator — Coursera en Español',
    description: 'Narra los subtítulos de Coursera en español automáticamente. Gratis.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: 'https://a3bhub.cloud' },
},
  description: 'Extensión que traduce y narra subtítulos de Coursera, YouTube, Udemy, edX y LinkedIn en español. Gratis en Coursera. Prueba PRO 7 días gratis.',
  keywords: ['subtítulos', 'narración', 'Coursera', 'YouTube', 'Udemy', 'español', 'extensión Chrome'],
  authors: [{ name: 'A3B Cloud', url: 'https://a3bhub.cloud' }],
  creator: 'A3B Cloud',
  metadataBase: new URL('https://a3bhub.cloud'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://a3bhub.cloud',
    siteName: 'A3B Narrator',
    title: 'A3B Narrator — Aprende en tu idioma',
    description: 'Traduce y narra subtítulos de Coursera, YouTube, Udemy y más en tiempo real. Gratis en Coursera.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'A3B Narrator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A3B Narrator — Aprende en tu idioma',
    description: 'Traduce y narra subtítulos en tiempo real. Gratis en Coursera.',
    images: ['/og-image.svg'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
  },
  manifest: '/manifest.json',
}

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
