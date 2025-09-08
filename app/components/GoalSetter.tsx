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

export default function GoalSetter() {
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
    <div className="card flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium opacity-80">School Year</label>
        <input
          value={schoolYear}
          onChange={(e) => setSchoolYear(e.target.value)}
          className="px-2 py-1.5 rounded-md bg-background text-foreground border border-slate-300 dark:border-slate-700 text-base w-36 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium opacity-80">Yearly Goal</label>
        <input
          type="number"
          min={1}
          value={goal}
          onChange={(e) => setGoal(e.target.value === "" ? "" : Number(e.target.value))}
          className="px-2 py-1.5 rounded-md bg-background text-foreground border border-slate-300 dark:border-slate-700 text-base w-28 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
        />
        <button
          className="btn-primary"
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
