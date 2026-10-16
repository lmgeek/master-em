'use client'

import { useEffect, useState } from 'react'

export default function AsistenciaPage() {
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setCargando(false)
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="serif text-2xl font-bold text-[#111827]">Asistencias</h1>
        <p className="mt-1 text-[#6B7280] text-sm">Registro de asistencia de los alumnos a sus clases.</p>
      </div>

      <div className="empty-state">
        <div className="empty-icon">✅</div>
        <h3>No hay asistencias registradas todavía</h3>
        <p>Las asistencias se registran una vez que haya clases programadas y alumnos inscritos.</p>
      </div>
    </div>
  )
}
