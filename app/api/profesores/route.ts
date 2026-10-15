import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const INSTRUMENTOS = [
  'Canto',
  'Guitarra',
  'Bajo',
  'Bateria',
  'Piano',
  'Ukelele',
]

export async function GET() {
  try {
    const profesores = await prisma.profesor.findMany({
      where: { activo: true },
      orderBy: { apellido: 'asc' },
      include: {
        clases: { where: { activo: true } },
      },
    })
    return NextResponse.json(profesores)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener profesores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const profesor = await prisma.profesor.create({
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        telefono: body.telefono || null,
        instrumento: body.instrumento,
        porcentajeComision: body.porcentajeComision ? Number(body.porcentajeComision) : 0,
        activo: true,
      },
    })
    return NextResponse.json(profesor, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear profesor' }, { status: 500 })
  }
}
