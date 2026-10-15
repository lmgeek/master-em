import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Rutas públicas que no requieren autenticación
  const rutasPublicas = ['/login', '/api/auth']
  const esRutaPublica = rutasPublicas.some((r) => pathname === r || pathname.startsWith(r))

  // Archivos estáticos y API de auth no necesitan protección
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next()
  }

  // Si no hay token y no es ruta pública, redirigir a login
  if (!token && !esRutaPublica) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si hay token y está en login, redirigir al dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
