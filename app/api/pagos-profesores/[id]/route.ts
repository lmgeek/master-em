import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const pago = await prisma.pagoProfesor.update({
      where: { id: Number(params.id) },
      data: {
        estado: body.estado,
        fechaPago: body.fechaPago ? new Date(body.fechaPago) : null,
      },
      include: { profesor: true },
    })
    return NextResponse.json(pago)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar pago a profesor' }, { status: 500 })
  }
}
