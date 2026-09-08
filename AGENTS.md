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
All data access lives in `src/actions` (`'use server'`), reads included. Never add a route handler just to serve query data — call the action directly. The Auth.js catch-all at `src/app/api/auth/[...nextauth]` is the only route handler in the app.

- **Every action returns `ServerActionResult`** from [src/lib/actions/result.ts](src/lib/actions/result.ts#L1-L43): a discriminated union whose failure arm carries an `ActionErrorCode` (`UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION`, `RATE_LIMITED`, `UNEXPECTED`). Narrow with `if (!result.success)` to reach `result.data`.
- **Mutations** are named `<verb><Noun>Action` and return failures directly. `signIn`/`signOut` (Auth.js re-exports) and `revalidateAll` (a cache primitive) in [src/actions/auth.ts](src/actions/auth.ts#L1-L40) are exempt — they are not data operations.
- **Queries** keep their `get*` names and wrap the body in `serverQuery`, which turns a thrown `ActionError` into a typed failure and anything else into `UNEXPECTED`. Never call `notFound()` or `redirect()` inside an action; throw `ActionError` and let the caller decide.

  ```ts
  export const getProblemView = async (id: string) =>
    serverQuery(async (): Promise<ProblemView> => {
      const problem = await prisma.problem.findUnique({ where: { id } });
      if (!problem) throw new ActionError('NOT_FOUND', 'Problem not found');
      return problem;
    });
  ```

- **Server components** map codes to navigation and degrade for everything else, so one failed query never takes down the page:

  ```tsx
  const result = await getProblemView(problemId);
  if (!result.success) {
    if (result.code === 'NOT_FOUND') notFound();
    return <QueryError message={result.message} />;
  }
  ```

  `<QueryError />` ([src/components/ui/query-error.tsx](src/components/ui/query-error.tsx#L1-L36)) renders an inline fallback and fires a toast. Inside a `<TableBody>` use `<EmptyTableRow />` plus a bare `<ErrorToast />`, since a `<div>` is invalid there.
- **Client components** use `useServerAction` for writes ([src/hooks/use-server-action.ts](src/hooks/use-server-action.ts#L1-L64)) and `useServerQuery` for reads ([src/hooks/use-server-query.ts](src/hooks/use-server-query.ts#L1-L52)). Writes toast on success and failure; pass `{ successToast: false }` when the UI already reports progress. Reads toast only on failure.
- Validate inputs with zod schemas in `src/lib/schemas` before hitting the database. Revalidate affected paths after mutations (see pattern in [src/actions/problems.ts](src/actions/problems.ts#L1-L267)).
- Use `auth()` for user context in server code and `useSession()` from `src/providers/user-provider` for clients.

## Data Layer & Domain Logic
- Prisma client is a shared singleton ([src/lib/db/prisma.ts](src/lib/db/prisma.ts#L1-L7)); never instantiate new clients.
- Automata logic lives in `src/lib/automata` and is orchestrated via the playground store (`src/store/playground-store.ts`); extend existing managers/stores instead of duplicating state handling.
- Submission judging lives in `src/lib/judge`. `judge-submission.ts` is pure and must stay free of Prisma, Next, and React — it is bundled into a standalone worker by `npm run build:worker` (see `tools/build-verify-worker.mjs`), which fails if anything from `node_modules` gets pulled in. Import automata executors directly (`finite-state-machine/FsmExecutor`), never through the barrels, which also export Designers and Animators that reach React and the playground store. `@prisma/*` may only be imported as a type there, because CI installs with `--ignore-scripts` and has no generated client.
- Set `JUDGE_WORKER=1` to judge on a worker thread (standalone deploys); unset it to judge inline (Vercel). Both modes run the same `judgeSubmission`.

## UI, Styling, and Components
- Reuse shadcn primitives (e.g., [src/components/ui/button.tsx](src/components/ui/button.tsx#L1-L44)) and compose variants with `cva`. Shared helpers like `cn` live in [src/lib/ui/utils.ts](src/lib/ui/utils.ts#L1-L6).
- Favor Tailwind utility classes; keep class names readable and scoped. Theme toggling uses `next-themes` with dark default via the ThemeProvider in the root layout.
- Domain-specific UI sits in `src/components/<feature>` (auth, layout, modal, playground, problems, projects). Keep components presentational; wire data in pages or dedicated containers.

## Conventions & Organization
- File naming: kebab-case for filenames, PascalCase for component/function exports. Use the `@/` alias for internal imports.
- Shared hooks live in `src/hooks`; general-purpose utils in `src/utils`; constants/config in `src/constants`; providers in `src/providers`.
- When adding new shadcn components, prefer generating via the shadcn CLI for consistency, then adapt styles to match existing tokens.

## Quality Gates
- Commands: `npm run dev` (serve), `npm run lint` (ESLint + Prettier config in eslint.config.mjs), `npm run test:unit` (Vitest), `npm run test:e2e` (Playwright specs under `tests/e2e`).
- Keep cache-friendly patterns in mind because `cacheComponents` is on ([next.config.ts](next.config.ts#L1-L6)); mark truly dynamic parts as client components or use `no-store`/dynamic fetches when needed.

## Quick References
- Root shell & providers: [src/app/layout.tsx](src/app/layout.tsx#L1-L50)
- Platform layout and nav: [src/app/(platform)/layout.tsx](src/app/(platform)/layout.tsx#L1-L45)
- Landing page/home content: [src/app/(platform)/page.tsx](src/app/(platform)/page.tsx#L1-L150)
- Server action pattern: [src/actions/problems.ts](src/actions/problems.ts#L1-L267)
- Action result type, `ActionError`, `serverQuery`: [src/lib/actions/result.ts](src/lib/actions/result.ts#L1-L43)
- Server action hook: [src/hooks/use-server-action.ts](src/hooks/use-server-action.ts#L1-L64)
- Server query hook: [src/hooks/use-server-query.ts](src/hooks/use-server-query.ts#L1-L52)
- Query failure UI: [src/components/ui/query-error.tsx](src/components/ui/query-error.tsx#L1-L36)
- Shadcn button example: [src/components/ui/button.tsx](src/components/ui/button.tsx#L1-L44)
- Classname helper: [src/lib/ui/utils.ts](src/lib/ui/utils.ts#L1-L6)
- Prisma singleton: [src/lib/db/prisma.ts](src/lib/db/prisma.ts#L1-L7)
- Next config: [next.config.ts](next.config.ts#L1-L6)