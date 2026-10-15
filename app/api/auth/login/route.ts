import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_por_una_clave_secreta_en_produccion'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario || !usuario.activo) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const valida = await compare(password, usuario.password)
    if (!valida) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = sign(
      { userId: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      ok: true,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}
