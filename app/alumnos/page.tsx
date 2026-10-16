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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="serif text-3xl font-semibold text-[#0F172A]">Alumnos</h1>
          <p className="mt-2 text-[#64748B]">Registro, edición y desactivación de alumnos de la escuela.</p>
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

      <div className="bg-white border border-[#CBD5E1] rounded-xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Instrumento</th>
              <th>Nivel</th>
              <th style={{ textAlign: 'right' }}>Acciones</th>
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
                <td style={{ textAlign: 'right' }} className="space-x-2">
                  <button
                    onClick={() => editar(a)}
                    className="text-sm font-medium text-[#0F172A] underline underline-offset-2 hover:text-[#D97706]"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(a.id)}
                    className="text-sm font-medium text-[#DC2626] underline underline-offset-2 hover:text-[#B91C1C]"
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
            {alumnos.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#64748B]">
                  No hay alumnos registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white p-6 rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="serif text-xl font-semibold text-[#0F172A] mb-4">
              {editingId ? 'Editar alumno' : 'Nuevo alumno'}
            </h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="label">Nombre</label>
                <input
                  className="w-full border border-[#CBD5E1] rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-[#D97706]"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Apellido</label>
                <input
                  className="w-full border border-[#CBD5E1] rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-[#D97706]"
                  value={form.apellido}
                  onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="w-full border border-[#CBD5E1] rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-[#D97706]"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input
                  className="w-full border border-[#CBD5E1] rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-[#D97706]"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Instrumento</label>
                <input
                  className="w-full border border-[#CBD5E1] rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-[#D97706]"
                  value={form.instrumento}
                  onChange={(e) => setForm({ ...form, instrumento: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Nivel</label>
                <input
                  className="w-full border border-[#CBD5E1] rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus-ring-[#D97706]"
                  value={form.nivel}
                  onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-ghost"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
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
