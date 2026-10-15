import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const asistencias = await prisma.asistencia.findMany({
      orderBy: { fecha: 'desc' },
      include: {
        inscripcion: { include: { alumno: true, claseHorario: { include: { profesor: true } } } },
      },
    })
    return NextResponse.json(asistencias)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener asistencias' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const asistencia = await prisma.asistencia.create({
      data: {
        inscripcionId: Number(body.inscripcionId),
        claseHorarioId: Number(body.claseHorarioId),
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
        presente: body.presente ?? true,
        observaciones: body.observaciones || null,
      },
      include: { inscripcion: { include: { alumno: true } } },
    })
    return NextResponse.json(asistencia, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar asistencia' }, { status: 500 })
  }
}
