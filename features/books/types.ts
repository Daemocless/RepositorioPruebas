export const BOOK_STATUSES = ["pendiente", "leyendo", "leido"] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  genero: string | null;
  estado: BookStatus;
  valoracion: number | null;
  total_paginas: number | null;
  paginas_leidas: number | null;
  fecha_compra: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  notas: string | null;
  created_at: string;
  updated_at: string;
}
