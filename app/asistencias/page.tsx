'use client'

export default function AsistenciasPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h1 className="serif text-2xl font-bold text-[#111827]">Asistencias</h1>
        <div className="flex items-center gap-2">
          <label className="field-label">Fecha</label>
          <input type="date" value={new Date().toISOString().slice(0, 10)} className="input-field w-auto max-w-[180px]" />
        </div>
      </div>
      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
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
            <tr>
              <td colSpan={4} className="text-center py-10 text-[#94A3B8]">
                No hay inscripciones registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
