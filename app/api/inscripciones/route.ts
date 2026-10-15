import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      where: { activo: true },
      orderBy: { fechaInscripcion: 'desc' },
      include: {
        alumno: true,
        claseHorario: { include: { profesor: true } },
      },
    })
    return NextResponse.json(inscripciones)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const inscripcion = await prisma.inscripcion.create({
      data: {
        alumnoId: Number(body.alumnoId),
        claseHorarioId: Number(body.claseHorarioId),
        mensualidad: body.mensualidad ? Number(body.mensualidad) : 0,
        activo: true,
      },
      include: {
        alumno: true,
        claseHorario: { include: { profesor: true } },
      },
    })
    return NextResponse.json(inscripcion, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear inscripción' }, { status: 500 })
  }
}
