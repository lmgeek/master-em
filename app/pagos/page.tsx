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

  useEffect(() => {
    fetch('/api/pagos').then((r) => r.json()).then(setPagos)
    fetch('/api/alumnos').then((r) => r.json()).then((data) => setAlumnos(data.map((a: any) => ({ id: a.id, nombre: a.nombre, apellido: a.apellido }))))
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="serif text-2xl font-bold text-[#111827]">Pagos</h1>
          <p className="mt-1 text-[#6B7280] text-sm">Registro de pagos y generación de comprobantes.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary">
          Registrar pago
        </button>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Concepto</th>
              <th style={{ textAlign: 'right' }}>Monto</th>
              <th>Fecha</th>
              <th>Método</th>
              <th>Estado</th>
              <th style={{ textAlign: 'right', width: '110px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => (
              <tr key={p.id}>
                <td className="font-medium">{p.alumno.nombre} {p.alumno.apellido}</td>
                <td>{p.concepto}</td>
                <td style={{ textAlign: 'right' }}>${Number(p.monto).toFixed(2)}</td>
                <td className="text-xs text-[#6B7280]">{new Date(p.fecha).toLocaleDateString('es-AR')}</td>
                <td className="text-sm text-[#6B7280] capitalize">{p.metodoPago}</td>
                <td>
                  <span className={`badge ${p.estado === 'pagado' ? 'badge-success' : p.estado === 'pendiente' ? 'badge-pending' : 'badge-danger'}`}>
                    {p.estado}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }} className="space-x-1">
                  <button onClick={() => generarComprobante(p)} className="text-xs font-medium text-[#7C3AED] hover:text-[#6D28D9] underline underline-offset-2">
                    Comprobante
                  </button>
                  <button onClick={() => { if (confirm('¿Anular este pago?')) { fetch(`/api/pagos/${p.id}`, { method: 'DELETE' }).then(() => fetch('/api/pagos').then((r) => r.json()).then(setPagos)) } }} className="text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] underline underline-offset-2">
                    Anular
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-[#E5E7EB] w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="serif text-xl font-bold text-[#111827] mb-5">Nuevo pago</h2>
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
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary btn-sm">
                  Guardar pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
