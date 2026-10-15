import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const alumnos = await prisma.alumno.findMany({
      where: { activo: true },
      orderBy: { apellido: 'asc' },
      include: {
        inscripciones: {
          include: { claseHorario: { include: { profesor: true } } },
        },
      },
    })
    return NextResponse.json(alumnos)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener alumnos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const alumno = await prisma.alumno.create({
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        telefono: body.telefono || null,
        instrumento: body.instrumento || null,
        nivel: body.nivel || null,
        activo: true,
      },
    })
    return NextResponse.json(alumno, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear alumno' }, { status: 500 })
  }
}
