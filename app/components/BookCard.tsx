"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

type Book = {
  _id: string;
  title: string;
  status: "planned" | "reading" | "completed";
  order: number;
  startedAt?: number;
  completedAt?: number;
};

export default function BookCard({
  book,
  dragHandleProps,
  dragging,
}: {
  book: Book;
  dragHandleProps?: { attributes?: any; listeners?: any };
  dragging?: boolean;
}) {
  const update = useMutation(api.books.update);
  const remove = useMutation(api.books.remove);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(book.title);

  const statusColor =
    book.status === "completed"
      ? "bg-emerald-600/10 text-emerald-900 dark:text-emerald-100 border border-emerald-500/20 hover:border-emerald-500/40"
      : book.status === "reading"
      ? "bg-sky-600/10 text-sky-900 dark:text-sky-100 border border-sky-500/20 hover:border-sky-500/40"
      : "bg-[var(--surface)] text-foreground border border-slate-200 dark:border-slate-800 hover:border-slate-600/40";

  return (
    <div
      className={`rounded-xl p-4 flex items-center justify-between transition-colors ${statusColor} ${
        dragging ? "ring-2 ring-sky-400" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          aria-label="Drag to reorder"
          className="p-1.5 rounded-md hover:bg-slate-300/50 dark:hover:bg-slate-700/60 cursor-grab select-none touch-none text-slate-500 dark:text-slate-300"
          {...(dragHandleProps?.attributes || {})}
          {...(dragHandleProps?.listeners || {})}
        >
          <span aria-hidden>⠿</span>
        </button>
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            book.status === "completed"
              ? "bg-emerald-500"
              : book.status === "reading"
              ? "bg-sky-500"
              : "bg-slate-400"
          }`}
        />
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-background text-foreground text-base min-w-0 w-56 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            placeholder="Book title"
            autoFocus
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await update({ id: book._id as any, title });
                setEditing(false);
              }
              if (e.key === "Escape") {
                setTitle(book.title);
                setEditing(false);
              }
            }}
            onBlur={async () => {
              if (title !== book.title) await update({ id: book._id as any, title });
              setEditing(false);
            }}
          />
        ) : (
          <button
            className="text-left truncate max-w-[22rem] text-base font-medium"
            title="Click to edit title"
            onClick={() => setEditing(true)}
          >
            {book.title || <span className="opacity-60">Untitled book</span>}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {book.status !== "reading" && (
          <button
            className="btn-primary"
            onClick={() => update({ id: book._id as any, status: "reading" })}
          >
            Start
          </button>
        )}
        {book.status === "reading" && (
          <button
            className="btn bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={() => update({ id: book._id as any, status: "completed" })}
          >
            Finished!
          </button>
        )}
        {book.status !== "planned" && (
          <button
            className="btn-muted"
            onClick={() => update({ id: book._id as any, status: "planned" })}
          >
            Reset
          </button>
        )}
        <button
          className="btn-danger"
          onClick={() => remove({ id: book._id as any })}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
