export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard - Escuela de Música</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Alumnos activos</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Profesores</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Clases programadas</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Ingresos del mes</p>
          <p className="text-2xl font-bold">$0</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/alumnos" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition">Gestionar Alumnos</a>
          <a href="/profesores" className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition">Gestionar Profesores</a>
          <a href="/horarios" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition">Plancha Horaria</a>
          <a href="/pagos" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition">Registrar Pago</a>
          <a href="/asistencias" className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition">Control de Asistencia</a>
          <a href="/reportes" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition">Reportes de Cierre</a>
        </div>
      </div>
    </div>
  )
}
