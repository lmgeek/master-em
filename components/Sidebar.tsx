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
    <aside className="hidden lg:flex lg:w-56 flex-col border-r border-[#22632340] bg-white h-[calc(100vh-0px)] sticky top-0 z-20">
      <div className="p-5 border-b border-[#22632340]">
        <div className="flex items-center gap-2">
          <span className="serif text-xl font-semibold tracking-tight">Escuela</span>
          <span className="text-[10px] font-medium text-[#64748B] tracking-wider uppercase">de Música</span>
        </div>
        <p className="mt-2 text-[11px] text-[#94A3B8] leading-relaxed">Sistema de administración y facturación.</p>
      </div>

      <nav className="p-2 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all ${
              path === item.href
                ? 'bg-[#7C3AED]/10 text-[#7C3AED] font-medium border-r-2 border-[#7C3AED]'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111827]'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-[#22632340]">
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-[#64748B] bg-[#F8FAFC] rounded-lg">
          <span>📚</span>
          <span>v1.0</span>
        </div>
      </div>
    </aside>
  )
}
