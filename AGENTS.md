# Repository Guidelines

This repository contains Chronicle — a simple, single‑page dashboard for tracking book‑reading progress. The app targets Next.js (App Router) with Convex and Tailwind.

## Project Structure & Module Organization
- `app/`: Next.js routes (e.g., `app/page.tsx`, `app/layout.tsx`).
- `app/components/`: UI components (`BookCard.tsx`, `BookList.tsx`, `GoalSetter.tsx`, `ProgressDisplay.tsx`, `EmptySlot.tsx`).
- `convex/`: Convex schema, queries, and mutations (e.g., `schema.ts`, `books.ts`).
- `public/`: Static assets.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start Next.js dev server AND Convex dev server in parallel.
- `npm run dev:frontend`: Start Next.js dev server.
- `npx run dev:backend`: Run Convex dev server locally.
- `npm run build` / `npm start`: Production build and serve (add when app is scaffolded).
- `npm run lint` / `npm run typecheck`: Lint and TypeScript checks (add when configured).

## Coding Style & Naming Conventions
- **Language**: TypeScript; **indent**: 2 spaces.
- **Components**: React Server/Client Components as appropriate; filenames in `PascalCase.tsx` (routes use `page.tsx`).
- **State**: Prefer Convex mutations/queries; keep components pure and focused.
- **Styling**: Tailwind CSS v4; compose utility classes; avoid inline styles.
- **Formatting/Linting**: Prettier + ESLint (recommended rules); sort imports; consistent Tailwind class order.

## Security & Configuration Tips
- Do not commit secrets. Use environment variables (`.env.local` for dev). For Convex, follow their env setup; verify `.gitignore` covers env files.
