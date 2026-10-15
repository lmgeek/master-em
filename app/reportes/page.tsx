'use client'

import { useEffect, useState } from 'react'
import { FileText, TrendingUp, CreditCard } from 'lucide-react'

interface Reporte {
  mes: number
  anio: number
  ingresos: number
  egresos: number
  saldo: number
  detallePagos: any[]
  detallePagosProfesores: any[]
}

export default function ReportesPage() {
  const [reporte, setReporte] = useState<Reporte | null>(null)
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [cargando, setCargando] = useState(false)

  const generarReporte = async () => {
    setCargando(true)
    try {
      const res = await fetch(`/api/reportes/ingresos-egresos?mes=${mes}&anio=${anio}`)
      const data = await res.json()
      setReporte(data)
    } catch {
      alert('Error al generar reporte')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    generarReporte()
  }, [mes, anio])

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reporte de Cierre Mensual</h1>
        <div className="flex gap-3">
          <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="border rounded px-3 py-2 text-sm">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => <option key={m} value={m}>{new Date(2024, m-1).toLocaleDateString('es-AR', { month: 'long' })}</option>)}
          </select>
          <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="border rounded px-3 py-2 text-sm">
            {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={generarReporte} disabled={cargando} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50">Generar</button>
        </div>
      </div>

      {reporte && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Ingresos</p>
            <p className="text-3xl font-bold text-green-600">${reporte.ingresos.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Egresos (pagos a profesores)</p>
            <p className="text-3xl font-bold text-red-600">${reporte.egresos.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Saldo</p>
            <p className={`text-3xl font-bold ${reporte.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>${reporte.saldo.toFixed(2)}</p>
          </div>
        </div>
      )}

      {reporte && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <h2 className="p-6 text-lg font-bold border-b border-gray-200">Detalle de Ingresos</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reporte.detallePagos.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{p.alumno?.nombre} {p.alumno?.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.concepto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">${Number(p.monto).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(p.fecha).toLocaleDateString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reporte && (
        <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <h2 className="p-6 text-lg font-bold border-b border-gray-200">Pagos a Profesores del Mes</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumnos</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monto base</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Comisión</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reporte.detallePagosProfesores.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{p.profesor?.nombre} {p.profesor?.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.cantidadAlumnos}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">${Number(p.montoBase).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">${Number(p.comision).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">${Number(p.total).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.estado === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
