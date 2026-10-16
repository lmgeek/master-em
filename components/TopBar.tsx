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
    <header className="lg:ml-64 border-b border-[#CBD5E1] bg-white sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {usuario ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-[#0F172A]">{usuario.nombre}</span>
              <span className="text-xs text-[#64748B]">{usuario.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] transition-colors"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-[#D97706] text-white rounded-lg text-sm font-medium hover:bg-[#B45309] transition-colors"
          >
            Iniciar sesión
          </a>
        )}
      </div>
    </header>
  )
}
