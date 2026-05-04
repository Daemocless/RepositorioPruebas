"use client";

import { useMemo, useState } from "react";

import { AppSelect } from "@/components/ui/select";
import { toInputDate } from "@/core/lib/date";
import { BOOK_STATUSES, type Book, type BookStatus } from "@/features/books/types";

const statusLabels: Record<BookStatus, string> = {
  pendiente: "Pendiente",
  leyendo: "Leyendo",
  leido: "Leido",
};

const statusStyles: Record<BookStatus, string> = {
  pendiente: "border border-slate-300 bg-slate-200 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  leyendo:
    "border border-indigo-300 bg-indigo-100 text-indigo-700 dark:border-indigo-700/70 dark:bg-indigo-900/50 dark:text-indigo-200",
  leido:
    "border border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-700/70 dark:bg-emerald-900/40 dark:text-emerald-200",
};

const fullDateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});

const shortDateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
});

const initialForm = {
  titulo: "",
  autor: "",
  genero: "",
  estado: "pendiente",
  valoracion: "",
  total_paginas: "",
  paginas_leidas: "",
  fecha_inicio: "",
  fecha_fin: "",
  notas: "",
};

type FormState = typeof initialForm;

export function BooksDashboard({ initialBooks }: { initialBooks: Book[] }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("creado_desc");
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadBooks() {
    setLoading(true);
    try {
      const response = await fetch("/api/books", { cache: "no-store" });
      const data = await response.json();
      setBooks(data.books ?? []);
    } finally {
      setLoading(false);
    }
  }

  const visibleBooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const byFilter =
      filter === "todos" ? books : books.filter((book) => book.estado === filter);

    const bySearch = normalizedSearch
      ? byFilter.filter((book) => {
          return [book.titulo, book.autor, book.genero ?? ""]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);
        })
      : byFilter;

    return [...bySearch].sort((a, b) => {
      switch (sortBy) {
        case "titulo_asc":
          return a.titulo.localeCompare(b.titulo, "es");
        case "titulo_desc":
          return b.titulo.localeCompare(a.titulo, "es");
        case "valoracion_desc":
          return (b.valoracion ?? 0) - (a.valoracion ?? 0);
        case "valoracion_asc":
          return (a.valoracion ?? 0) - (b.valoracion ?? 0);
        case "creado_asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "creado_desc":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [books, filter, search, sortBy]);

  const stats = useMemo(
    () => ({
      total: books.length,
      leidos: books.filter((book) => book.estado === "leido").length,
      leyendo: books.filter((book) => book.estado === "leyendo").length,
      pendientes: books.filter((book) => book.estado === "pendiente").length,
    }),
    [books],
  );

  function hydrateForm(book: Book) {
    setForm({
      titulo: book.titulo,
      autor: book.autor,
      genero: book.genero ?? "",
      estado: book.estado,
      valoracion: book.valoracion?.toString() ?? "",
      total_paginas: book.total_paginas?.toString() ?? "",
      paginas_leidas: book.paginas_leidas?.toString() ?? "",
      fecha_inicio: toInputDate(book.fecha_inicio),
      fecha_fin: toInputDate(book.fecha_fin),
      notas: book.notas ?? "",
    });
    setEditingId(book.id);
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const payload = {
      ...form,
      valoracion: form.valoracion ? Number(form.valoracion) : null,
      total_paginas: form.total_paginas ? Number(form.total_paginas) : null,
      paginas_leidas: form.paginas_leidas ? Number(form.paginas_leidas) : null,
    };

    const response = await fetch(editingId ? `/api/books/${editingId}` : "/api/books", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      await loadBooks();
      resetForm();
      return;
    }

    const data = await response.json().catch(() => ({ error: "No se pudo guardar el libro." }));
    setSubmitError(data.error ?? "No se pudo guardar el libro.");
  }

  async function deleteBook(id: string) {
    const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (response.ok) {
      await loadBooks();
      if (editingId === id) {
        resetForm();
      }
    }
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <article className="space-y-4 rounded-2xl border border-slate-300 bg-white/90 p-5 shadow-lg lg:col-span-5 dark:border-slate-700 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-800/80">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{editingId ? "Editar libro" : "Nuevo libro"}</h2>
        <form className="grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
          <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" placeholder="Titulo" value={form.titulo} onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))} required />
          <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" placeholder="Autor" value={form.autor} onChange={(event) => setForm((prev) => ({ ...prev, autor: event.target.value }))} required />
          <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" placeholder="Genero" value={form.genero} onChange={(event) => setForm((prev) => ({ ...prev, genero: event.target.value }))} />
          <AppSelect
            value={form.estado}
            onValueChange={(value) => setForm((prev) => ({ ...prev, estado: value }))}
            options={BOOK_STATUSES.map((status) => ({ value: status, label: statusLabels[status] }))}
          />
          <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" placeholder="Valoracion (1-5)" type="number" min={1} max={5} value={form.valoracion} onChange={(event) => setForm((prev) => ({ ...prev, valoracion: event.target.value }))} />
          <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" placeholder="Total paginas" type="number" min={1} value={form.total_paginas} onChange={(event) => setForm((prev) => ({ ...prev, total_paginas: event.target.value }))} />
          <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" placeholder="Paginas leidas" type="number" min={0} value={form.paginas_leidas} onChange={(event) => setForm((prev) => ({ ...prev, paginas_leidas: event.target.value }))} />
          <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
            <span>Fecha de inicio</span>
            <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" type="date" value={form.fecha_inicio} onChange={(event) => setForm((prev) => ({ ...prev, fecha_inicio: event.target.value }))} />
          </label>
          <label className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
            <span>Fecha de fin</span>
            <input className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" type="date" value={form.fecha_fin} onChange={(event) => setForm((prev) => ({ ...prev, fecha_fin: event.target.value }))} />
          </label>
          <textarea className="min-h-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100" placeholder="Notas" value={form.notas} onChange={(event) => setForm((prev) => ({ ...prev, notas: event.target.value }))} />
          <div className="flex gap-2">
            <button className="h-10 flex-1 rounded-xl bg-indigo-600 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500" type="submit">
              {editingId ? "Guardar cambios" : "Agregar libro"}
            </button>
            {editingId && (
              <button className="h-10 rounded-xl border border-slate-300 bg-slate-100 px-3 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-800" type="button" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
          {submitError && <p className="text-sm text-rose-300">{submitError}</p>}
        </form>
      </article>

      <article className="space-y-4 rounded-2xl border border-slate-300 bg-white/85 p-5 shadow-lg lg:col-span-7 dark:border-slate-700 dark:bg-slate-900/60">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Total" value={stats.total} />
          <Stat label="Leidos" value={stats.leidos} />
          <Stat label="Leyendo" value={stats.leyendo} />
          <Stat label="Pendientes" value={stats.pendientes} />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 md:col-span-2 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100"
            placeholder="Buscar por titulo, autor o genero"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <AppSelect
            value={sortBy}
            onValueChange={setSortBy}
            options={[
              { value: "creado_desc", label: "Mas recientes" },
              { value: "creado_asc", label: "Mas antiguos" },
              { value: "titulo_asc", label: "Titulo A-Z" },
              { value: "titulo_desc", label: "Titulo Z-A" },
              { value: "valoracion_desc", label: "Mejor valorados" },
              { value: "valoracion_asc", label: "Menor valoracion" },
            ]}
          />
          <div className="md:col-span-3 md:max-w-xs">
            <AppSelect
              value={filter}
              onValueChange={setFilter}
              options={[
                { value: "todos", label: "Todos los estados" },
                ...BOOK_STATUSES.map((status) => ({ value: status, label: statusLabels[status] })),
              ]}
            />
          </div>
        </div>

        <div className="space-y-2">
          {loading && <p className="text-sm text-slate-500 dark:text-slate-300">Cargando libros...</p>}
          {!loading && visibleBooks.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-300">No hay libros para ese criterio de busqueda.</p>
          )}
          {visibleBooks.map((book) => (
            <article key={book.id} className="rounded-2xl border border-slate-300 bg-gradient-to-br from-white to-slate-100 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{book.titulo}</h3>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyles[book.estado]}`}>
                      {statusLabels[book.estado]}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{book.autor}</p>
                  <div className="grid gap-1 text-xs text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                    <p>Genero: {book.genero ?? "-"}</p>
                    <p>Valoracion: {book.valoracion ? `${book.valoracion}/5` : "-"}</p>
                    <p>
                      Paginas: {book.paginas_leidas ?? 0}
                      {book.total_paginas ? ` / ${book.total_paginas}` : ""}
                    </p>
                    <p>Inicio: {formatDate(book.fecha_inicio)}</p>
                    <p>Fin: {formatDate(book.fecha_fin)}</p>
                  </div>
                  {book.total_paginas && (
                    <div className="space-y-1">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-300 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(((book.paginas_leidas ?? 0) / book.total_paginas) * 100),
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Progreso:{" "}
                        {Math.min(
                          100,
                          Math.round(((book.paginas_leidas ?? 0) / book.total_paginas) * 100),
                        )}
                        %
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Creado: {formatDate(book.created_at, true)} | Actualizado:{" "}
                    {formatDate(book.updated_at, true)}
                  </p>
                  {book.notas && (
                    <p className="rounded-lg border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Nota: {book.notas}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md px-2 py-1 text-sm text-indigo-300 underline decoration-indigo-400 underline-offset-2 hover:text-indigo-200" onClick={() => hydrateForm(book)} type="button">
                    Editar
                  </button>
                  <button className="rounded-md px-2 py-1 text-sm text-rose-300 underline decoration-rose-400 underline-offset-2 hover:text-rose-200" onClick={() => deleteBook(book.id)} type="button">
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-2xl font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function formatDate(value: string | null, withTime = false) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return withTime ? fullDateFormatter.format(date) : shortDateFormatter.format(date);
}
