import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const asistencia = await prisma.asistencia.update({
      where: { id: Number(params.id) },
      data: {
        presente: body.presente,
        observaciones: body.observaciones || null,
      },
      include: { inscripcion: { include: { alumno: true } } },
    })
    return NextResponse.json(asistencia)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar asistencia' }, { status: 500 })
  }
}
