import { BooksDashboard } from "@/features/books/components/books-dashboard";
import { listBooks } from "@/core/db/books-store";
import type { Book } from "@/features/books/types";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default async function Home() {
  let initialBooks: Book[] = [];

  try {
    initialBooks = await listBooks();
  } catch {
    initialBooks = [];
  }

  return (
    <div className="relative min-h-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-top bg-repeat-y [background-size:1600px_auto] opacity-70 saturate-125 dark:opacity-80"
        style={{ backgroundImage: "var(--library-bg-image)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.1),_transparent_45%),linear-gradient(to_bottom,_rgba(241,245,249,0.42),_rgba(226,232,240,0.48))] dark:bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_45%),linear-gradient(to_bottom,_rgba(11,16,32,0.40),_rgba(17,27,53,0.48))]"
      />
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
        <header className="rounded-3xl border border-slate-700/60 bg-slate-900/60 p-5 shadow-xl backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-booktracker.svg"
                alt="BookTracker logo"
                width={52}
                height={52}
                className="h-12 w-12 rounded-2xl shadow-lg"
              />
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.25em] text-indigo-300">BookTracker</p>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-100 md:text-3xl">
                  Tu biblioteca cozy
                </h1>
                <p className="text-sm text-slate-300">
                  Registra, organiza y disfruta cada lectura con un panel claro y agradable.
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <BooksDashboard initialBooks={initialBooks} />
      </main>
    </div>
  );
}
