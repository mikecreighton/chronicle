# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chronicle is a single-page dashboard for tracking book-reading progress throughout the school year. Built for simplicity and speed, designed for a young reader to visually track their progress toward their yearly reading goal.

More detailed overview here: @spec/overview.md

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Database**: Convex (real-time sync, no API routes needed)
- **Styling**: Tailwind CSS v4
- **Deployment Target**: Vercel or self-hosted server

## Architecture Decisions

### Single Page Application
- Everything on one dashboard at `/` route
- No routing complexity - all interactions happen inline
- Immediate visual feedback for all actions
- Optimized for simplicity over feature separation

### Component Structure
```
app/
├── page.tsx                 # Main dashboard
├── layout.tsx              # Root layout with Convex provider
└── components/
    ├── BookCard.tsx        # Individual book display/edit
    ├── BookList.tsx        # Container for all books
    ├── GoalSetter.tsx      # Goal input and display
    ├── ProgressDisplay.tsx # Visual progress indicator
    └── EmptySlot.tsx       # Placeholder for unplanned books
```

### Convex Schema
```typescript
books: {
  title: v.string(),        // Can be empty for placeholder books
  status: v.union(v.literal("planned"), v.literal("reading"), v.literal("completed")),
  order: v.number(),        // For drag-and-drop ordering
  startedAt: v.optional(v.number()),
  completedAt: v.optional(v.number()),
}

settings: {
  yearGoal: v.number(),     // Target number of books
  schoolYear: v.string(),   // e.g., "2024-2025"
}
```

## Key Implementation Notes

### Book States
- **Planned**: Default state, grayed out appearance
- **Reading**: Highlighted, supports 1-3 simultaneous books
- **Completed**: Checked/celebrated, triggers animation

### User Interactions
- Single click to cycle book status
- Inline editing for book titles (contenteditable or input on focus)
- Drag-and-drop for reordering books
- Empty slots auto-generated based on (goal - existing books)

### Core Features Priority
1. Goal setting and progress visualization
2. Book CRUD with status management
3. Drag-and-drop reordering
4. Inline title editing
5. Celebration animations on completion

## Development Commands

```bash
# Setup (once these are configured)
npm install
npm run dev          # Start Next.js dev server
npx convex dev       # Start Convex in dev mode

# Future commands to be added:
# npm run build       # Production build
# npm run lint        # Linting
# npm run typecheck   # Type checking
```

## Implementation Strategy

When implementing features:
1. Start with Convex schema and mutations
2. Build static UI components first
3. Connect to Convex for real-time updates
4. Add interactions (drag-drop, inline edit)
5. Polish with animations and transitions

Keep it simple - this is a family project focused on functionality over complexity.