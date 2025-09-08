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
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm opacity-80">
        <span>Progress</span>
        <span className="font-mono">{completed} / {goal}</span>
      </div>
      <div className="h-3 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
