import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: { default: 'A3B Narrator', template: '%s — A3B Narrator' },
  description: 'Traduce y narra los subtítulos de Coursera en español, en tiempo real.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
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
