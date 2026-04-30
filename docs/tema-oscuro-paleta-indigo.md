# Actualizacion visual: tema oscuro

## Objetivo

Cambiar la paleta cozy clara por una paleta de tema oscuro mas moderna y con acentos indigo.

## Cambios aplicados

- Archivo actualizado: `app/page.tsx`
  - Fondo global en degradado oscuro (`slate` + `indigo`).
  - Textos de cabecera ajustados para contraste.
- Archivo actualizado: `features/books/components/books-dashboard.tsx`
  - Formularios y tarjetas migrados a estilos oscuros.
  - Inputs y textarea con foco en tono indigo.
  - Boton principal en indigo y secundarios en escala `slate`.
  - Badges de estado adaptados a modo oscuro con contraste adecuado.
  - Estadisticas, barra de progreso y notas alineadas con la nueva paleta.

## Impacto

- No hay cambios en API, esquema de datos ni logica funcional.
- Cambio 100% visual para mejorar legibilidad nocturna y coherencia del tema oscuro.

## Ajuste de legibilidad

- Se adapto `components/ui/select.tsx` al tema oscuro para evitar dropdowns en fondo claro:
  - Trigger, panel e items ahora usan escala `slate` con texto claro.
  - Estados de foco y seleccion usan acentos `indigo` con buen contraste.
- Mensajes de error del formulario ajustados a tono `rose` claro para mejor lectura sobre fondos oscuros.
