import { z } from "zod";

import { BOOK_STATUSES } from "./types";

const optionalNullableString = z.preprocess(
  (value) => (value === null ? undefined : value),
  z
    .string()
    .trim()
    .optional()
    .transform((text) => (text ? text : null)),
);

export const bookInputSchema = z.object({
  titulo: z.string().trim().min(1, "El titulo es obligatorio."),
  autor: z.string().trim().min(1, "El autor es obligatorio."),
  genero: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
  estado: z.enum(BOOK_STATUSES),
  valoracion: z.coerce.number().int().min(1).max(5).optional().nullable(),
  total_paginas: z.coerce.number().int().positive().optional().nullable(),
  paginas_leidas: z.coerce.number().int().min(0).optional().nullable(),
  fecha_compra: optionalNullableString,
  fecha_inicio: optionalNullableString,
  fecha_fin: optionalNullableString,
  notas: z.preprocess(
    (value) => (value === null ? undefined : value),
    z
      .string()
      .trim()
      .max(1200, "Las notas no pueden superar 1200 caracteres.")
      .optional()
      .transform((value) => (value ? value : null)),
  ),
});

export type BookInput = z.infer<typeof bookInputSchema>;
