import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/alumnos', label: 'Alumnos', icon: '👨‍🎓' },
  { href: '/profesores', label: 'Profesores', icon: '🎓' },
  { href: '/horarios', label: 'Horarios', icon: '📅' },
  { href: '/pagos', label: 'Pagos', icon: '💳' },
  { href: '/asistencias', label: 'Asistencias', icon: '✅' },
  { href: '/reportes', label: 'Reportes', icon: '📊' },
]

export default function Sidebar() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  return (
    <aside className="hidden lg:flex lg:w-64 flex-col border-r border-[#CBD5E1] bg-white h-screen sticky top-0">
      <div className="p-6 border-b border-[#CBD5E1]">
        <div className="flex items-center gap-2">
          <span className="serif text-xl font-semibold tracking-tight">Escuela</span>
          <span className="text-xs font-medium text-[#64748B] tracking-wider uppercase">de Música</span>
        </div>
        <p className="mt-2 text-xs text-[#64748B] leading-relaxed">Sistema de administración y facturación.</p>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
              path === item.href
                ? 'bg-[#D97706] text-white'
                : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
