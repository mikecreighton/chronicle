"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useMemo, useState } from "react";

function currentSchoolYear(date = new Date()): string {
  // School year: Aug 1 -> next Jul 31
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  if (month >= 7) {
    // Aug (7) to Dec
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

export default function GoalSetter({ onSave }: { onSave?: () => void }) {
  const settings = useQuery(api.settings.getSettings);
  const upsert = useMutation(api.settings.upsertSettings);

  const defaultYear = useMemo(() => currentSchoolYear(), []);
  const [goal, setGoal] = useState<number | "">(settings?.yearGoal ?? "");
  const [schoolYear, setSchoolYear] = useState<string>(settings?.schoolYear ?? defaultYear);

  // Sync local inputs when settings change
  useEffect(() => {
    if (settings?.yearGoal !== undefined) setGoal(settings.yearGoal);
    if (settings?.schoolYear) setSchoolYear(settings.schoolYear);
  }, [settings?.yearGoal, settings?.schoolYear]);

  const canSave = typeof goal === "number" && goal > 0 && schoolYear.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold opacity-80 min-w-[80px]">School Year</label>
        <input
          value={schoolYear}
          onChange={(e) => setSchoolYear(e.target.value)}
          className="px-2 py-1.5 rounded-md bg-white dark:bg-slate-800 text-foreground border border-slate-300 dark:border-slate-700 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          placeholder="2024-2025"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold opacity-80 min-w-[80px]">Reading Goal</label>
        <input
          type="number"
          min={1}
          max={20}
          value={goal}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            if (typeof value === "number") {
              setGoal(Math.min(20, Math.max(1, value)));
            } else {
              setGoal("");
            }
          }}
          className="px-2 py-1.5 rounded-md bg-white dark:bg-slate-800 text-foreground border border-slate-300 dark:border-slate-700 text-sm w-14 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          placeholder="20"
        />
        <span className="text-sm opacity-60">books</span>
      </div>
      <button
        className="btn-primary ml-auto"
        disabled={!canSave}
        onClick={() => {
          if (typeof goal === "number") {
            void upsert({ yearGoal: goal, schoolYear });
            onSave?.();
          }
        }}
      >
        Save Settings
      </button>
    </div>
  );
}
