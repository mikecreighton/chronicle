"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function EmptySlot() {
  const add = useMutation(api.books.add);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  if (!adding) {
    return (
      <button
        className="rounded-xl border-2 border-dashed border-slate-300/60 dark:border-slate-700/60 p-4 text-slate-500 hover:text-foreground hover:border-slate-400 dark:hover:border-slate-500 text-sm bg-[var(--surface-muted)]/30 dark:bg-[var(--surface-muted)]/40"
        onClick={() => setAdding(true)}
      >
        + Add book
      </button>
    );
  }

  return (
    <div className="card flex items-center gap-2">
      <input
        className="flex-1 px-2 py-1.5 rounded-md bg-background text-foreground border border-slate-300 dark:border-slate-700 text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        value={title}
        placeholder="Book title"
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        onKeyDown={async (e) => {
          if (e.key === "Enter" && title.trim().length > 0) {
            await add({ title: title.trim() });
            setTitle("");
            setAdding(false);
          }
          if (e.key === "Escape") {
            setTitle("");
            setAdding(false);
          }
        }}
      />
      <button
        className="btn-primary"
        disabled={title.trim().length === 0}
        onClick={async () => {
          if (title.trim()) {
            await add({ title: title.trim() });
            setTitle("");
            setAdding(false);
          }
        }}
      >
        Add
      </button>
      <button
        className="btn-muted"
        onClick={() => {
          setTitle("");
          setAdding(false);
        }}
      >
        Cancel
      </button>
    </div>
  );
}
