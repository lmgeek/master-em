'use client'

import { useEffect, useState } from 'react'

interface Clase {
  id: number
  profesor: { id: number; nombre: string; apellido: string; instrumento: string }
  instrumento: string
  diaSemana: string
  horaInicio: string
  horaFin: string
  aula: string | null
  capacidad: number
  activo: boolean
}

interface Profesor {
  id: number
  nombre: string
  apellido: string
}

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

export default function HorariosPage() {
  const [clases, setClases] = useState<Clase[]>([])
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [filtroProfesor, setFiltroProfesor] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    fetch('/api/clases').then((r) => r.json()).then(setClases)
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores).finally(() => setCargando(false))
  }, [])

  const clasesFiltradas = clases.filter((c) => !filtroProfesor || c.profesor.id === Number(filtroProfesor))

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    const url = editingId ? `/api/clases/${editingId}` : '/api/clases'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, profesorId: Number(form.profesorId), capacidad: Number(form.capacidad), aula: form.aula || null }),
    })
    setForm({ profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1' })
    setOpen(false)
    setEditingId(null)
    setCargando(false)
    fetch('/api/clases').then((r) => r.json()).then(setClases)
  }

  const editar = (c: Clase) => {
    setForm({ profesorId: String(c.profesor.id), instrumento: c.instrumento, diaSemana: c.diaSemana, horaInicio: c.horaInicio, horaFin: c.horaFin, aula: c.aula || '', capacidad: String(c.capacidad) })
    setEditingId(c.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar esta clase?')) return
    setCargando(true)
    await fetch(`/api/clases/${id}`, { method: 'DELETE' })
    setCargando(false)
    fetch('/api/clases').then((r) => r.json()).then(setClases)
  }

  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

  const getClaseEnCelda = (dia: string, hora: string) => {
    return clasesFiltradas.find((c) => c.diaSemana === dia && c.horaInicio === hora)
  }

  const tieneClases = clasesFiltradas.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Plancha horaria</h1>
          <p className="mt-1 text-sm text-muted">Organización de clases por profesor y día de la semana.</p>
        </div>
        <button
          onClick={() => { setForm({ profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1' }); setEditingId(null); setOpen(true) }}
          className="btn-primary"
          disabled={cargando}
        >
          Nueva clase
        </button>
      </div>

      <div className="flex gap-3">
        <select
          value={filtroProfesor}
          onChange={(e) => setFiltroProfesor(e.target.value)}
          className="select-field w-auto max-w-[220px]"
        >
          <option value="">Todos los profesores</option>
          {profesores.map((p) => <option key={p.id} value={String(p.id)}>{p.nombre} {p.apellido}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <div className="skeleton w-48 h-8 mx-auto mb-3" />
            <div className="skeleton w-32 h-5 mx-auto" />
            <p className="mt-3 text-[11px] text-muted">Cargando clases…</p>
          </div>
        ) : !tieneClases ? (
          <div className="empty-state py-10">
            <div className="empty-icon">📅</div>
            <h3>No hay clases programadas todavía</h3>
            <p>Crea tu primera clase y verás la plancha completarse automáticamente.</p>
            <button
              onClick={() => { setForm({ profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1' }); setEditingId(null); setOpen(true) }}
              className="btn-primary btn-sm"
            >
              Programar clase
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="data-table">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-20">Hora</th>
                  {DIAS.map((dia) => (
                    <th key={dia} className="text-center" style={{ width: 'calc((100% - 80px) / 6)' }}>
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map((hora) => (
                  <tr key={hora}>
                    <td className="text-xs font-medium text-muted bg-surface-hover">{hora}</td>
                    {DIAS.map((dia) => {
                      const c = getClaseEnCelda(dia, hora)
                      return (
                        <td key={dia} className="text-center h-20 relative p-1 cursor-pointer hover:bg-accent-soft transition-colors" style={{ border: '1px solid rgb(var(--line-soft))' }}>
                          {c ? (
                            <div className="bg-accent-soft border border-accent/30 rounded-lg p-1.5 text-[10px] font-medium text-accent-text leading-tight shadow-sm">
                              {c.profesor.apellido} - {c.instrumento}
                            </div>
                          ) : null}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-lg font-bold tracking-tight">{editingId ? 'Editar clase' : 'Nueva clase'}</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-muted hover:text-ink rounded-lg hover:bg-surface-hover transition-colors"
                aria-label="Cerrar"
              >
                <span className="sr-only">Cerrar</span>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={guardar} className="space-y-4">
                <div>
                  <label className="field-label">Profesor</label>
                  <select
                    className="select-field"
                    value={form.profesorId}
                    onChange={(e) => setForm({ ...form, profesorId: e.target.value })}
                  >
                    <option value="">Seleccionar profesor</option>
                    {profesores.map((p) => <option key={p.id} value={String(p.id)}>{p.nombre} {p.apellido}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Instrumento</label>
                  <input className="input-field" value={form.instrumento} onChange={(e) => setForm({ ...form, instrumento: e.target.value })} required />
                </div>
                <div>
                  <label className="field-label">Día</label>
                  <select className="select-field" value={form.diaSemana} onChange={(e) => setForm({ ...form, diaSemana: e.target.value })}>
                    {DIAS.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Hora inicio</label>
                    <input type="time" className="input-field" value={form.horaInicio} onChange={(e) => setForm({ ...form, horaInicio: e.target.value })} required />
                  </div>
                  <div>
                    <label className="field-label">Hora fin</label>
                    <input type="time" className="input-field" value={form.horaFin} onChange={(e) => setForm({ ...form, horaFin: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="field-label">Aula</label>
                  <input className="input-field" value={form.aula} onChange={(e) => setForm({ ...form, aula: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Capacidad</label>
                  <input type="number" className="input-field" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} />
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setOpen(false)} className="btn-secondary btn-sm">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary btn-sm" disabled={cargando}>
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
