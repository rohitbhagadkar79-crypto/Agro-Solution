# PATIL AGRO SOLUTION

An AI-assisted field desk for Indian farmers to understand crop health, soil reports, weather, and next steps.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/patil-agro-solution/src/components/patil-app.tsx` — farmer dashboard and feature pages
- `artifacts/patil-agro-solution/src/index.css` — Field Ledger visual system and responsive styles
- `lib/api-spec/openapi.yaml` — API contract for dashboard, crops, reports, soil reports, and alerts
- `artifacts/api-server/src/routes/agro.ts` — demo-backed agriculture API routes

## Architecture decisions

- AI crop and nutrient results are presented as visual predictions with confidence, never as laboratory measurements.
- The frontend uses the generated API hooks and graceful API-unavailable states so the main journeys remain understandable during service outages.
- The initial agriculture API uses a small in-memory seed dataset to make the first build immediately usable; persistent PostgreSQL storage can replace it without changing the frontend contract.

## Product

Farmers can review a field dashboard, weather and alerts, scan crop or leaf images, enter laboratory soil values, manage crops, use the multilingual assistant, and browse saved reports.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
