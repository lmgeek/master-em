import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profesor = await prisma.profesor.findUnique({
      where: { id: Number(params.id) },
      include: {
        clases: { where: { activo: true }, orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }] },
      },
    })
    if (!profesor) {
      return NextResponse.json({ error: 'Profesor no encontrado' }, { status: 404 })
    }
    return NextResponse.json(profesor)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener profesor' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const profesor = await prisma.profesor.update({
      where: { id: Number(params.id) },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        telefono: body.telefono || null,
        instrumento: body.instrumento,
        porcentajeComision: body.porcentajeComision ? Number(body.porcentajeComision) : 0,
        activo: body.activo ?? true,
      },
    })
    return NextResponse.json(profesor)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar profesor' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.profesor.update({
      where: { id: Number(params.id) },
      data: { activo: false },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar profesor' }, { status: 500 })
  }
}
