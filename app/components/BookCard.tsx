"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useRef, useEffect } from "react";

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
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Cycle through book statuses
  const cycleStatus = () => {
    if (editing) return; // Don't cycle when editing title
    
    const statusOrder: Array<"planned" | "reading" | "completed"> = ["planned", "reading", "completed"];
    const currentIndex = statusOrder.indexOf(book.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    update({ id: book._id as any, status: nextStatus });
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showContextMenu]);

  // Get status icon
  const getStatusIcon = () => {
    switch (book.status) {
      case "completed": return "✓";
      case "reading": return "📖";
      default: return "";
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`book-card ${
          book.status === "completed"
            ? "book--completed"
            : book.status === "reading"
            ? "book--reading"
            : "book--planned"
        } ${dragging ? "ring-2 ring-[var(--accent-primary)]" : ""} cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
        onClick={cycleStatus}
        onContextMenu={handleContextMenu}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            aria-label="Drag to reorder"
            className="p-1.5 rounded-md hover:bg-slate-300/50 dark:hover:bg-slate-700/60 cursor-grab select-none touch-none text-slate-500 dark:text-slate-300"
            onClick={(e) => e.stopPropagation()} // Prevent status cycling when dragging
            {...(dragHandleProps?.attributes || {})}
            {...(dragHandleProps?.listeners || {})}
          >
            <span aria-hidden>⠿</span>
          </button>
          
          {/* Status indicator with icon */}
          <div className="relative flex-shrink-0">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                book.status === "completed" 
                  ? "bg-green-500/20 text-green-600 dark:text-green-400" 
                  : book.status === "reading"
                  ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 animate-pulse"
                  : "bg-slate-500/10 text-slate-400"
              }`}
            >
              <span className="text-sm leading-none">{getStatusIcon()}</span>
            </div>
          </div>

          {/* Title - click to edit */}
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-2 py-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-background text-foreground text-base min-w-0 w-56 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              placeholder="Book title"
              autoFocus
              onClick={(e) => e.stopPropagation()}
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
              className="text-left truncate max-w-[22rem] text-base sm:text-lg font-medium hover:underline"
              title="Click to edit title"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
            >
              {book.title || <span className="opacity-60">Untitled book</span>}
            </button>
          )}
        </div>

        {/* Status hint on the right */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          {book.status === "planned" && <span>Click to start →</span>}
          {book.status === "reading" && <span className="text-blue-600 dark:text-blue-400 font-medium">Currently reading</span>}
          {book.status === "completed" && <span className="text-green-600 dark:text-green-400 font-medium">Completed!</span>}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed z-50 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 min-w-[120px]"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            onClick={() => {
              update({ id: book._id as any, status: "planned" });
              setShowContextMenu(false);
            }}
          >
            Reset to Planned
          </button>
          <hr className="my-1 border-slate-200 dark:border-slate-700" />
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={() => {
              remove({ id: book._id as any });
              setShowContextMenu(false);
            }}
          >
            Delete Book
          </button>
        </div>
      )}
    </>
  );
}
