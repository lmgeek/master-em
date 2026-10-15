import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import PDFDocument from 'pdfkit'

export async function POST(request: Request) {
  try {
    const { pagoId } = await request.json()

    const pago = await prisma.pago.findUnique({
      where: { id: Number(pagoId) },
      include: { alumno: true },
    })

    if (!pago) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    // Generar PDF en memoria
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => chunks.push(chunk))

    // Encabezado
    doc.fontSize(20).font('Helvetica-Bold').text('ESCUELA DE MÚSICA', { align: 'center' })
    doc.fontSize(12).font('Helvetica').text('Comprobante de Pago', { align: 'center' })
    doc.moveDown()
    doc.fontSize(10).text(`Nº Comprobante: ${pago.numeroComprobante || pago.id}`, { align: 'right' })
    doc.text(`Fecha: ${new Date(pago.fecha).toLocaleDateString('es-AR')}`, { align: 'right' })
    doc.moveDown()

    // Datos del alumno
    doc.fontSize(12).font('Helvetica-Bold').text('Datos del Alumno')
    doc.fontSize(10).font('Helvetica')
    doc.text(`Nombre: ${pago.alumno.nombre} ${pago.alumno.apellido}`)
    doc.text(`Email: ${pago.alumno.email}`)
    doc.moveDown()

    // Detalle del pago
    doc.fontSize(12).font('Helvetica-Bold').text('Detalle del Pago')
    doc.fontSize(10).font('Helvetica')
    doc.text(`Concepto: ${pago.concepto}`)
    doc.text(`Monto: $${Number(pago.monto).toFixed(2)}`)
    doc.text(`Método de pago: ${pago.metodoPago}`)
    doc.text(`Estado: ${pago.estado}`)
    doc.moveDown()

    // Pie
    doc.fontSize(8).font('Helvetica-Oblique').text('Gracias por su pago.', { align: 'center' })

    doc.end()

    const pdfBuffer = Buffer.concat(chunks)

    // Nota: En producción con Vercel, subir este PDF a Vercel Blob o enviarlo por email.
    // Aquí lo devolvemos como base64 para que el cliente lo pueda descargar o previsualizar.
    const base64 = pdfBuffer.toString('base64')

    return NextResponse.json({
      ok: true,
      mensaje: 'Comprobante generado',
      archivo: `data:application/pdf;base64,${base64}`,
      nombre: `comprobante_${pago.id}.pdf`,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error al generar comprobante' }, { status: 500 })
  }
}
