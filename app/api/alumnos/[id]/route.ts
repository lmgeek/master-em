import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const alumno = await prisma.alumno.findUnique({
      where: { id: Number(params.id) },
      include: {
        inscripciones: {
          include: { claseHorario: { include: { profesor: true } } },
        },
        pagos: true,
      },
    })
    if (!alumno) {
      return NextResponse.json({ error: 'Alumno no encontrado' }, { status: 404 })
    }
    return NextResponse.json(alumno)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener alumno' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const alumno = await prisma.alumno.update({
      where: { id: Number(params.id) },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        telefono: body.telefono || null,
        instrumento: body.instrumento || null,
        nivel: body.nivel || null,
        activo: body.activo ?? true,
      },
    })
    return NextResponse.json(alumno)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar alumno' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.alumno.update({
      where: { id: Number(params.id) },
      data: { activo: false },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar alumno' }, { status: 500 })
  }
}
