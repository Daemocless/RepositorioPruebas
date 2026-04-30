import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

import type { Book } from "@/features/books/types";
import type { BookInput } from "@/features/books/schema";

import { getPool } from "./postgres";

const localDataPath = path.join(process.cwd(), "basedatos", "local-books.json");

async function readLocalBooks() {
  try {
    const raw = await fs.readFile(localDataPath, "utf-8");
    const parsed = JSON.parse(raw) as Book[];
    return parsed;
  } catch {
    return [];
  }
}

async function writeLocalBooks(books: Book[]) {
  await fs.mkdir(path.dirname(localDataPath), { recursive: true });
  await fs.writeFile(localDataPath, JSON.stringify(books, null, 2), "utf-8");
}

function toBookFromInput(input: BookInput): Omit<Book, "id" | "created_at" | "updated_at"> {
  return {
    titulo: input.titulo,
    autor: input.autor,
    genero: input.genero,
    estado: input.estado,
    valoracion: input.valoracion ?? null,
    total_paginas: input.total_paginas ?? null,
    paginas_leidas: input.paginas_leidas ?? null,
    fecha_compra: input.fecha_compra,
    fecha_inicio: input.fecha_inicio,
    fecha_fin: input.fecha_fin,
    notas: input.notas,
  };
}

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function listBooks() {
  if (hasDatabase()) {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM books ORDER BY created_at DESC");
    return result.rows as Book[];
  }

  const books = await readLocalBooks();
  return books.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function createBook(input: BookInput) {
  if (hasDatabase()) {
    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO books (
        titulo, autor, genero, estado, valoracion, total_paginas, paginas_leidas, fecha_compra, fecha_inicio, fecha_fin, notas
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      ) RETURNING *`,
      [
        input.titulo,
        input.autor,
        input.genero,
        input.estado,
        input.valoracion ?? null,
        input.total_paginas ?? null,
        input.paginas_leidas ?? null,
        input.fecha_compra,
        input.fecha_inicio,
        input.fecha_fin,
        input.notas,
      ],
    );
    return result.rows[0] as Book;
  }

  const now = new Date().toISOString();
  const books = await readLocalBooks();
  const book: Book = {
    id: randomUUID(),
    ...toBookFromInput(input),
    created_at: now,
    updated_at: now,
  };
  books.push(book);
  await writeLocalBooks(books);
  return book;
}

export async function updateBook(id: string, input: BookInput) {
  if (hasDatabase()) {
    const pool = getPool();
    const result = await pool.query(
      `UPDATE books SET
        titulo = $1,
        autor = $2,
        genero = $3,
        estado = $4,
        valoracion = $5,
        total_paginas = $6,
        paginas_leidas = $7,
        fecha_compra = $8,
        fecha_inicio = $9,
        fecha_fin = $10,
        notas = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *`,
      [
        input.titulo,
        input.autor,
        input.genero,
        input.estado,
        input.valoracion ?? null,
        input.total_paginas ?? null,
        input.paginas_leidas ?? null,
        input.fecha_compra,
        input.fecha_inicio,
        input.fecha_fin,
        input.notas,
        id,
      ],
    );
    return result.rows[0] as Book | undefined;
  }

  const books = await readLocalBooks();
  const index = books.findIndex((book) => book.id === id);
  if (index < 0) {
    return undefined;
  }

  const updated: Book = {
    ...books[index],
    ...toBookFromInput(input),
    updated_at: new Date().toISOString(),
  };
  books[index] = updated;
  await writeLocalBooks(books);
  return updated;
}

export async function deleteBook(id: string) {
  if (hasDatabase()) {
    const pool = getPool();
    await pool.query("DELETE FROM books WHERE id = $1", [id]);
    return true;
  }

  const books = await readLocalBooks();
  const next = books.filter((book) => book.id !== id);
  if (next.length === books.length) {
    return false;
  }
  await writeLocalBooks(next);
  return true;
}
