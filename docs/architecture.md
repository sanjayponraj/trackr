# Architecture

## Stack

| Concern | Choice | Interview rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components + streaming; modern React model |
| Language | TypeScript (strict) | Shared types across frontend/backend |
| Backend | NestJS + Prisma + PostgreSQL | Modular, DI-driven, testable |
| Server state | TanStack Query | Caching, invalidation, optimistic updates |
| Client/UI state | React state + minimal Context | Most "state" is really server state |
| Forms | React Hook Form + Zod | Performant, schema validation shared with backend |
| Styling | Tailwind + shadcn/ui | Fast, consistent |
| Auth | JWT in httpOnly cookie | XSS-safe; guarded routes on both ends |

## Monorepo layout

```
trackr/                     # single git repo
├── package.json            # root orchestrator (yarn --cwd delegation)
├── docs/                   # this folder — architecture & interview notes
├── api/                    # NestJS backend
│   └── src/
│       ├── auth/           # JWT auth, guards
│       ├── jobs/           # CRUD + ingestion sources
│       │   └── sources/    # strategy pattern: manual, greenhouse, adzuna
│       ├── scoring/        # the ghost-detection engine
│       │   ├── scoring.service.ts
│       │   ├── signal.interface.ts
│       │   └── signals/    # strategy pattern: one file per heuristic
│       └── prisma/
└── web/                    # Next.js frontend
    └── src/
        ├── app/            # routing + layouts only
        ├── features/       # feature-first: jobs/, auth/, scoring/
        ├── components/ui/  # shadcn primitives
        └── lib/            # api-client, query-client
```

## Two patterns that carry the project (both = DI in action)

### 1. Scoring signals (strategy pattern)

Each heuristic is an independently testable `@Injectable()` implementing a shared
contract. The scoring service receives all signals via DI and sums weighted results.

```ts
interface GhostSignal {
  readonly key: string;
  readonly weight: number;
  evaluate(job: Job): { score: number; reason: string }; // score 0..1
}
```

`ScoringService` injects `GhostSignal[]`, runs each, returns total + breakdown.
Adding a new signal = add one file. Testing = test each signal in isolation.

### 2. Job sources (strategy pattern)

Each data source implements a common interface and normalizes external data into
the internal `Job` shape.

```ts
interface JobSource {
  readonly name: string;
  fetchJobs(query: JobQuery): Promise<NormalizedJob[]>;
}
```

Both are textbook "walk me through your design" material and directly demonstrate
NestJS dependency injection.

## Rendering strategy (Next.js — the key learning)

- **Job list / dashboard:** Server Component fetches initial data → hands to a
  Client Component for interactivity (sort/filter).
- **Score breakdown:** the centerpiece. Visual, explainable result (progress bars,
  risk badges, expandable "why" per signal). Better React showcase than drag-drop.
- **Login / register:** Client Components (local form state).
- **Stats:** Server Component, zero client JS.

Core distinction to nail: **Server Components fetch the first paint's data; Client
Components own anything interactive.** Opt into the browser with `'use client'`.

## Data model (initial)

```
User      id, email, passwordHash, createdAt
Job       id, userId, title, company, description, salaryMin?, salaryMax?,
          url?, applicantCount?, firstPublished?, source, createdAt
Score     id, jobId, total, risk, breakdown(json), createdAt
```

## Auth flow

login → POST /auth/login (Nest) → JWT returned → stored as httpOnly cookie →
`web/middleware.ts` gates `(dashboard)` routes → Server Components read cookie to
fetch. Interview Q to be ready for: "Where do you store a JWT and why?"
(httpOnly cookie = safe from XSS; localStorage = convenient but XSS-exposed.)
