export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="serif text-3xl font-bold text-[#111827] tracking-tight">
              Panel de la escuela
            </h1>
            <p className="mt-1.5 text-[#6B7280] text-sm max-w-2xl">
              Estado actual de alumnos, profesores, pagos y asistencias.
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/alumnos" className="btn-primary">
              Nuevo alumno
            </a>
            <a href="/horarios" className="btn-secondary">
              Horarios
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <span className="metric-label">Alumnos activos</span>
          <p className="metric-value text-[#7C3AED]">—</p>
          <p className="mt-2 text-[11px] text-[#94A3B8]">Sin registros todavía</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Profesores</span>
          <p className="metric-value text-[#7C3AED]">—</p>
          <p className="mt-2 text-[11px] text-[#94A3B8]">Canto · Guitarra · Bajo · Batería · Piano · Ukelele</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Ingresos del mes</span>
          <p className="metric-value text-[#7C3AED]">—</p>
          <p className="mt-2 text-[11px] text-[#94A3B8]">Sin pagos registrados</p>
        </div>
        <div className="metric-card">
          <span className="metric-label">Asistencia promedio</span>
          <p className="metric-value text-[#7C3AED]">—</p>
          <p className="mt-2 text-[11px] text-[#94A3B8]">Sin clases registradas</p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="serif text-xl font-bold text-[#111827]">Plancha horaria</h2>
          <a href="/horarios" className="text-[11px] font-medium text-[#7C3AED] hover:underline underline-offset-2">
            Ver todo →
          </a>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Profesor</th>
                <th>Instrumento</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Aula</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="text-center py-10 text-[#94A3B8]">
                  No hay clases programadas todavía.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
