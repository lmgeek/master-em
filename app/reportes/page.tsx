'use client'

import { useEffect, useState } from 'react'

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

  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Reporte de cierre mensual</h1>
        <p className="mt-1 text-sm text-muted">Ingresos y egresos del periodo seleccionado.</p>
      </div>

      <div className="flex gap-3 items-end">
        <select value={mes} onChange={(e) => setMes(Number(e.target.value))} className="select-field w-auto max-w-[160px]">
          {meses.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={anio} onChange={(e) => setAnio(Number(e.target.value))} className="select-field w-auto max-w-[120px]">
          {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={generarReporte} disabled={cargando} className="btn-primary">
          {cargando ? 'Generando…' : 'Generar'}
        </button>
      </div>

      {reporte && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="metric-card">
            <span className="metric-label">Ingresos</span>
            <p className="metric-value text-success">${reporte.ingresos.toFixed(2)}</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Egresos (profesores)</span>
            <p className="metric-value text-danger">${reporte.egresos.toFixed(2)}</p>
          </div>
          <div className="metric-card">
            <span className="metric-label">Saldo</span>
            <p className={`metric-value ${reporte.saldo >= 0 ? 'text-success' : 'text-danger'}`}>${reporte.saldo.toFixed(2)}</p>
          </div>
        </div>
      )}

      {reporte && reporte.detallePagos.length > 0 && (
        <div className="card overflow-hidden mt-4">
          <div className="p-4 border-b border-line">
            <h2 className="text-lg font-bold tracking-tight">Detalle de pagos</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Concepto</th>
                <th style={{ textAlign: 'right' }}>Monto</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reporte.detallePagos.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.alumno?.nombre} {p.alumno?.apellido}</td>
                  <td>{p.concepto}</td>
                  <td style={{ textAlign: 'right' }}>${Number(p.monto).toFixed(2)}</td>
                  <td className="text-xs text-muted">{new Date(p.fecha).toLocaleDateString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reporte && reporte.detallePagosProfesores.length > 0 && (
        <div className="card overflow-hidden mt-4">
          <div className="p-4 border-b border-line">
            <h2 className="text-lg font-bold tracking-tight">Pagos a profesores del mes</h2>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Profesor</th>
                <th style={{ textAlign: 'right' }}>Alumnos</th>
                <th style={{ textAlign: 'right' }}>Monto base</th>
                <th style={{ textAlign: 'right' }}>Comisión</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reporte.detallePagosProfesores.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.profesor?.nombre} {p.profesor?.apellido}</td>
                  <td style={{ textAlign: 'right' }}>{p.cantidadAlumnos}</td>
                  <td style={{ textAlign: 'right' }}>${Number(p.montoBase).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>${Number(p.comision).toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }} className="font-medium">${Number(p.total).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${p.estado === 'pagado' ? 'badge-success' : 'badge-pending'}`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!reporte || (reporte.detallePagos.length === 0 && reporte.detallePagosProfesores.length === 0) ? (
        <div className="empty-state mt-6">
          <div className="empty-icon">📊</div>
          <h3>No hay datos para este periodo</h3>
          <p>Registra pagos y cierres de comisiones para que el reporte tenga información.</p>
        </div>
      ) : null}
    </div>
  )
}
