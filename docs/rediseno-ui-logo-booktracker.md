# Rediseño UI + logo de BookTracker

## Objetivo

Mejorar la interfaz con estilo cozy, incorporar identidad visual de marca y permitir cambio manual de tema claro/oscuro.

## Cambios implementados

### 1) Branding

- Se añadió el logo en `public/logo-booktracker.svg`.
- Se actualizó la metadata de la app en `app/layout.tsx` para reflejar la nueva identidad.
- Se integró el logo y un encabezado más visual en `app/page.tsx`.

### 2) Tema oscuro/claro con switch

- Se creó `components/theme/theme-toggle.tsx` como componente cliente.
- El switch:
  - Lee preferencia guardada en `localStorage` (`booktracker-theme`).
  - Si no existe preferencia, usa la del sistema.
  - Aplica el tema a nivel de `html` mediante `data-theme`.
- En `app/layout.tsx` se define `data-theme="dark"` por defecto para una carga inicial consistente.

### 3) Sistema de colores global

- En `app/globals.css` se reemplazó el esquema basado solo en media query por variables según `data-theme`:
  - `[data-theme="dark"]`
  - `[data-theme="light"]`
- Se introdujo `--background-elevated` para dar profundidad a fondos y se dejó la tipografía base con Geist.

### 4) Refinamiento del dashboard

- Se mejoró el contraste para ambos temas en:
  - `features/books/components/books-dashboard.tsx`
  - `components/ui/select.tsx`
- Se mantuvo la estructura funcional existente (filtros, CRUD, estadísticas) y se ajustó solo el tratamiento visual.

### 5) Fondo temático de estanterías

- Se añadió `public/bookshelves-bg.svg` como ilustración de fondo con estanterías y libros.
- Se añadió `public/bookshelves-bg-light.svg` para el modo claro, con paleta cálida y decoración adicional.
- Se integró en `app/page.tsx` con dos capas:
  - Capa de imagen de fondo.
  - Capa de overlay para mantener legibilidad en tema claro/oscuro.
- La imagen de fondo ahora se resuelve por tema desde `app/globals.css` mediante `--library-bg-image`.
- El contenido principal se renderiza por encima (`z-10`) para asegurar contraste y lectura.

## Notas para siguientes iteraciones

- Se puede extraer un pequeño set de tokens de diseño (botones, cards, inputs) para reducir repetición de clases.
- Se puede añadir persistencia del tema en servidor/cookie para evitar cualquier posible desajuste inicial en cargas muy lentas.
