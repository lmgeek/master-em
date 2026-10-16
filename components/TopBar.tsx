'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Bell } from 'lucide-react'

interface TopBarProps {
  usuario: { nombre: string; email: string } | null
}

export default function TopBar({ usuario }: TopBarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignorar errores de red; igual redirigimos
    }
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="lg:ml-64 border-b border-line bg-surface sticky top-0 z-20 shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-semibold text-muted tracking-wider uppercase">
            Escuela de Música
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 text-muted hover:text-ink hover:bg-surface-hover rounded-xl transition-colors hidden sm:flex"
            aria-label="Notificaciones"
          >
            <Bell size={18} />
          </button>

          {usuario ? (
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-sm font-medium text-ink">{usuario.nombre}</span>
              <span className="text-[11px] text-muted">{usuario.email}</span>
            </div>
          ) : null}

          {usuario ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-danger hover:text-danger rounded-xl hover:bg-danger-soft transition-colors"
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-hover transition-colors box-shadow-sm"
              style={{ boxShadow: '0 4px 14px rgba(139, 92, 246, 0.25)' }}
            >
              <span>Iniciar sesión</span>
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
