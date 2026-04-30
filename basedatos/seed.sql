INSERT INTO books (
  titulo,
  autor,
  genero,
  estado,
  valoracion,
  total_paginas,
  paginas_leidas,
  fecha_compra,
  fecha_inicio,
  fecha_fin,
  notas
)
VALUES
  (
    'El nombre del viento',
    'Patrick Rothfuss',
    'Fantasia',
    'leyendo',
    5,
    880,
    420,
    '2026-01-10',
    '2026-04-15',
    NULL,
    'Lectura muy envolvente.'
  ),
  (
    'Sapiens',
    'Yuval Noah Harari',
    'Ensayo',
    'leido',
    4,
    496,
    496,
    '2025-12-20',
    '2026-01-05',
    '2026-02-12',
    'Muy recomendable para perspectiva historica.'
  ),
  (
    'Clean Code',
    'Robert C. Martin',
    'Tecnico',
    'pendiente',
    NULL,
    464,
    0,
    '2026-03-01',
    NULL,
    NULL,
    'Quiero leerlo para mejorar calidad de codigo.'
  ),
  (
    'Atomic Habits',
    'James Clear',
    'Desarrollo personal',
    'leido',
    5,
    320,
    320,
    '2025-11-02',
    '2025-11-10',
    '2025-11-28',
    NULL
  ),
  (
    'Dune',
    'Frank Herbert',
    'Ciencia ficcion',
    'pendiente',
    NULL,
    784,
    0,
    '2026-04-01',
    NULL,
    NULL,
    'Proxima lectura larga del anio.'
  );
