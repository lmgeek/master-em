'use client'

import { useEffect, useState } from 'react'
import { Plus, FileText, Trash2 } from 'lucide-react'

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
  const [generando, setGenerando] = useState(false)

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
    setGenerando(true)
    fetch('/api/pagos').then((r) => r.json()).then(setPagos).finally(() => setGenerando(false))
  }

  const generarComprobante = async (pago: Pago) => {
    setGenerando(true)
    try {
      const res = await fetch('/api/pagos/generar-comprobante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagoId: pago.id }),
      })
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        alert('Comprobante generado (descarga simulada)')
      }
    } catch {
      alert('Error al generar comprobante')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pagos y Comprobantes</h1>
        <button onClick={() => setOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={18} /> Registrar pago
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagos.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{p.alumno.nombre} {p.alumno.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.concepto}</td>
                <td className="px-6 py-4 whitespace-nowrap">${Number(p.monto).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(p.fecha).toLocaleDateString('es-AR')}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{p.metodoPago}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.estado === 'pagado' ? 'bg-green-100 text-green-700' : p.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {p.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => generarComprobante(p)} className="text-indigo-600 hover:text-indigo-800" title="Comprobante">
                    <FileText size={16} />
                  </button>
                  <button onClick={() => { if (confirm('¿Anular este pago?')) { fetch(`/api/pagos/${p.id}`, { method: 'DELETE' }).then(() => fetch('/api/pagos').then((r) => r.json()).then(setPagos)) } }} className="text-red-600 hover:text-red-800">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nuevo Pago</h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alumno</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={form.alumnoId} onChange={(e) => setForm({ ...form, alumnoId: e.target.value })}>
                  <option value="">Seleccionar alumno</option>
                  {alumnos.map((a) => <option key={a.id} value={String(a.id)}>{a.nombre} {a.apellido}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                  <input type="number" className="w-full border rounded px-3 py-2 text-sm" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" className="w-full border rounded px-3 py-2 text-sm" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })}>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 text-sm">Cancelar</button>
                <button type="submit" disabled={generando} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm disabled:opacity-50 hover:bg-indigo-700">Guardar y generar comprobante</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
