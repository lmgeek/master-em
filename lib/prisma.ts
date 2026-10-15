import { PrismaClient } from '@prisma/client'

// ⚠️ FALLBACK DIRECTO: Si la variable de entorno no está configurada,
// se usan los datos de conexión de Supabase directamente.
// Solo para evitar errores de despliegue. En producción se recomienda
// configurar DATABASE_URL en el dashboard de Vercel.
const DATABASE_URL_FALLBACK =
  'postgres://postgres.rkvsejzgeqneprkadhri:C5CgCzN908ZRh2dI@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true'

const DATABASE_URL = process.env.DATABASE_URL || DATABASE_URL_FALLBACK

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
