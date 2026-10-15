'use client'

import { useEffect, useState } from 'react'
import { Check, Calendar, User } from 'lucide-react'

interface Asistencia {
  id: number
  fecha: string
  presente: boolean
  observaciones: string | null
  inscripcion: {
    id: number
    alumno: { nombre: string; apellido: string }
    claseHorario: { id: number; instrumento: string; diaSemana: string; horaInicio: string; horaFin: string; profesor: { nombre: string; apellido: string } }
  }
}

export default function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [marcando, setMarcando] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/asistencias').then((r) => r.json()).then(setAsistencias)
  }, [])

  const guardarAsistencia = async (inscripcionId: number, claseHorarioId: number, presente: boolean) => {
    setMarcando({ ...marcando, [inscripcionId]: true })
    try {
      const existente = asistencias.find((a) => a.inscripcion.id === inscripcionId && a.fecha === fecha)
      if (existente) {
        await fetch(`/api/asistencias/${existente.id}`, {
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
      setMarcando({ ...marcando, [inscripcionId]: false })
      fetch('/api/asistencias').then((r) => r.json()).then(setAsistencias)
    } catch {
      setMarcando({ ...marcando, [inscripcionId]: false })
    }
  }

  // Agrupar inscripciones únicas (simplificado: usar asistencias existentes)
  const alumnosClase = Array.from(
    new Map(asistencias.map((a) => [a.inscripcion.id, a.inscripcion])).values()
  )

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Control de Asistencia</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Fecha</label>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="border rounded px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alumno</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clase / Profesor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Día y horario</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Presente</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alumnosClase.map((ins) => {
              const yaRegistrada = asistencias.find((a) => a.inscripcion.id === ins.id && a.fecha === fecha)
              return (
                <tr key={ins.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{ins.alumno.nombre} {ins.alumno.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{ins.claseHorario.instrumento || 'Clase'} - {ins.claseHorario.profesor.nombre} {ins.claseHorario.profesor.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">{ins.claseHorario.diaSemana} {ins.claseHorario.horaInicio} - {ins.claseHorario.horaFin}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => guardarAsistencia(ins.id, ins.claseHorario.id, true)}
                        disabled={marcando[ins.id]}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition ${yaRegistrada?.presente ? 'bg-green-100 text-green-700' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                      >
                        <Check size={14} /> Presente
                      </button>
                      <button
                        onClick={() => guardarAsistencia(ins.id, ins.claseHorario.id, false)}
                        disabled={marcando[ins.id]}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition ${yaRegistrada?.presente === false ? 'bg-red-100 text-red-700' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                      >
                        Ausente
                      </button>
                    </div>
                    {yaRegistrada && (
                      <p className="text-[10px] text-gray-400 text-center mt-1">Registrado</p>
                    )}
                  </td>
                </tr>
              )
            })}
            {alumnosClase.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No hay inscripciones registradas. Cree inscripciones primero desde el módulo de pagos o clases.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
