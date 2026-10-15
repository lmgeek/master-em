import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pagos = await prisma.pagoProfesor.findMany({
      orderBy: [{ anio: 'desc' }, { mes: 'desc' }],
      include: { profesor: true },
    })
    return NextResponse.json(pagos)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener pagos a profesores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const pago = await prisma.pagoProfesor.create({
      data: {
        profesorId: Number(body.profesorId),
        mes: Number(body.mes),
        anio: Number(body.anio),
        cantidadAlumnos: Number(body.cantidadAlumnos),
        montoBase: Number(body.montoBase),
        comision: Number(body.comision),
        total: Number(body.total),
        estado: body.estado || 'pendiente',
      },
      include: { profesor: true },
    })
    return NextResponse.json(pago, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear pago a profesor' }, { status: 500 })
  }
}
