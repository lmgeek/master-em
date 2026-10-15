import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, password, rol = 'ADMIN' } = body

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const existente = await prisma.usuario.findUnique({ where: { email } })
    if (existente) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    const passwordHash = await hash(password, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash,
        rol,
        activo: true,
      },
      select: { id: true, nombre: true, email: true, rol: true },
    })

    return NextResponse.json({ usuario }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 })
  }
}
