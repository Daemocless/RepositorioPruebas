# Modelo de datos: books

Tabla principal: `books`

## Campos

- `id (uuid)`: identificador unico.
- `titulo (text)`: titulo del libro.
- `autor (text)`: autor del libro.
- `genero (text|null)`: genero literario.
- `estado (text)`: `pendiente | leyendo | leido`.
- `valoracion (int|null)`: valor entre 1 y 5.
- `total_paginas (int|null)`: total de paginas.
- `paginas_leidas (int|null)`: progreso de lectura.
- `fecha_compra (date|null)`: fecha de adquisicion.
- `fecha_inicio (date|null)`: inicio de lectura.
- `fecha_fin (date|null)`: fin de lectura.
- `notas (text|null)`: comentarios personales.
- `created_at (timestamptz)`: fecha de creacion.
- `updated_at (timestamptz)`: fecha de actualizacion.

## Reglas de negocio actuales

- `titulo` y `autor` son obligatorios.
- `estado` solo permite 3 valores controlados.
- `valoracion` se limita a 1-5.
- `total_paginas` debe ser mayor a 0 cuando existe.
- `paginas_leidas` no puede ser negativa.
- Se soporta busqueda textual por `titulo`, `autor` y `genero` en el dashboard.
- Se soporta ordenacion por fecha de alta, titulo y valoracion.

## Mejoras futuras sugeridas

- Validar que `paginas_leidas <= total_paginas`.
- Derivar fechas segun cambios de estado.
- Agregar tabla de historico de lecturas por libro.
