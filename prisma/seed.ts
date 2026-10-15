import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await hash('admin123', 10)

  // Usuario administrador por defecto
  await prisma.usuario.upsert({
    where: { email: 'admin@escuela.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@escuela.com',
      password: passwordHash,
      rol: 'ADMIN',
      activo: true,
    },
  })

  // Configuración básica de la escuela
  await prisma.configuracion.upsert({
    where: { clave: 'nombre_escuela' },
    update: {},
    create: { clave: 'nombre_escuela', valor: 'Escuela de Música' },
  })

  await prisma.configuracion.upsert({
    where: { clave: 'direccion' },
    update: {},
    create: { clave: 'direccion', valor: 'Dirección de la escuela' },
  })

  await prisma.configuracion.upsert({
    where: { clave: 'cuit' },
    update: {},
    create: { clave: 'cuit', valor: 'CUIT de la escuela' },
  })

  console.log('Seed completado. Usuario: admin@escuela.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
