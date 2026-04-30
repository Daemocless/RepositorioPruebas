# Arquitectura de la app de libros

## Stack tecnico

- Next.js 16 (App Router)
- TypeScript
- TailwindCSS 4
- Radix UI (Select)
- PostgreSQL con `pg`
- Zod para validacion

## Estructura del proyecto

- `app/`: rutas y API handlers de Next.js.
- `features/books/`: dominio funcional de libros (tipos, validaciones, componentes).
- `core/`: utilidades transversales (conexion y helpers).
- `components/ui/`: componentes de UI reutilizables con Radix/Tailwind.
- `basedatos/`: scripts SQL de creacion y soporte.
- `docs/`: documentacion para mantenimiento y evolucion.

## Flujo funcional

1. El dashboard en `app/page.tsx` monta `BooksDashboard`.
2. `BooksDashboard` consume `GET /api/books`.
3. Crear y editar usa `POST /api/books` y `PATCH /api/books/:id`.
4. Eliminar usa `DELETE /api/books/:id`.
5. Los handlers validan entrada con Zod y persisten en PostgreSQL.
6. En cliente hay filtro por estado, busqueda por texto (`titulo`, `autor`, `genero`) y ordenacion.

## Consideraciones

- No hay login (single-user local).
- Los estados permitidos son `pendiente`, `leyendo`, `leido`.
- Si `DATABASE_URL` existe, persiste en PostgreSQL.
- Hay script de datos de ejemplo en `basedatos/seed.sql`.
- El formulario muestra mensajes de error de API/validacion para facilitar diagnostico.
- Si `DATABASE_URL` no esta definida, la app usa almacenamiento local en `basedatos/local-books.json` para no bloquear el uso en desarrollo.
