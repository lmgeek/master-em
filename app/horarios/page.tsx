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

  useEffect(() => {
    fetch('/api/clases').then((r) => r.json()).then(setClases)
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores)
  }, [])

  const clasesFiltradas = clases.filter((c) => !filtroProfesor || c.profesor.id === Number(filtroProfesor))

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
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
    fetch('/api/clases').then((r) => r.json()).then(setClases)
  }

  const editar = (c: Clase) => {
    setForm({ profesorId: String(c.profesor.id), instrumento: c.instrumento, diaSemana: c.diaSemana, horaInicio: c.horaInicio, horaFin: c.horaFin, aula: c.aula || '', capacidad: String(c.capacidad) })
    setEditingId(c.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar esta clase?')) return
    await fetch(`/api/clases/${id}`, { method: 'DELETE' })
    fetch('/api/clases').then((r) => r.json()).then(setClases)
  }

  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

  const getClaseEnCelda = (dia: string, hora: string) => {
    return clasesFiltradas.find((c) => c.diaSemana === dia && c.horaInicio === hora)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="serif text-2xl font-bold text-[#111827]">Plancha horaria</h1>
          <p className="mt-1 text-[#6B7280] text-sm">Organización de clases por profesor y día de la semana.</p>
        </div>
        <button
          onClick={() => { setForm({ profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1' }); setEditingId(null); setOpen(true) }}
          className="btn-primary"
        >
          Nueva clase
        </button>
      </div>

      <div className="flex gap-3">
        <select
          value={filtroProfesor}
          onChange={(e) => setFiltroProfesor(e.target.value)}
          className="select-field w-auto max-w-[200px]"
        >
          <option value="">Todos los profesores</option>
          {profesores.map((p) => <option key={p.id} value={String(p.id)}>{p.nombre} {p.apellido}</option>)}
        </select>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
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
                  <td className="text-xs font-medium text-[#6B7280] bg-[#F9FAFB]">{hora}</td>
                  {DIAS.map((dia) => {
                    const c = getClaseEnCelda(dia, hora)
                    return (
                      <td key={dia} className="text-center h-20 relative p-1" style={{ border: '1px solid #E5E7EB' }}>
                        {c ? (
                          <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded p-1 text-[10px] font-medium text-[#7C3AED] leading-tight">
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
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="serif text-xl font-bold text-[#111827] mb-5">
              {editingId ? 'Editar clase' : 'Nueva clase'}
            </h2>
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
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary btn-sm">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
