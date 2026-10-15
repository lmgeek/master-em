import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clases = await prisma.claseHorario.findMany({
      where: { activo: true },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
      include: { profesor: true },
    })
    return NextResponse.json(clases)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener clases' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const clase = await prisma.claseHorario.create({
      data: {
        profesorId: Number(body.profesorId),
        instrumento: body.instrumento,
        diaSemana: body.diaSemana,
        horaInicio: body.horaInicio,
        horaFin: body.horaFin,
        aula: body.aula || null,
        capacidad: body.capacidad ? Number(body.capacidad) : 1,
        activo: true,
      },
      include: { profesor: true },
    })
    return NextResponse.json(clase, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear clase' }, { status: 500 })
  }
}
