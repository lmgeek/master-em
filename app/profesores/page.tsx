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
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores).finally(() => setCargando(false))
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
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
    setCargando(false)
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores)
  }

  const editar = (p: Profesor) => {
    setForm({ nombre: p.nombre, apellido: p.apellido, email: p.email, telefono: p.telefono || '', instrumento: p.instrumento, porcentajeComision: String(p.porcentajeComision) })
    setEditingId(p.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar este profesor?')) return
    setCargando(true)
    await fetch(`/api/profesores/${id}`, { method: 'DELETE' })
    setCargando(false)
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Profesores</h1>
          <p className="mt-1 text-sm text-muted">Registro de profesores por instrumento y porcentaje de comisión por alumno.</p>
        </div>
        <button
          onClick={() => {
            setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: 'Canto', porcentajeComision: '0' })
            setEditingId(null)
            setOpen(true)
          }}
          className="btn-primary"
          disabled={cargando}
        >
          Nuevo profesor
        </button>
      </div>

      <div className="card overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <div className="skeleton w-48 h-8 mx-auto mb-3" />
            <div className="skeleton w-32 h-5 mx-auto" />
            <p className="mt-3 text-[11px] text-muted">Cargando profesores…</p>
          </div>
        ) : profesores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No hay profesores registrados todavía</h3>
            <p>Agrega el primer profesor para comenzar a organizar clases.</p>
            <button
              onClick={() => {
                setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: 'Canto', porcentajeComision: '0' })
                setEditingId(null)
                setOpen(true)
              }}
              className="btn-primary btn-sm"
            >
              Registrar profesor
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Instrumento</th>
                <th style={{ textAlign: 'right' }}>Comisión</th>
                <th>Email</th>
                <th style={{ textAlign: 'right', width: '130px' }}>Acciones</th>
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
                      className="btn-ghost btn-sm text-accent hover:text-accent-text hover:bg-accent-soft px-2 py-1.5 rounded-lg"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminar(p.id)}
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
              <h2 className="text-lg font-bold tracking-tight">{editingId ? 'Editar profesor' : 'Nuevo profesor'}</h2>
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
