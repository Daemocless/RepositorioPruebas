# Mejora UI: estilo cozy en dashboard

## Objetivo

Aplicar una estetica mas calida y acogedora al dashboard de libros para mejorar la experiencia visual sin alterar la funcionalidad.

## Cambios aplicados

- Archivo actualizado: `features/books/components/books-dashboard.tsx`
  - Paleta visual cambiada a tonos calidos (`amber`, `orange`, `rose`).
  - Tarjetas del formulario y listado con bordes suaves, fondos degradados y sombras ligeras.
  - Inputs, textarea y botones con estilo consistente y foco visual mas claro.
  - Badge de estado por libro con color semantico (`pendiente`, `leyendo`, `leido`).
  - Barra de progreso ajustada al nuevo estilo.
  - Botones de accion (`Editar`/`Eliminar`) con contraste y decoracion mas amigable.
- Archivo actualizado: `app/page.tsx`
  - Fondo general de pagina en degradado calido.
  - Ajuste de color del texto en cabecera para mantener legibilidad.

## Impacto

- No cambia el modelo de datos ni APIs.
- Mejora de apariencia visual manteniendo la estructura actual del proyecto y el flujo de uso.
