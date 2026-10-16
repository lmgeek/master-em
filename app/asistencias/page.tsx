'use client'

import { useEffect, useState } from 'react'

export default function AsistenciasPage() {
  const [inscripciones, setInscripciones] = useState<any[]>([])
  const [asistencias, setAsistencias] = useState<any[]>([])
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [guardando, setGuardando] = useState<Record<string, boolean>>({})

  useEffect(() => {
    Promise.all([
      fetch('/api/inscripciones').then((r) => r.json()),
      fetch('/api/asistencias').then((r) => r.json()),
    ])
      .then(([inscripcionesData, asistenciasData]) => {
        setInscripciones(inscripcionesData)
        setAsistencias(asistenciasData)
      })
      .catch(() => {})
  }, [])

  const asistenciasPorFecha = asistencias.filter(
    (a) => a.fecha === fecha
  )

  const estaRegistrada = (inscripcionId: number) =>
    asistenciasPorFecha.some((a) => a.inscripcion.id === inscripcionId)

  const obtenerPresente = (inscripcionId: number) =>
    asistenciasPorFecha.find((a) => a.inscripcion.id === inscripcionId)?.presente

  const guardar = async (
    inscripcionId: number,
    claseHorarioId: number,
    presente: boolean
  ) => {
    setGuardando({ ...guardando, [inscripcionId]: true })

    const existente = asistenciasPorFecha.find(
      (a) => a.inscripcion.id === inscripcionId
    )

    if (existente) {
      await fetch('/api/asistencias/' + existente.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presente }),
      })
    } else {
      await fetch('/api/asistencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inscripcionId, claseHorarioId, fecha, presente }),
      })
    }

    const nuevasAsistencias = await (await fetch('/api/asistencias')).json()
    setAsistencias(nuevasAsistencias)
    setGuardando({ ...guardando, [inscripcionId]: false })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight">Asistencias</h1>
        <div className="flex items-center gap-2">
          <label className="field-label">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="input-field w-auto max-w-[180px]"
          />
        </div>
      </div>
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Clase / Profesor</th>
              <th>Día y horario</th>
              <th style={{ textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map((ins: any) => (
              <tr key={ins.id}>
                <td>{ins.alumno.nombre} {ins.alumno.apellido}</td>
                <td className="text-sm text-muted">{ins.claseHorario.instrumento || 'Clase'} - {ins.claseHorario.profesor.nombre} {ins.claseHorario.profesor.apellido}</td>
                <td className="text-sm text-muted capitalize">{ins.claseHorario.diaSemana} {ins.claseHorario.horaInicio} - {ins.claseHorario.horaFin}</td>
                <td style={{ textAlign: 'center' }} className="space-x-1">
                  <button
                    onClick={() => guardar(ins.id, ins.claseHorarioId, true)}
                    disabled={guardando[ins.id]}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      estaRegistrada(ins.id) && obtenerPresente(ins.id) === true
                        ? 'bg-success-soft text-success'
                        : 'bg-surface hover:bg-success-soft text-success hover:text-success'
                    }`}
                  >
                    Presente
                  </button>
                  <button
                    onClick={() => guardar(ins.id, ins.claseHorarioId, false)}
                    disabled={guardando[ins.id]}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      estaRegistrada(ins.id) && obtenerPresente(ins.id) === false
                        ? 'bg-danger-soft text-danger'
                        : 'bg-surface hover:bg-danger-soft text-danger hover:text-danger'
                    }`}
                  >
                    Ausente
                  </button>
                </td>
              </tr>
            ))}
            {inscripciones.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-10 text-muted">No hay inscripciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
