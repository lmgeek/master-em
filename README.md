# Sistema de Facturación - Escuela de Música

Sistema web para gestión de alumnos, profesores, horarios, pagos, asistencias y reportes de cierre mensual.
Desplegado en **Vercel** con **Vercel Postgres** (plan gratuito).

## Stack

- **Framework:** Next.js 14 (App Router)
- **Base de datos:** PostgreSQL (Vercel Postgres, plan gratuito)
- **ORM:** Prisma
- **Estilos:** Tailwind CSS
- **Gestor de paquetes:** pnpm
- **PDF:** pdfkit (comprobantes de pago)

## Estructura del proyecto

```
app/
  page.tsx                      # Dashboard principal
  alumnos/page.tsx              # ABM de alumnos
  profesores/page.tsx           # ABM de profesores
  horarios/page.tsx             # ABM de clases + plancha horaria
  pagos/page.tsx                # Registro de pagos y comprobantes
  asistencias/page.tsx          # Control de asistencia
  reportes/page.tsx             # Reporte Ingresos y Egresos mensual
  api/
    alumnos/route.ts            # GET, POST
    alumnos/[id]/route.ts       # GET, PUT, DELETE
    profesores/route.ts
    profesores/[id]/route.ts
    clases/route.ts
    clases/[id]/route.ts
    inscripciones/route.ts
    pagos/route.ts
    pagos/[id]/route.ts
    pagos/generar-comprobante/route.ts
    asistencias/route.ts
    pagos-profesores/route.ts
    pagos-profesores/[id]/route.ts
    reportes/ingresos-egresos/route.ts
prisma/
  schema.prisma                 # Modelo de datos PostgreSQL
lib/
  prisma.ts                     # Cliente Prisma singleton
```

## Modelos de datos (PostgreSQL)

- **Alumno:** nombre, apellido, email, teléfono, instrumento, nivel, activo
- **Profesor:** nombre, apellido, email, instrumento (Canto/Guitarra/Bajo/Batería/Piano/Ukelele), % comisión, activo
- **ClaseHorario:** profesor, instrumento, día, hora inicio/fin, aula, capacidad, activo
- **Inscripcion:** alumno ↔ clase, mensualidad, activo
- **Pago:** alumno, concepto, monto, fecha, método, estado (pendiente/pagado/anulado), comprobante
- **Asistencia:** inscripción, clase, fecha, presente, observaciones
- **PagoProfesor:** profesor, mes, año, cantidad alumnos, monto base, comisión, total, estado
- **Configuracion:** clave/valor (nombre escuela, dirección, etc.)

## Instalación y desarrollo local

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env y colocar la DATABASE_URL de Vercel Postgres

# 3. Generar cliente Prisma
pnpm prisma:generate

# 4. Ejecutar migraciones (requiere base de datos conectada)
pnpm prisma:migrate

# 5. Iniciar servidor de desarrollo
pnpm dev
```

La app correrá en `http://localhost:3000`.

## Despliegue en Vercel

1. Subir el código a un repositorio Git (GitHub/GitLab).
2. Conectar el repositorio a Vercel.
3. En Vercel Dashboard → **Storage** → **Create Database** → **Vercel Postgres** (plan gratuito).
4. Vercel inyecta automáticamente la variable `DATABASE_URL`.
5. Añadir las restantes variables de entorno en Project Settings → Environment Variables.
6. En el build de Vercel, ejecutar migraciones:
   ```bash
   pnpm prisma:deploy
   ```
7. Vercel desplegará automáticamente en cada push.

### Notas para producción

- **No usar SQLite:** el filesystem de Vercel es efímero y de solo lectura. Usar Vercel Postgres obligatoriamente.
- **Comprobantes PDF:** se generan en memoria (pdfkit). No se guardan en disco local. En producción, subir a Vercel Blob o enviar por email.
- **Conexiones serverless:** Vercel Postgres incluye connection pooling, ideal para funciones serverless.

## Comandos pnpm

```bash
pnpm dev             # Servidor de desarrollo
pnpm build           # Build de producción
pnpm start           # Servidor de producción
pnpm prisma:generate # Generar cliente Prisma
pnpm prisma:migrate  # Migraciones en desarrollo
pnpm prisma:deploy   # Migraciones en producción (Vercel)
pnpm prisma:studio   # Interfaz visual de la base de datos
```
