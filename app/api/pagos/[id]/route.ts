import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const pago = await prisma.pago.update({
      where: { id: Number(params.id) },
      data: {
        concepto: body.concepto,
        monto: body.monto ? Number(body.monto) : undefined,
        estado: body.estado,
        metodoPago: body.metodoPago,
      },
      include: { alumno: true },
    })
    return NextResponse.json(pago)
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar pago' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.pago.update({
      where: { id: Number(params.id) },
      data: { estado: 'anulado' },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al anular pago' }, { status: 500 })
  }
}
