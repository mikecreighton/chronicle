"use client";

export default function ProgressDisplay({
  completed,
  goal,
}: {
  completed: number;
  goal: number;
}) {
  const percent = Math.max(0, Math.min(100, Math.round((completed / Math.max(1, goal)) * 100)));
  return (
    <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
      <div className="flex items-center justify-between text-sm">
        <span>Progress</span>
        <span className="font-mono">{completed} / {goal}</span>
      </div>
      <div className="h-3 rounded bg-slate-300 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

