"use client";

import GoalSetter from "./components/GoalSetter";
import BookList from "./components/BookList";
import ProgressDisplay from "./components/ProgressDisplay";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const books = useQuery(api.books.list) ?? [];
  const settings = useQuery(api.settings.getSettings);
  const goal = settings?.yearGoal ?? 0;
  const completed = books.filter((b) => b.status === "completed").length;

  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        <h1 className="text-xl font-bold">Chronicle</h1>
        <span className="text-sm opacity-70">Book reading tracker</span>
      </header>
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-6">
            <GoalSetter />
            <ProgressDisplay completed={completed} goal={goal} />
          </div>
          <div className="flex flex-col gap-4">
            <BookList />
          </div>
        </div>
      </main>
    </>
  );
}
