'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Filter } from 'lucide-react'

interface Clase {
  id: number
  profesor: { id: number; nombre: string; apellido: string; instrumento: string }
  instrumento: string
  diaSemana: string
  horaInicio: string
  horaFin: string
  aula: string | null
  capacidad: number
  activo: boolean
}

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

export default function HorariosPage() {
  const [clases, setClases] = useState<Clase[]>([])
  const [profesores, setProfesores] = useState<any[]>([])
  const [filtroProfesor, setFiltroProfesor] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1',
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [view, setView] = useState<'lista' | 'plancha'>('lista')

  useEffect(() => {
    fetch('/api/clases').then((r) => r.json()).then(setClases)
    fetch('/api/profesores').then((r) => r.json()).then(setProfesores)
  }, [])

  const clasesFiltradas = clases.filter((c) => !filtroProfesor || c.profesor.id === Number(filtroProfesor))

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/clases/${editingId}` : '/api/clases'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, profesorId: Number(form.profesorId), capacidad: Number(form.capacidad), aula: form.aula || null }),
    })
    setForm({ profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1' })
    setOpen(false)
    setEditingId(null)
    fetch('/api/clases').then((r) => r.json()).then(setClases)
  }

  const editar = (c: Clase) => {
    setForm({ profesorId: String(c.profesor.id), instrumento: c.instrumento, diaSemana: c.diaSemana, horaInicio: c.horaInicio, horaFin: c.horaFin, aula: c.aula || '', capacidad: String(c.capacidad) })
    setEditingId(c.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar esta clase?')) return
    await fetch(`/api/clases/${id}`, { method: 'DELETE' })
    fetch('/api/clases').then((r) => r.json()).then(setClases)
  }

  // Plancha horaria: filas = horas, columnas = días
  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

  const getClaseEnCelda = (dia: string, hora: string) => {
    return clasesFiltradas.find((c) => c.diaSemana === dia && c.horaInicio === hora)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Horarios y Plancha Horaria</h1>
          <p className="text-gray-600 text-sm">Organización de clases por profesor y día.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('lista')} className={`px-4 py-2 rounded text-sm font-medium transition ${view === 'lista' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Lista</button>
          <button onClick={() => setView('plancha')} className={`px-4 py-2 rounded text-sm font-medium transition ${view === 'plancha' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Plancha</button>
          <button onClick={() => { setForm({ profesorId: '', instrumento: '', diaSemana: 'lunes', horaInicio: '09:00', horaFin: '10:00', aula: '', capacidad: '1' }); setEditingId(null); setOpen(true) }} className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
            <Plus size={18} /> Nueva clase
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <select value={filtroProfesor} onChange={(e) => setFiltroProfesor(e.target.value)} className="border rounded px-3 py-2 text-sm">
          <option value="">Todos los profesores</option>
          {profesores.map((p) => <option key={p.id} value={String(p.id)}>{p.nombre} {p.apellido}</option>)}
        </select>
      </div>

      {view === 'lista' ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profesor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instrumento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Día</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aula</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clasesFiltradas.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{c.profesor.nombre} {c.profesor.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{c.instrumento}</td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{c.diaSemana}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.horaInicio} - {c.horaFin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{c.aula || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => editar(c)} className="text-purple-600 hover:text-purple-800"><Edit size={16} /></button>
                    <button onClick={() => eliminar(c.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 divide-x divide-gray-200">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                  {DIAS.map((dia) => (
                    <th key={dia} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{dia.charAt(0).toUpperCase() + dia.slice(1)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {horas.map((hora) => (
                  <tr key={hora} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-left text-xs font-medium text-gray-600">{hora}</td>
                    {DIAS.map((dia) => {
                      const c = getClaseEnCelda(dia, hora)
                      return (
                        <td key={dia} className="px-6 py-4 text-center h-24 relative">
                          {c ? (
                            <div className="bg-purple-100 border border-purple-300 rounded p-1 text-[10px] font-medium text-purple-800 leading-tight">
                              {c.profesor.apellido} - {c.instrumento}
                            </div>
                          ) : null}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editingId ? 'Editar' : 'Nueva'} Clase</h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profesor</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={form.profesorId} onChange={(e) => setForm({ ...form, profesorId: e.target.value })}>
                  <option value="">Seleccionar profesor</option>
                  {profesores.map((p) => <option key={p.id} value={String(p.id)}>{p.nombre} {p.apellido}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instrumento</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.instrumento} onChange={(e) => setForm({ ...form, instrumento: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Día</label>
                <select className="w-full border rounded px-3 py-2 text-sm" value={form.diaSemana} onChange={(e) => setForm({ ...form, diaSemana: e.target.value })}>
                  {DIAS.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
                  <input type="time" className="w-full border rounded px-3 py-2 text-sm" value={form.horaInicio} onChange={(e) => setForm({ ...form, horaInicio: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
                  <input type="time" className="w-full border rounded px-3 py-2 text-sm" value={form.horaFin} onChange={(e) => setForm({ ...form, horaFin: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.aula} onChange={(e) => setForm({ ...form, aula: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm" value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 text-sm">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
