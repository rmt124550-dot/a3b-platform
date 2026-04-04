import { Suspense } from 'react'
import VerifyEmailContent from './VerifyEmailContent'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#080810] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-white/40 text-sm">Verificando...</p>
        </div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
