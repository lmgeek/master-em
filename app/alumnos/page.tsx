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
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    fetch('/api/alumnos')
      .then((r) => r.json())
      .then(setAlumnos)
      .finally(() => setCargando(false))
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
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
    setCargando(false)
    fetch('/api/alumnos').then((r) => r.json()).then(setAlumnos)
  }

  const editar = (a: Alumno) => {
    setForm({ nombre: a.nombre, apellido: a.apellido, email: a.email, telefono: a.telefono || '', instrumento: a.instrumento || '', nivel: a.nivel || '' })
    setEditingId(a.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar este alumno?')) return
    setCargando(true)
    await fetch(`/api/alumnos/${id}`, { method: 'DELETE' })
    setCargando(false)
    fetch('/api/alumnos').then((r) => r.json()).then(setAlumnos)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Alumnos</h1>
          <p className="mt-1 text-sm text-muted">Registro, edición y desactivación de alumnos de la escuela.</p>
        </div>
        <button
          onClick={() => {
            setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '' })
            setEditingId(null)
            setOpen(true)
          }}
          className="btn-primary"
          disabled={cargando}
        >
          Nuevo alumno
        </button>
      </div>

      <div className="card overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <div className="skeleton w-48 h-8 mx-auto mb-3" />
            <div className="skeleton w-32 h-5 mx-auto" />
            <p className="mt-3 text-[11px] text-muted">Cargando alumnos…</p>
          </div>
        ) : alumnos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👨‍🎓</div>
            <h3>No hay alumnos registrados todavía</h3>
            <p>Comienza registrando al primer alumno de la escuela.</p>
            <button
              onClick={() => {
                setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '' })
                setEditingId(null)
                setOpen(true)
              }}
              className="btn-primary btn-sm"
            >
              Registrar alumno
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Instrumento</th>
                <th>Nivel</th>
                <th style={{ textAlign: 'right', width: '130px' }}>Acciones</th>
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
                      className="btn-ghost btn-sm text-accent hover:text-accent-text hover:bg-accent-soft px-2 py-1.5 rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(a.id)}
                      className="btn-ghost btn-sm text-danger hover:text-danger hover:bg-danger-soft px-2 py-1.5 rounded-lg"
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-lg font-bold tracking-tight">{editingId ? 'Editar alumno' : 'Nuevo alumno'}</h2>
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
                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-secondary btn-sm"
                  >
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
