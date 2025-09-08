"use client";

import { useEffect, useState } from "react";

export default function ProgressDisplay({
  completed,
  goal,
}: {
  completed: number;
  goal: number;
}) {
  const [prevCompleted, setPrevCompleted] = useState(completed);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (completed > prevCompleted) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    setPrevCompleted(completed);
  }, [completed, prevCompleted]);

  const percent = Math.max(0, Math.min(100, Math.round((completed / Math.max(1, goal)) * 100)));
  
  // Create array of books to display (max 20 visible for space)
  const displayGoal = Math.min(goal, 20);
  const displayCompleted = Math.min(completed, displayGoal);
  const books = Array.from({ length: displayGoal }, (_, i) => ({
    id: i,
    isCompleted: i < displayCompleted,
    isLatest: i === displayCompleted - 1,
  }));

  // Milestone messages
  const getMilestoneMessage = () => {
    if (completed === 0) return "Ready to start your reading journey!";
    if (completed === goal) return "🎉 Goal achieved! Amazing job!";
    if (percent >= 75) return "Almost there! Keep going!";
    if (percent >= 50) return "Halfway to your goal!";
    if (percent >= 25) return "Great progress!";
    return "Off to a good start!";
  };

  return (
    <div className="card flex flex-col gap-4 pb-8">
      {/* Header with count */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Reading Stack</h3>
        <span className="text-2xl font-bold tabular-nums">
          {completed} / {goal}
        </span>
      </div>
      
      {/* Milestone message */}
      <p className="text-lg text-center opacity-80">{getMilestoneMessage()}</p>
      
      {/* Stacked books visualization */}
      <div className="relative h-32 px-4 mb-2">
        {/* Bookshelf */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-slate-400/20 to-slate-300/10 dark:from-slate-600/30 dark:to-slate-700/20 rounded-sm" />
        
        {/* Books container */}
        <div className="absolute bottom-2 left-0 right-0 flex items-end justify-center">
          {books.map((book, index) => {
            // Create more natural variation
            const heightVariation = [85, 92, 88, 95, 90][index % 5];
            const lean = index < displayCompleted 
              ? (index % 4 - 1.5) * 2  // Completed books lean more
              : (index % 3 - 1) * 0.5; // Empty books stand straighter
            
            const bookColors = [
              'from-emerald-600 to-emerald-500',
              'from-green-600 to-green-500', 
              'from-teal-600 to-teal-500',
              'from-green-700 to-green-600',
              'from-emerald-700 to-emerald-600',
            ];
            
            return (
              <div
                key={book.id}
                className={`
                  relative transition-all duration-500 rounded-t-[3px] origin-bottom
                  ${book.isCompleted 
                    ? `bg-gradient-to-t ${bookColors[index % bookColors.length]} shadow-xl` 
                    : 'bg-gradient-to-t from-slate-400/30 to-slate-300/20 dark:from-slate-700/40 dark:to-slate-600/30'
                  }
                  ${book.isLatest && isAnimating ? 'animate-bookSlide' : ''}
                `}
                style={{
                  width: `${Math.max(24, 100 / displayGoal)}px`,
                  height: `${book.isCompleted ? heightVariation : 75}px`,
                  transform: `
                    rotate(${lean}deg) 
                    ${book.isCompleted ? 'perspective(200px) rotateY(-5deg)' : ''}
                  `,
                  zIndex: displayGoal - index,
                  marginLeft: index === 0 ? '0' : '-4px',
                  transitionDelay: `${index * 30}ms`,
                  boxShadow: book.isCompleted 
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                    : 'none',
                }}
              >
                {/* Book spine gradient for depth */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-[3px] ${
                    book.isCompleted ? 'bg-black/20' : 'bg-black/10'
                  }`} 
                />
                
                {/* Book spine highlights */}
                {book.isCompleted && (
                  <>
                    <div className="absolute inset-x-0 top-1 h-[2px] bg-white/30 mx-1" />
                    <div className="absolute inset-x-0 top-3 h-[1px] bg-white/20 mx-2" />
                  </>
                )}
                
                {/* Book number or placeholder */}
                <div className={`absolute inset-0 flex items-center justify-center ${
                  book.isCompleted ? 'text-white/90' : 'text-slate-500/50 dark:text-slate-400/30'
                }`}>
                  <span className="font-bold text-xs">
                    {book.isCompleted ? book.id + 1 : ''}
                  </span>
                </div>
                
                {/* Page edges effect */}
                {book.isCompleted && (
                  <div className="absolute right-0 top-1 bottom-1 w-[2px] bg-gradient-to-l from-white/10 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress percentage */}
      <div className="text-center">
        <div className="text-3xl font-bold" style={{ color: "var(--accent-completed)" }}>
          {percent}%
        </div>
        <div className="text-xs opacity-60 uppercase tracking-wider">Complete</div>
      </div>
    </div>
  );
}
