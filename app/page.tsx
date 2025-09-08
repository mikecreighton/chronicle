"use client";

import GoalSetter from "./components/GoalSetter";
import BookList from "./components/BookList";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        <h1 className="text-xl font-bold">Chronicle</h1>
        <span className="text-sm opacity-70">Book reading tracker</span>
      </header>
      <main className="p-6 flex flex-col gap-6 max-w-5xl mx-auto">
        <GoalSetter />
        <BookList />
      </main>
    </>
  );
}
