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

  return (
    <div
      className={`book-card ${
        book.status === "completed"
          ? "book--completed"
          : book.status === "reading"
          ? "book--reading"
          : "book--planned"
      } ${dragging ? "ring-2 ring-[var(--accent-primary)]" : ""}`}
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
          className={`inline-block h-2.5 w-2.5 rounded-full`}
          style={{
            backgroundColor:
              book.status === "completed"
                ? "var(--accent-completed)"
                : book.status === "reading"
                ? "var(--accent-reading)"
                : "var(--accent-planned)",
          }}
        />
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-background text-foreground text-base min-w-0 w-56 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
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
            className="text-left truncate max-w-[22rem] text-base sm:text-lg font-medium"
            title="Click to edit title"
            onClick={() => setEditing(true)}
          >
            {book.title || <span className="opacity-60">Untitled book</span>}
          </button>
        )}
        {book.status !== "planned" && (
          <span className={`${
            book.status === "completed" ? "badge-completed" : "badge-reading"
          } ml-2`}>{book.status === "completed" ? "Completed" : "Reading"}</span>
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
            className="btn-success"
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
