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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] px-4">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <span className="serif text-2xl font-bold text-[#111827] block">Escuela de Música</span>
          <p className="mt-1 text-xs text-[#6B7280] tracking-wider uppercase">Sistema de administración y facturación</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <form onSubmit={manejarLogin} className="space-y-4">
          <div>
            <label className="field-label">Correo electrónico</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
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
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
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
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            ¿No tienes cuenta?{' '}
            <a href="/registro" className="text-[#7C3AED] hover:text-[#6D28D9] underline underline-offset-2">Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  )
}
