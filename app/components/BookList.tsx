"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import BookCard from "./BookCard";
import EmptySlot from "./EmptySlot";
import ProgressDisplay from "./ProgressDisplay";

export default function BookList() {
  const books = useQuery(api.books.list) ?? [];
  const settings = useQuery(api.settings.getSettings);

  const goal = settings?.yearGoal ?? 0;
  const completed = books.filter((b) => b.status === "completed").length;
  const placeholders = Math.max(0, goal - books.length);

  return (
    <div className="flex flex-col gap-4">
      <ProgressDisplay completed={completed} goal={goal} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {books.map((b) => (
          <BookCard key={b._id} book={b as any} />
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <EmptySlot key={`empty-${i}`} />
        ))}
      </div>
    </div>
  );
}

