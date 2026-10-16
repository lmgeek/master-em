'use client'

import { useEffect, useState } from 'react'

interface Alumno {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  instrumento: string | null
  nivel: string | null
  activo: boolean
}

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/alumnos')
      .then((r) => r.json())
      .then(setAlumnos)
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/alumnos/${editingId}` : '/api/alumnos'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, telefono: form.telefono || null }),
    })
    setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '' })
    setOpen(false)
    setEditingId(null)
    fetch('/api/alumnos').then((r) => r.json()).then(setAlumnos)
  }

  const editar = (a: Alumno) => {
    setForm({ nombre: a.nombre, apellido: a.apellido, email: a.email, telefono: a.telefono || '', instrumento: a.instrumento || '', nivel: a.nivel || '' })
    setEditingId(a.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar este alumno?')) return
    await fetch(`/api/alumnos/${id}`, { method: 'DELETE' })
    fetch('/api/alumnos').then((r) => r.json()).then(setAlumnos)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="serif text-2xl font-bold text-[#111827]">Alumnos</h1>
          <p className="mt-1 text-[#6B7280] text-sm">Registro, edición y desactivación de alumnos de la escuela.</p>
        </div>
        <button
          onClick={() => {
            setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '' })
            setEditingId(null)
            setOpen(true)
          }}
          className="btn-primary"
        >
          Nuevo alumno
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Instrumento</th>
              <th>Nivel</th>
              <th style={{ textAlign: 'right', width: '120px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a) => (
              <tr key={a.id}>
                <td className="font-medium">{a.nombre} {a.apellido}</td>
                <td>{a.email}</td>
                <td>{a.telefono || '—'}</td>
                <td>{a.instrumento || '—'}</td>
                <td>{a.nivel || '—'}</td>
                <td style={{ textAlign: 'right' }} className="space-x-1">
                  <button
                    onClick={() => editar(a)}
                    className="text-xs font-medium text-[#7C3AED] hover:text-[#6D28D9] underline underline-offset-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(a.id)}
                    className="text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] underline underline-offset-2"
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
            {alumnos.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-[#94A3B8]">
                  No hay alumnos registrados todavía.
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
              {editingId ? 'Editar alumno' : 'Nuevo alumno'}
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
                  required
                />
              </div>
              <div>
                <label className="field-label">Instrumento</label>
                <select className="select-field" value={form.instrumento} onChange={(e) => setForm({ ...form, instrumento: e.target.value })}>
                  <option value="">Seleccionar instrumento</option>
                  <option value="Canto">Canto</option>
                  <option value="Guitarra">Guitarra</option>
                  <option value="Bajo">Bajo</option>
                  <option value="Batería">Batería</option>
                  <option value="Piano">Piano</option>
                  <option value="Ukelele">Ukelele</option>
                </select>
              </div>
              <div>
                <label className="field-label">Nivel</label>
                <select className="select-field" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}>
                  <option value="">Seleccionar nivel</option>
                  <option value="Ninguno">Ninguno</option>
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
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
