import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pagos = await prisma.pago.findMany({
      orderBy: { fecha: 'desc' },
      include: {
        alumno: true,
        inscripcion: { include: { claseHorario: { include: { profesor: true } } } },
      },
    })
    return NextResponse.json(pagos)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const pago = await prisma.pago.create({
      data: {
        alumnoId: Number(body.alumnoId),
        inscripcionId: body.inscripcionId ? Number(body.inscripcionId) : null,
        concepto: body.concepto,
        monto: Number(body.monto),
        fecha: body.fecha ? new Date(body.fecha) : new Date(),
        metodoPago: body.metodoPago,
        estado: body.estado || 'pagado',
        numeroComprobante: body.numeroComprobante || null,
        comprobanteUrl: body.comprobanteUrl || null,
      },
      include: { alumno: true },
    })
    return NextResponse.json(pago, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear pago' }, { status: 500 })
  }
}
