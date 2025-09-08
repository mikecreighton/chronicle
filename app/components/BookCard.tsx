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
      ? "bg-emerald-500/20 text-emerald-900 dark:text-emerald-100"
      : book.status === "reading"
      ? "bg-sky-500/20 text-sky-900 dark:text-sky-100"
      : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100";

  return (
    <div
      className={`rounded-md p-4 flex items-center justify-between ${statusColor} ${
        dragging ? "ring-2 ring-sky-400" : ""
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          aria-label="Drag to reorder"
          className="p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-700 cursor-grab select-none"
          {...(dragHandleProps?.attributes || {})}
          {...(dragHandleProps?.listeners || {})}
        >
          <span className="text-slate-600 dark:text-slate-300">⠿</span>
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
            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-background text-foreground text-sm min-w-0 w-56"
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
            className="text-left truncate max-w-[22rem]"
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
            className="text-xs px-2 py-1 rounded bg-sky-600 text-white"
            onClick={() => update({ id: book._id as any, status: "reading" })}
          >
            Start
          </button>
        )}
        {book.status === "reading" && (
          <button
            className="text-xs px-2 py-1 rounded bg-emerald-600 text-white"
            onClick={() => update({ id: book._id as any, status: "completed" })}
          >
            Finished!
          </button>
        )}
        {book.status !== "planned" && (
          <button
            className="text-xs px-2 py-1 rounded bg-slate-300 dark:bg-slate-700"
            onClick={() => update({ id: book._id as any, status: "planned" })}
          >
            Reset
          </button>
        )}
        <button
          className="text-xs px-2 py-1 rounded bg-rose-600 text-white"
          onClick={() => remove({ id: book._id as any })}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
