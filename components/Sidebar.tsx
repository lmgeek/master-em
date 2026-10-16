'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  Layout,
  User,
  Calendar,
  CreditCard,
  CheckCheck,
  BarChart3,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'Inicio', icon: <Layout size={18} /> },
  { href: '/alumnos', label: 'Alumnos', icon: <User size={18} /> },
  { href: '/profesores', label: 'Profesores', icon: <User size={18} /> },
  { href: '/horarios', label: 'Horarios', icon: <Calendar size={18} /> },
  { href: '/pagos', label: 'Pagos', icon: <CreditCard size={18} /> },
  { href: '/asistencias', label: 'Asistencias', icon: <CheckCheck size={18} /> },
  { href: '/reportes', label: 'Reportes', icon: <BarChart3 size={18} /> },
]

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  useEffect(() => {
    if (mobileOpen) setMobileOpen(false)
  }, [path])

  const handleOverlayClick = () => setMobileOpen(false)

  return (
    <>
      {/* Drawer móvil */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm lg:hidden"
            onClick={handleOverlayClick}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-line shadow-lg flex flex-col transform transition-transform duration-300 lg:hidden"
            style={{ transform: 'translateX(0)' }}
          >
            <div className="p-5 border-b border-line-soft flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-ink">Escuela</span>
                <span className="text-[10px] font-medium text-muted tracking-wider uppercase">de Música</span>
              </div>
              <button onClick={handleOverlayClick} className="p-2 text-muted hover:text-ink rounded-lg hover:bg-surface-hover transition-colors">
                <X size={20} />
              </button>
            </div>
            <nav className="p-2 space-y-0.5 flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleOverlayClick}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                    path === item.href
                      ? 'bg-accent-soft text-accent-text font-medium'
                      : 'text-muted hover:bg-surface-hover hover:text-ink'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto p-4 border-t border-line-soft">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted bg-surface-hover rounded-lg">
                <span>📚</span>
                <span>v1.0</span>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-line bg-surface h-full sticky top-0 z-20 shadow-sm">
        <div className="p-5 border-b border-line-soft">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-ink">Escuela</span>
            <span className="text-[10px] font-medium text-muted tracking-wider uppercase">de Música</span>
          </div>
          <p className="mt-2 text-[11px] text-muted leading-relaxed">Sistema de administración y facturación.</p>
        </div>

        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all ${
                path === item.href
                  ? 'bg-accent-soft text-accent-text font-medium'
                  : 'text-muted hover:bg-surface-hover hover:text-ink'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-line-soft">
          <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted bg-surface-hover rounded-lg">
            <span>📚</span>
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      {/* Botón hamburguesa solo móvil */}
      <button
        className="lg:hidden p-2.5 text-muted hover:text-ink hover:bg-surface-hover rounded-lg transition-colors z-30 fixed top-4 left-4"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>
    </>
  )
}
