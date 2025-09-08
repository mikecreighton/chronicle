# Repository Guidelines

This repository contains Chronicle — a simple, single‑page dashboard for tracking book‑reading progress. The app targets Next.js (App Router) with Convex and Tailwind.

## Project Structure & Module Organization
- `spec/`: Planning docs (overview, scope). Keep updated as features evolve.
- `app/`: Next.js routes (e.g., `app/page.tsx`, `app/layout.tsx`).
- `app/components/`: UI components (`BookCard.tsx`, `BookList.tsx`, `GoalSetter.tsx`, `ProgressDisplay.tsx`, `EmptySlot.tsx`).
- `convex/`: Convex schema, queries, and mutations (e.g., `schema.ts`, `books.ts`).
- `public/`: Static assets.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start Next.js dev server.
- `npx convex dev`: Run Convex locally for real‑time data.
- `npm run build` / `npm start`: Production build and serve (add when app is scaffolded).
- `npm run lint` / `npm run typecheck`: Lint and TypeScript checks (add when configured).

## Coding Style & Naming Conventions
- **Language**: TypeScript; **indent**: 2 spaces.
- **Components**: React Server/Client Components as appropriate; filenames in `PascalCase.tsx` (routes use `page.tsx`).
- **State**: Prefer Convex mutations/queries; keep components pure and focused.
- **Styling**: Tailwind CSS v4; compose utility classes; avoid inline styles.
- **Formatting/Linting**: Prettier + ESLint (recommended rules); sort imports; consistent Tailwind class order.

## Testing Guidelines
- Framework: Recommend Vitest + React Testing Library; add Playwright for basic E2E when UI stabilizes.
- Location: Co‑locate unit tests as `*.test.ts(x)` next to sources or under `__tests__/`.
- Conventions: One behavior per test; name files after unit under test (e.g., `BookCard.test.tsx`).
- Running: `npm test` (add script when tests land). Aim for critical-path coverage (goal logic, status transitions, DnD ordering).

## Commit & Pull Request Guidelines
- **Commits**: Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`. Example: `feat: add inline title editing`.
- **PRs**: Provide clear description, linked issue (if any), screenshots/gifs for UI, and checklist (tests, types, lint). Keep PRs small and focused.

## Security & Configuration Tips
- Do not commit secrets. Use environment variables (`.env.local` for dev). For Convex, follow their env setup; verify `.gitignore` covers env files.
- Validate inputs in Convex mutations; never trust client payloads.
