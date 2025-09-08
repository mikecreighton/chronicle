"use client";

import GoalSetter from "./components/GoalSetter";
import BookList from "./components/BookList";
import ProgressDisplay from "./components/ProgressDisplay";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const books = useQuery(api.books.list) ?? [];
  const settings = useQuery(api.settings.getSettings);
  const goal = settings?.yearGoal ?? 0;
  const completed = books.filter((b) => b.status === "completed").length;
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-21 bg-background/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 flex flex-row justify-between items-center">
          <div className="flex items-baseline gap-4">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
              Chronicle
            </h1>
            {/* Quick stats in header */}
            {settings && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="opacity-70">{settings.schoolYear}</span>
                <span className="opacity-50">•</span>
                <span className="font-bold">Goal:</span><span className="font-medium">{goal} books</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Mobile stats */}
            {settings && (
              <div>
                <span className="sm:hidden text-sm font-bold">Goal:</span> <span className="sm:hidden text-sm font-medium">{goal} books</span>
              </div>
            )}
            {/* Settings toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle settings"
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Collapsible settings panel */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${showSettings ? 'max-h-max sm:max-h-40' : 'max-h-0'}
        `}>
          <div className="px-4 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <GoalSetter onSave={() => setShowSettings(false)} />
          </div>
        </div>
      </header>
      
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8">
          <div className="flex flex-col gap-6">
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
