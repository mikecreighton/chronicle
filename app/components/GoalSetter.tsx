"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useState } from "react";

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

export default function GoalSetter() {
  const settings = useQuery(api.settings.getSettings);
  const upsert = useMutation(api.settings.upsertSettings);

  const defaultYear = useMemo(() => currentSchoolYear(), []);
  const [goal, setGoal] = useState<number | "">(settings?.yearGoal ?? "");
  const [schoolYear, setSchoolYear] = useState<string>(
    settings?.schoolYear ?? defaultYear
  );

  // Keep local state in sync when settings load
  if (goal === "" && settings?.yearGoal && goal !== settings.yearGoal) {
    // setState in render is usually bad; guard with simple heuristic
    setGoal(settings.yearGoal);
  }
  if (settings?.schoolYear && settings.schoolYear !== schoolYear) {
    setSchoolYear(settings.schoolYear);
  }

  const canSave = typeof goal === "number" && goal > 0 && schoolYear.length > 0;

  return (
    <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">School Year</label>
        <input
          value={schoolYear}
          onChange={(e) => setSchoolYear(e.target.value)}
          className="px-2 py-1 rounded bg-background text-foreground border border-slate-300 dark:border-slate-700 text-sm w-32"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Yearly Goal</label>
        <input
          type="number"
          min={1}
          value={goal}
          onChange={(e) => setGoal(e.target.value === "" ? "" : Number(e.target.value))}
          className="px-2 py-1 rounded bg-background text-foreground border border-slate-300 dark:border-slate-700 text-sm w-24"
        />
        <button
          className="text-xs px-2 py-1 rounded bg-foreground text-background disabled:opacity-50"
          disabled={!canSave}
          onClick={() => {
            if (typeof goal === "number") {
              void upsert({ yearGoal: goal, schoolYear });
            }
          }}
        >
          Save Goal
        </button>
      </div>
    </div>
  );
}

