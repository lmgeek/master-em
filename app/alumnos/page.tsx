'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Alumno {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  instrumento: string | null
  nivel: string | null
  activo: boolean
}

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '',
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/alumnos')
      .then((r) => r.json())
      .then(setAlumnos)
  }, [])

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingId ? `/api/alumnos/${editingId}` : '/api/alumnos'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, telefono: form.telefono || null }),
    })
    setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '' })
    setOpen(false)
    setEditingId(null)
    fetch('/api/alumnos').then((r) => r.json()).then(setAlumnos)
  }

  const editar = (a: Alumno) => {
    setForm({ nombre: a.nombre, apellido: a.apellido, email: a.email, telefono: a.telefono || '', instrumento: a.instrumento || '', nivel: a.nivel || '' })
    setEditingId(a.id)
    setOpen(true)
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Desactivar este alumno?')) return
    await fetch(`/api/alumnos/${id}`, { method: 'DELETE' })
    fetch('/api/alumnos').then((r) => r.json()).then(setAlumnos)
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alumnos</h1>
        <button onClick={() => { setForm({ nombre: '', apellido: '', email: '', telefono: '', instrumento: '', nivel: '' }); setEditingId(null); setOpen(true) }} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={18} /> Nuevo alumno
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrumento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {alumnos.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{a.nombre} {a.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.telefono || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.instrumento || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.nivel || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => editar(a)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                  <button onClick={() => eliminar(a.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{editingId ? 'Editar' : 'Nuevo'} Alumno</h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instrumento</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.instrumento} onChange={(e) => setForm({ ...form, instrumento: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                <input className="w-full border rounded px-3 py-2 text-sm" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 text-sm">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
