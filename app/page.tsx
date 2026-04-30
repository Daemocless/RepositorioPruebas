import { BooksDashboard } from "@/features/books/components/books-dashboard";
import { listBooks } from "@/core/db/books-store";
import type { Book } from "@/features/books/types";

export default async function Home() {
  let initialBooks: Book[] = [];

  try {
    initialBooks = await listBooks();
  } catch {
    initialBooks = [];
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Mi Biblioteca</h1>
          <p className="text-sm text-slate-300">
            Lleva control de tus libros, lo que ya leiste y lo que te falta.
          </p>
        </header>
        <BooksDashboard initialBooks={initialBooks} />
      </main>
    </div>
  );
}
