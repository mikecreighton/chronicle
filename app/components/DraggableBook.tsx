"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BookCard from "./BookCard";

type Book = {
  _id: string;
  title: string;
  status: "planned" | "reading" | "completed";
  order: number;
  startedAt?: number;
  completedAt?: number;
};

export default function DraggableBook({ book }: { book: Book }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: book._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <BookCard book={book} dragHandleProps={{ attributes, listeners }} dragging={isDragging} />
    </div>
  );
}
