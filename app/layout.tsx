import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import LogoutButton from '@/components/LogoutButton'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_por_una_clave_secreta_en_produccion'

interface Usuario {
  id: number
  nombre: string
  email: string
  rol: string
}

async function obtenerUsuario(): Promise<Usuario | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null

  try {
    const payload = verify(token, JWT_SECRET) as { userId: number }
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.userId },
      select: { id: true, nombre: true, email: true, rol: true, activo: true },
    })
    if (!usuario || !usuario.activo) return null
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    }
  } catch {
    return null
  }
}

export const metadata: Metadata = {
  title: 'Escuela de Música - Sistema de Facturación',
  description: 'ABM de alumnos, profesores, horarios, pagos y reportes.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const usuario = await obtenerUsuario()

  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-900">Escuela de Música</span>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">Facturación</span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <a href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">Dashboard</a>
                <a href="/alumnos" className="text-sm font-medium text-gray-600 hover:text-blue-600">Alumnos</a>
                <a href="/profesores" className="text-sm font-medium text-gray-600 hover:text-blue-600">Profesores</a>
                <a href="/horarios" className="text-sm font-medium text-gray-600 hover:text-blue-600">Horarios</a>
                <a href="/pagos" className="text-sm font-medium text-gray-600 hover:text-blue-600">Pagos</a>
                <a href="/asistencias" className="text-sm font-medium text-gray-600 hover:text-blue-600">Asistencias</a>
                <a href="/reportes" className="text-sm font-medium text-gray-600 hover:text-blue-600">Reportes</a>
              </div>

              <div className="flex items-center gap-3">
                {usuario ? (
                  <div className="flex items-center gap-2 ml-4">
                    <div className="text-sm text-gray-700">{usuario.nombre}</div>
                    <LogoutButton />
                  </div>
                ) : (
                  <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Iniciar sesión
                  </a>
                )}
              </div>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  )
}
