# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

[Inferred from repository README and app routes.] Primary users are school administrators (director / secretaría) and teachers of a music school. Their main job: maintain the alumno/profesor registry, schedule classes (horarios), record monthly payments (pagos), track attendance (asistencias), and close monthly income/expense reports (reportes). Secondary audience: none confirmed.

## Product Purpose

Web system for managing a music school's administration and billing: students, teachers, class schedules, enrollments, payments with PDF receipts, attendance control, and monthly income/expense reporting. Success means staff can complete each of those tasks without errors, on desktop or mobile.

## Positioning

[Inferred.] A single-purpose school-management tool scoped to a music school's workflow (instrument, nivel, comisión por profesor, comprobante de pago) rather than a generic ERP. No competing claim verified.

## Operating Context

Workflows: registrar alumno → crear horario → inscribir alumno → registrar pago → marcar asistencia → reporte mensual. Environments: office desktop and mobile phone. Documents: comprobantes de pago (PDF via pdfkit), reportes de ingresos y egresos. Tools: browser, database (Vercel Postgres), Prisma ORM.

## Capabilities and Constraints

Confirmed functionality (from prisma/schema.prisma and app/ routes):
- CRUD: alumnos, profesores, clases/horarios, inscripciones, pagos, asistencias, pagos a profesores, reportes ingresos/egresos
- Auth: login/registro with JWT cookie, usuario model with rol and activo
- PDF comprobante generation (pdfkit) in memory
- Technical constraints: PostgreSQL only (Vercel filesystem ephemeral/read-only, no SQLite), Next.js 14 App Router, Tailwind CSS, server actions via fetch to /api/* routes
- Undecided: none identified

## Brand Commitments

Name: "Escuela de Música" (confirmed in README, layout metadata, Sidebar, TopBar, login page). Voice: institutional, Spanish (es-ES), clear labels. No logo or visual identity constraints confirmed beyond the name.

## Evidence on Hand

- README.md at project root (stack, routes, models, deploy notes)
- prisma/schema.prisma (data model)
- app/ and components/ (incumbent UI, modified but not committed)
- .env.example (DATABASE_URL, JWT_SECRET expected)

## Product Principles

1. Functional first: every screen must complete its task without errors.
2. Minimal: remove decoration that does not serve the task.
3. Spanish-language interface throughout.
4. Works on desktop and mobile.
5. No data loss: destructive actions (desactivar alumno, eliminar pago) require confirmation.

## Accessibility & Inclusion

[No product-specific requirement established beyond default Next.js/Tailwind accessibility: focus states, labels on inputs, semantic HTML.]
