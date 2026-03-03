# Agent Guide

## Stack & Runtime
- Next.js 16 App Router with `cacheComponents` enabled; prefer server components by default and add `'use client'` for separated components only when interaction or browser APIs are required.
- TypeScript across the repo; Tailwind CSS for styling; shadcn/ui primitives extended in `src/components/ui`.
- Auth.js powers sessions; the root layout wires Theme, Modal, and Session providers plus the toast system (see [src/app/layout.tsx](src/app/layout.tsx#L1-L50)).

## Routing & Layouts
- Routes live in `src/app`. Use route groups to separate concerns: SaaS platform pages under `(platform)` with nav in [src/app/(platform)/layout.tsx](src/app/(platform)/layout.tsx#L1-L45); auth flows under `(auth)`.
- Keep pages as server components when possible; colocate page-specific components under the route folder and share cross-route pieces from `src/components`.
- When adding new global wrappers/providers, register them in the root layout so they apply across routes.

## Data & Server Actions
- Place server actions in `src/actions`; start files with `'use server'`. Return `ServerActionResult` and surface them through the `useServerAction` hook for loading state and toast handling ([src/hooks/use-server-action.ts](src/hooks/use-server-action.ts#L1-L48)).
- Validate inputs with zod schemas in `src/lib/schemas` before hitting the database. Revalidate affected paths after mutations (see pattern in [src/actions/problems.ts](src/actions/problems.ts#L1-L200)).
- Use `auth()` for user context in server code and `useSession()` from `src/providers/user-provider` for clients. Redirect unauthenticated flows server-side when needed.

## Data Layer & Domain Logic
- Prisma client is a shared singleton ([src/lib/db/prisma.ts](src/lib/db/prisma.ts#L1-L7)); never instantiate new clients.
- Automata logic lives in `src/lib/automata` and is orchestrated via the playground store (`src/store/playground-store.ts`); extend existing managers/stores instead of duplicating state handling.

## UI, Styling, and Components
- Reuse shadcn primitives (e.g., [src/components/ui/button.tsx](src/components/ui/button.tsx#L1-L44)) and compose variants with `cva`. Shared helpers like `cn` live in [src/lib/ui/utils.ts](src/lib/ui/utils.ts#L1-L6).
- Favor Tailwind utility classes; keep class names readable and scoped. Theme toggling uses `next-themes` with dark default via the ThemeProvider in the root layout.
- Domain-specific UI sits in `src/components/<feature>` (auth, layout, modal, playground, problems, projects). Keep components presentational; wire data in pages or dedicated containers.

## Conventions & Organization
- File naming: kebab-case for filenames, PascalCase for component/function exports. Use the `@/` alias for internal imports.
- Shared hooks live in `src/hooks`; general-purpose utils in `src/utils`; constants/config in `src/constants`; providers in `src/providers`.
- When adding new shadcn components, prefer generating via the shadcn CLI for consistency, then adapt styles to match existing tokens.

## Quality Gates
- Commands: `npm run dev` (serve), `npm run lint` (ESLint + Prettier config in eslint.config.mjs), `npm run test` (Playwright e2e under `tests/e2e`).
- Keep cache-friendly patterns in mind because `cacheComponents` is on ([next.config.ts](next.config.ts#L1-L6)); mark truly dynamic parts as client components or use `no-store`/dynamic fetches when needed.

## Quick References
- Root shell & providers: [src/app/layout.tsx](src/app/layout.tsx#L1-L50)
- Platform layout and nav: [src/app/(platform)/layout.tsx](src/app/(platform)/layout.tsx#L1-L45)
- Landing page/home content: [src/app/(platform)/page.tsx](src/app/(platform)/page.tsx#L1-L150)
- Server action pattern: [src/actions/problems.ts](src/actions/problems.ts#L1-L200)
- Server action hook: [src/hooks/use-server-action.ts](src/hooks/use-server-action.ts#L1-L48)
- Shadcn button example: [src/components/ui/button.tsx](src/components/ui/button.tsx#L1-L44)
- Classname helper: [src/lib/ui/utils.ts](src/lib/ui/utils.ts#L1-L6)
- Prisma singleton: [src/lib/db/prisma.ts](src/lib/db/prisma.ts#L1-L7)
- Next config: [next.config.ts](next.config.ts#L1-L6)