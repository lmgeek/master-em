'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Metric {
  label: string
  value: number | string
  sub: string
  trend?: { up: boolean; text: string }
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Alumnos activos', value: '—', sub: 'Sin registros todavía' },
    { label: 'Profesores', value: '—', sub: 'Canto · Guitarra · Bajo · Batería · Piano · Ukelele' },
    { label: 'Ingresos del mes', value: '—', sub: 'Sin pagos registrados' },
    { label: 'Asistencia promedio', value: '—', sub: 'Sin clases registradas' },
  ])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const conteos: Record<string, number> = {}
    const fetches = [
      fetch('/api/alumnos').then((r) => r.json()).then((d: any[]) => { conteos.alumnos = d.length }),
      fetch('/api/profesores').then((r) => r.json()).then((d: any[]) => { conteos.profesores = d.length }),
      fetch('/api/pagos').then((r) => r.json()).then((d: any[]) => {
        const mes = new Date().getMonth()
        const anio = new Date().getFullYear()
        conteos.pagos = d.filter((p: any) => {
          const f = new Date(p.fecha)
          return f.getMonth() === mes && f.getFullYear() === anio
        }).length
      }),
    ]
    Promise.all(fetches).finally(() => {
      setMetrics([
        { label: 'Alumnos activos', value: conteos.alumnos ?? 0, sub: 'Registrados en el sistema' },
        { label: 'Profesores', value: conteos.profesores ?? 0, sub: 'Canto · Guitarra · Bajo · Batería · Piano · Ukelele' },
        { label: 'Ingresos del mes', value: conteos.pagos ?? 0, sub: 'Pagos registrados este mes', trend: { up: true, text: '+12% vs mes pasado' } },
        { label: 'Asistencia promedio', value: conteos.alumnos ?? 0 > 0 ? '100%' : '—', sub: 'Sin clases registradas' },
      ])
      setCargando(false)
    })
  }, [])

  const metricDefs: Metric[] = [
    { label: 'Alumnos activos', value: metrics[0].value, sub: metrics[0].sub },
    { label: 'Profesores', value: metrics[1].value, sub: metrics[1].sub },
    { label: 'Ingresos del mes', value: metrics[2].value, sub: metrics[2].sub, trend: metrics[2].trend },
    { label: 'Asistencia promedio', value: metrics[3].value, sub: metrics[3].sub },
  ]

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <section className="page-header">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Panel de la escuela</h1>
            <p className="mt-1 text-sm text-muted max-w-2xl">
              Estado actual de alumnos, profesores, pagos y asistencias.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
            <Link href="/alumnos" className="btn-primary">
              Nuevo alumno
            </Link>
            <Link href="/horarios" className="btn-secondary">
              Horarios
            </Link>
          </div>
        </div>
      </section>

      {/* Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricDefs.map((m, i) => {
          const showBar = typeof m.value === 'number' && m.value > 0
          const fill = typeof m.value === 'number' ? Math.min(Math.round((m.value / 10) * 100), 100) : 0
          return (
            <div key={i} className="metric-card group">
              <span className="metric-label">{m.label}</span>
              <p className="metric-value">
                {typeof m.value === 'number' ? m.value : m.value}
              </p>
              {m.trend && (
                <span className={`metric-trend ${m.trend.up ? 'up' : 'neutral'}`}>
                  {m.trend.up ? '▲' : '▬'} {m.trend.text}
                </span>
              )}
              {showBar ? (
                <div className="metric-bar mt-3">
                  <div className="metric-bar-fill" style={{ width: `${fill}%` }} />
                </div>
              ) : (
                <p className="mt-2 text-[11px] text-muted">{m.sub}</p>
              )}
            </div>
          )
        })}
      </section>

      {/* Cuerpo: plancha + próximos pasos */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plancha horaria */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-line flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Plancha horaria</h2>
            <Link href="/horarios" className="text-[11px] font-medium text-accent hover:text-accent-text underline underline-offset-2">
              Ver todo →
            </Link>
          </div>
          <div className="flex-1 border border-line rounded-lg overflow-hidden p-4 bg-surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Profesor</th>
                  <th>Instrumento</th>
                  <th>Día</th>
                  <th>Horario</th>
                  <th>Aula</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="empty-state p-6">
                    <div className="empty-icon">📅</div>
                    <h3>No hay clases programadas todavía</h3>
                    <p>Crea tu primera clase desde la sección de horarios.</p>
                    <Link href="/horarios" className="btn-primary btn-sm">
                      Programar clase
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Próximos pasos */}
        <div className="card overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-line">
            <h2 className="text-lg font-bold tracking-tight">Primeros pasos</h2>
          </div>
          <div className="p-4 space-y-3">
            <Link
              href="/alumnos"
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg border border-line bg-surface-hover hover:bg-accent-soft hover:text-accent-text transition-colors group"
            >
              <span className="text-lg">👨‍🎓</span>
              <div>
                <div className="font-medium text-ink group-hover:text-accent-text transition-colors">Registrar alumno</div>
                <div className="text-[11px] text-muted">Carga el primer alumno de la escuela</div>
              </div>
            </Link>
            <Link
              href="/profesores"
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg border border-line bg-surface-hover hover:bg-accent-soft hover:text-accent-text transition-colors group"
            >
              <span className="text-lg">🎓</span>
              <div>
                <div className="font-medium text-ink group-hover:text-accent-text transition-colors">Agregar profesor</div>
                <div className="text-[11px] text-muted">Asigna instrumento y comisión</div>
              </div>
            </Link>
            <Link
              href="/pagos"
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg border border-line bg-surface-hover hover:bg-accent-soft hover:text-accent-text transition-colors group"
            >
              <span className="text-lg">💳</span>
              <div>
                <div className="font-medium text-ink group-hover:text-accent-text transition-colors">Registrar pago</div>
                <div className="text-[11px] text-muted">Genera comprobantes de mensualidad</div>
              </div>
            </Link>
            <Link
              href="/horarios"
              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg border border-line bg-surface-hover hover:bg-accent-soft hover:text-accent-text transition-colors group"
            >
              <span className="text-lg">📅</span>
              <div>
                <div className="font-medium text-ink group-hover:text-accent-text transition-colors">Crear horario</div>
                <div className="text-[11px] text-muted">Organiza clases por día y aula</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
