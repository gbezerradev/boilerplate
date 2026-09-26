# Boilerplate monorepo

Shared foundation for the web and API applications. The repository is an npm
workspaces monorepo orchestrated by Turborepo.

## Getting started

Requirements: Node.js 22 or newer and npm 10 or newer.

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run db:push
npm run dev
```

On PowerShell, use `Copy-Item` instead of `cp` for the two environment files.

If npm 12 blocks dependency lifecycle scripts on a fresh machine, approve the
scripts used by Prisma, SQLite, and Next.js, then run `npm install` again:

```bash
npm install-scripts approve better-sqlite3 prisma @prisma/engines esbuild
npm install
```

Useful root commands:

```bash
npm run build          # Build every workspace
npm run lint           # Lint every workspace
npm run format         # Format and lint supported files with Biome
npm run format:check   # Check formatting without changing files
npm run typecheck      # Type-check every workspace
npm test               # Run workspace tests
```

Database commands are delegated to the API workspace so the root remains
agnostic about the Prisma schema:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio
```

## Architecture

```text
apps/
  web/      Next.js web application (frontend)
  api/      Hono API application (backend and Prisma entry point)
packages/   Shared libraries and configuration, added only when needed
```

Each workspace owns its runtime dependencies and exposes the scripts consumed
by the root Turbo commands (`dev`, `build`, `lint`, `format`, `typecheck`,
`test`, and the database tasks where applicable). The root contains shared
tooling configuration only; app routes, pages, Prisma schema, and
authentication runtime code belong in their respective workspaces.

The API follows a modular Clean Architecture inside `apps/api/src`:

```text
http/            HTTP adapters and route composition
  controllers/   HTTP input/output adapters and status codes
  routes/        route registration and route-level composition
  schemas/       request validation schemas
  errors/        HTTP error responses
use-cases/users/ one use case per user operation
repositories/    persistence contracts
repositories/prisma/
                 Prisma implementations of those contracts
factories/       dependency wiring for use cases
config/          validated runtime environment
plugins/         Hono framework integrations
lib/             framework-neutral types, errors, and shared services
```

`POST /api/v1/users` creates a user through the controller, use case, repository
interface, and Prisma adapter. API routes use the `/api/{version}` convention.

## Tooling

- npm workspaces for dependency and workspace management
- Turborepo for task orchestration and caching
- TypeScript for shared compiler defaults
- Biome for formatting and linting
- Next.js, Hono, Prisma, and Vitest are app-level concerns
