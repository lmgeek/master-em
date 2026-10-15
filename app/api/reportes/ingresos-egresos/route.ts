import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mes = searchParams.get('mes') ? Number(searchParams.get('mes')) : new Date().getMonth() + 1
    const anio = searchParams.get('anio') ? Number(searchParams.get('anio')) : new Date().getFullYear()

    const inicio = new Date(anio, mes - 1, 1)
    const fin = new Date(anio, mes, 0, 23, 59, 59)

    const pagos = await prisma.pago.findMany({
      where: {
        estado: 'pagado',
        fecha: { gte: inicio, lte: fin },
      },
    })

    const ingresos = pagos.reduce((acc: number, p: any) => acc + Number(p.monto), 0)

    const pagosProfesores = await prisma.pagoProfesor.findMany({
      where: { mes, anio, estado: 'pagado' },
    })

    const egresos = pagosProfesores.reduce((acc: number, p: any) => acc + Number(p.total), 0)

    return NextResponse.json({
      mes,
      anio,
      ingresos,
      egresos,
      saldo: ingresos - egresos,
      detallePagos: pagos,
      detallePagosProfesores: pagosProfesores,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al generar reporte' }, { status: 500 })
  }
}
