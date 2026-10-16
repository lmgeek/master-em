'use client'

import { useEffect, useState } from 'react'

const INSTRUMENTOS = ['Canto', 'Guitarra', 'Bajo', 'Batería', 'Piano', 'Ukelele']

interface Profesor {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  instrumento: string
  porcentajeComision: number
  activo: boolean
}

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', instrumento: 'Canto', porcentajeComision: '0',
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores)
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/profesores/${editingId}` : '/api/profesores'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        telefono: form.telefono || null,
        porcentajeComision: Number(form.porcentajeComision),
      }),
    })
    setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: 'Canto', porcentajeComision: '0' })
    setOpen(false)
    setEditingId(null)
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores)
  }

  const editar = (p: Profesor) => {
    setForm({ nombre: p.nombre, apellido: p.apellido, email: p.email, telefono: p.telefono || '', instrumento: p.instrumento, porcentajeComision: String(p.porcentajeComision) })
    setEditingId(p.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar este profesor?')) return
    await fetch(`/api/profesores/${id}`, { method: 'DELETE' })
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="serif text-2xl font-bold text-[#111827]">Profesores</h1>
          <p className="mt-1 text-[#6B7280] text-sm">Registro de profesores por instrumento y porcentaje de comisión por alumno.</p>
        </div>
        <button
          onClick={() => {
            setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: 'Canto', porcentajeComision: '0' })
            setEditingId(null)
            setOpen(true)
          }}
          className="btn-primary"
        >
          Nuevo profesor
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Instrumento</th>
              <th style={{ textAlign: 'right' }}>Comisión</th>
              <th>Email</th>
              <th style={{ textAlign: 'right', width: '120px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {profesores.map((p) => (
              <tr key={p.id}>
                <td className="font-medium">{p.nombre} {p.apellido}</td>
                <td>{p.instrumento}</td>
                <td style={{ textAlign: 'right' }}>{p.porcentajeComision}%</td>
                <td>{p.email}</td>
                <td style={{ textAlign: 'right' }} className="space-x-1">
                  <button
                    onClick={() => editar(p)}
                    className="text-xs font-medium text-[#7C3AED] hover:text-[#6D28D9] underline underline-offset-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(p.id)}
                    className="text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] underline underline-offset-2"
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
            {profesores.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-[#94A3B8]">
                  No hay profesores registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="serif text-xl font-bold text-[#111827] mb-5">
              {editingId ? 'Editar profesor' : 'Nuevo profesor'}
            </h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="field-label">Nombre</label>
                <input
                  className="input-field"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="field-label">Apellido</label>
                <input
                  className="input-field"
                  value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="field-label">Teléfono</label>
                <input
                  className="input-field"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
              </div>
              <div>
                <label className="field-label">Instrumento</label>
                <select
                  className="select-field"
                  value={form.instrumento}
                  onChange={(e) => setForm({ ...form, instrumento: e.target.value })}
                >
                  {INSTRUMENTOS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Comisión por alumno (%)</label>
                <input
                  type="number"
                  className="input-field"
                  value={form.porcentajeComision}
                  onChange={(e) => setForm({ ...form, porcentajeComision: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-secondary btn-sm"
                >
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
