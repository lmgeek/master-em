'use client'

import { useEffect, useState } from 'react'

interface Pago {
  id: number
  alumno: { nombre: string; apellido: string; email: string }
  concepto: string
  monto: number
  fecha: string
  metodoPago: string
  estado: string
  numeroComprobante: string | null
  comprobanteUrl: string | null
}

interface Alumno {
  id: number
  nombre: string
  apellido: string
}

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    alumnoId: '', inscripcionId: '', concepto: 'Mensualidad', monto: '', fecha: new Date().toISOString().slice(0, 10), metodoPago: 'efectivo', estado: 'pagado',
  })
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    setCargando(true)
    fetch('/api/pagos').then((r) => r.json()).then(setPagos)
    fetch('/api/alumnos').then((r) => r.json()).then((data) => setAlumnos(data.map((a: any) => ({ id: a.id, nombre: a.nombre, apellido: a.apellido })))).finally(() => setCargando(false))
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    await fetch('/api/pagos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        alumnoId: Number(form.alumnoId),
        inscripcionId: form.inscripcionId ? Number(form.inscripcionId) : null,
        monto: Number(form.monto),
        fecha: form.fecha,
      }),
    })
    setForm({ alumnoId: '', inscripcionId: '', concepto: 'Mensualidad', monto: '', fecha: new Date().toISOString().slice(0, 10), metodoPago: 'efectivo', estado: 'pagado' })
    setOpen(false)
    setCargando(false)
    fetch('/api/pagos').then((r) => r.json()).then(setPagos)
  }

  const generarComprobante = async (pago: Pago) => {
    try {
      const res = await fetch('/api/pagos/generar-comprobante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagoId: pago.id }),
      })
      const data = await res.json()
      if (data.archivo) {
        const link = document.createElement('a')
        link.href = data.archivo
        link.download = data.nombre
        link.click()
      } else {
        alert('Comprobante generado')
      }
    } catch {
      alert('Error al generar comprobante')
    }
  }

  const anular = async (id: number) => {
    if (!confirm('¿Anular este pago?')) return
    setCargando(true)
    await fetch(`/api/pagos/${id}`, { method: 'DELETE' })
    setCargando(false)
    fetch('/api/pagos').then((r) => r.json()).then(setPagos)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Pagos</h1>
          <p className="mt-1 text-sm text-muted">Registro de pagos y generación de comprobantes.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">
          Registrar pago
        </button>
      </div>

      <div className="card overflow-hidden">
        {cargando ? (
          <div className="p-8 text-center">
            <div className="skeleton w-48 h-8 mx-auto mb-3" />
            <div className="skeleton w-32 h-5 mx-auto" />
            <p className="mt-3 text-[11px] text-muted">Cargando pagos…</p>
          </div>
        ) : pagos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No hay pagos registrados todavía</h3>
            <p>Registra el primer pago y genera su comprobante.</p>
            <button onClick={() => setOpen(true)} className="btn-primary btn-sm">
              Registrar pago
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Concepto</th>
                <th style={{ textAlign: 'right' }}>Monto</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right', width: '120px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.alumno.nombre} {p.alumno.apellido}</td>
                  <td>{p.concepto}</td>
                  <td style={{ textAlign: 'right' }}>${Number(p.monto).toFixed(2)}</td>
                  <td className="text-xs text-muted">{new Date(p.fecha).toLocaleDateString('es-AR')}</td>
                  <td className="text-sm text-muted capitalize">{p.metodoPago}</td>
                  <td>
                    <span className={`badge ${p.estado === 'pagado' ? 'badge-success' : p.estado === 'pendiente' ? 'badge-pending' : 'badge-danger'}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }} className="space-x-1">
                    <button onClick={() => generarComprobante(p)} className="btn-ghost btn-sm text-accent hover:text-accent-text hover:bg-accent-soft px-2 py-1.5 rounded-lg">
                      Comprobante
                    </button>
                    <button onClick={() => anular(p.id)} className="btn-ghost btn-sm text-danger hover:text-danger hover:bg-danger-soft px-2 py-1.5 rounded-lg">
                      Anular
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
              <h2 className="text-lg font-bold tracking-tight">Nuevo pago</h2>
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
                  <label className="field-label">Alumno</label>
                  <select className="select-field" value={form.alumnoId} onChange={(e) => setForm({ ...form, alumnoId: e.target.value })}>
                    <option value="">Seleccionar alumno</option>
                    {alumnos.map((a) => <option key={a.id} value={String(a.id)}>{a.nombre} {a.apellido}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Concepto</label>
                  <input className="input-field" value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label">Monto</label>
                    <input type="number" className="input-field" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} required />
                  </div>
                  <div>
                    <label className="field-label">Fecha</label>
                    <input type="date" className="input-field" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="field-label">Método de pago</label>
                  <select className="select-field" value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Estado</label>
                  <select className="select-field" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                    <option value="pagado">Pagado</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setOpen(false)} className="btn-secondary btn-sm">
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary btn-sm" disabled={cargando}>
                    Guardar pago
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
