import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
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
  title: 'Escuela de Música - Sistema de Administración',
  description: 'Alumnos, profesores, horarios, pagos y reportes.',
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
        <div className="flex flex-col h-full">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-0">
            <TopBar usuario={usuario} />
            <main className="flex-1 pt-1 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
