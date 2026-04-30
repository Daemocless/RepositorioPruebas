import { NextResponse } from "next/server";

import { createBook, listBooks } from "@/core/db/books-store";
import { bookInputSchema } from "@/features/books/schema";

export async function GET() {
  try {
    const books = await listBooks();
    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error cargando libros." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = bookInputSchema.parse(payload);
    const book = await createBook(parsed);
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error creando libro." },
      { status: 400 },
    );
  }
}
