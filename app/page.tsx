export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="border-b border-[#CBD5E1] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="serif text-3xl font-semibold text-[#0F172A]">Estado de la escuela</h1>
            <p className="mt-2 text-[#64748B] max-w-3xl">Resumen de alumnos, profesores, pagos y asistencias del mes actual.</p>
          </div>
          <a href="/alumnos" className="btn-primary">
            Nuevo alumno
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-[#CBD5E1] rounded-xl">
          <span className="label">Alumnos activos</span>
          <p className="serif text-4xl font-bold text-[#0F172A]">—</p>
          <p className="mt-2 text-xs text-[#64748B]">Sin registros todavía</p>
        </div>
        <div className="bg-white p-6 border border-[#CBD5E1] rounded-xl">
          <span className="label">Profesores</span>
          <p className="serif text-4xl font-bold text-[#0F172A]">—</p>
          <p className="mt-2 text-xs text-[#64748B]">Canto, Guitarra, Bajo, Batería, Piano, Ukelele</p>
        </div>
        <div className="bg-white p-6 border border-[#CBD5E1] rounded-xl">
          <span className="label">Ingresos del mes</span>
          <p className="serif text-4xl font-bold text-[#0F172A]">—</p>
          <p className="mt-2 text-xs text-[#64748B]">Sin pagos registrados</p>
        </div>
      </section>

      <section>
        <h2 className="serif text-xl font-semibold text-[#0F172A]">Plancha horaria</h2>
        <p className="text-[#64748B] text-sm max-w-2xl">Organización de clases por profesor y día de la semana.</p>
        <div className="mt-4 bg-white border border-[#CBD5E1] rounded-xl overflow-hidden">
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
                <td colSpan={5} className="text-center py-8 text-[#64748B]">No hay clases programadas todavía.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
