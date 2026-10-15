import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const clase = await prisma.claseHorario.update({
      where: { id: Number(params.id) },
      data: {
        profesorId: body.profesorId ? Number(body.profesorId) : undefined,
        instrumento: body.instrumento,
        diaSemana: body.diaSemana,
        horaInicio: body.horaInicio,
        horaFin: body.horaFin,
        aula: body.aula || null,
        capacidad: body.capacidad ? Number(body.capacidad) : undefined,
        activo: body.activo ?? true,
      },
      include: { profesor: true },
    })
    return NextResponse.json(clase)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar clase' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.claseHorario.update({
      where: { id: Number(params.id) },
      data: { activo: false },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar clase' }, { status: 500 })
  }
}
