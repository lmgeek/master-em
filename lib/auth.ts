import { sign, verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_por_una_clave_secreta_en_produccion'
const JWT_EXPIRES_IN = '7d'

export interface TokenPayload {
  userId: number
  email: string
  rol: string
}

export function generarToken(payload: TokenPayload): string {
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verificarToken(token: string): TokenPayload | null {
  try {
    return verify(token, JWT_SECRET) as TokenPayload
  } catch (error) {
    if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
      return null
    }
    return null
  }
}

export function obtenerTokenDeCookies(): string | null {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  return token || null
}

export async function obtenerUsuarioAutenticado(): Promise<{
  id: number
  nombre: string
  email: string
  rol: string
} | null> {
  const token = obtenerTokenDeCookies()
  if (!token) return null

  const payload = verificarToken(token)
  if (!payload) return null

  const usuario = await prisma.usuario.findUnique({
    where: { id: payload.userId },
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
  })

  if (!usuario || !usuario.activo) return null

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  }
}

export function setTokenCookie(token: string): void {
  // Se usa en Server Actions o API routes con Response
}
