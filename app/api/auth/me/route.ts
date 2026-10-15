import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_por_una_clave_secreta_en_produccion'

export async function GET() {
  try {
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json({ autenticado: false }, { status: 401 })
    }

    const payload = verify(token, JWT_SECRET) as { userId: number; email: string; rol: string }
    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.userId },
      select: { id: true, nombre: true, email: true, rol: true, activo: true },
    })

    if (!usuario || !usuario.activo) {
      return NextResponse.json({ autenticado: false }, { status: 401 })
    }

    return NextResponse.json({
      autenticado: true,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    })
  } catch {
    return NextResponse.json({ autenticado: false }, { status: 401 })
  }
}
