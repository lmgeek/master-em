'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Credenciales inválidas')
        setCargando(false)
        return
      }

      router.push('/')
    } catch {
      setError('Error de conexión al servidor')
      setCargando(false)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-body px-4">
      <div className="bg-surface border border-line rounded-[2rem] shadow-lg w-full max-w-md p-8 sm:p-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-soft text-accent-text font-semibold mb-3 mx-auto">
            🎵
          </div>
          <span className="text-xl font-bold tracking-tight text-ink block">Escuela de Música</span>
          <p className="mt-1 text-xs text-muted tracking-wider uppercase">Sistema de administración y facturación</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-danger-soft border border-line text-danger text-sm flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={manejarLogin} className="space-y-4">
          <div>
            <label className="field-label">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                className="input-field pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@escuela.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                className="input-field pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="btn-primary w-full"
          >
            {cargando ? 'Ingresando…' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm text-muted mt-6">
            ¿No tienes cuenta?{' '}
            <a href="/registro" className="text-accent hover:text-accent-text underline underline-offset-2">Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  )
}
