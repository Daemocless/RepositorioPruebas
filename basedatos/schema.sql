CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  genero TEXT,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'leyendo', 'leido')),
  valoracion INTEGER CHECK (valoracion BETWEEN 1 AND 5),
  total_paginas INTEGER CHECK (total_paginas > 0),
  paginas_leidas INTEGER CHECK (paginas_leidas >= 0),
  fecha_compra DATE,
  fecha_inicio DATE,
  fecha_fin DATE,
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_estado ON books (estado);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books (created_at DESC);
