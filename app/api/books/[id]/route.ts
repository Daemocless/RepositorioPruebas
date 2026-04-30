import { NextResponse } from "next/server";

import { deleteBook, updateBook } from "@/core/db/books-store";
import { bookInputSchema } from "@/features/books/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const parsed = bookInputSchema.parse(payload);
    const book = await updateBook(id, parsed);
    if (!book) {
      return NextResponse.json({ error: "Libro no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ book });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error actualizando libro." },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteBook(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error eliminando libro." },
      { status: 400 },
    );
  }
}
