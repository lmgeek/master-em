'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

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
    <header className="lg:ml-56 border-b border-[#22632340] bg-white sticky top-0 z-20">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">
            Escuela de Música
          </span>
        </div>

        {usuario ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-[#111827]">{usuario.nombre}</span>
              <span className="text-[11px] text-[#94A3B8]">{usuario.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors px-2 py-1.5 rounded-md hover:bg-[#FEF2F2]"
            >
              <LogOut size={14} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7C3AED] text-white rounded-md text-sm font-medium hover:bg-[#6D28D9] transition-colors"
          >
            <span>Iniciar sesión</span>
          </a>
        )}
      </div>
    </header>
  )
}
