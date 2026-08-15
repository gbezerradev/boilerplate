# SaaS Boilerplate

A production-oriented TypeScript foundation for multi-tenant SaaS products. It includes a Next.js
application, Hono/tRPC API, PostgreSQL, a persistent worker, and provider abstractions for common
external services.

## Included

- Better Auth password accounts, required email verification, password reset, and session controls
- Organizations, invitations, active-workspace sessions, and owner/admin/member RBAC
- Tenant-scoped projects, files, audit logs, and outgoing webhooks
- Stripe Checkout, customer portal, signed/idempotent webhooks, plans, and server entitlements
- React Email templates with console and Resend delivery
- PostgreSQL jobs with idempotency, `SKIP LOCKED` claims, retries, and a separate worker
- S3-compatible uploads/downloads through short-lived signed URLs
- PostHog-compatible server analytics
- Deterministic feature-flag rollouts and workspace overrides
- Platform administration protected by a server-side email allowlist
- Responsive app shell, accessible settings, dark mode, and shadcn/ui
- Health endpoints, request IDs, structured logs, secure headers, CI, Vitest, and Playwright

## Stack

Next.js 16, React 19, Hono, tRPC 11, Better Auth, Drizzle ORM, PostgreSQL 18, Tailwind CSS,
shadcn/ui, Vite+, Vitest, and Playwright.

## Quick Start

Requirements: Node.js 24+, npm 12+, and PostgreSQL 18 (or Docker).

```bash
npm install
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
npm run db:start
npm run db:migrate
npm run dev
```

Replace `BETTER_AUTH_SECRET` with a random value of at least 32 characters before sharing or
deploying the app. Open <http://localhost:3001>; the API runs at <http://localhost:3000>.

`npm run docker:up` starts PostgreSQL, runs migrations once, then starts the API, worker, and web
app.

## Configuration

Committed examples document every variable:

- `apps/server/.env.example`: API, worker, providers, and secrets
- `apps/web/.env.example`: public API URL and server-only admin-navigation setting

The API validates its environment at startup. Optional providers are disabled by default and fail
clearly when enabled without required credentials.

### Email and Worker

Development uses rendered console emails. Preview templates with `npm run dev:email` at
<http://localhost:3002>.

```env
EMAIL_PROVIDER=resend
EMAIL_FROM=Your Product <noreply@your-domain.com>
RESEND_API_KEY=re_...
EMAIL_DELIVERY_MODE=queued
```

With queued delivery, run `npm run dev:worker` beside the API. Production defaults to queued;
development defaults to inline.

### Stripe Billing

```env
BILLING_PROVIDER=stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...
```

Register `POST /webhooks/stripe` for `checkout.session.completed` and the three
`customer.subscription.*` lifecycle events. The handler verifies the raw signature, deduplicates
event IDs transactionally, and rejects stale subscription events. Project/member limits are always
enforced on the server.

### S3-Compatible Storage

```env
STORAGE_PROVIDER=s3
S3_BUCKET=your-private-bucket
S3_REGION=us-east-1
# Optional for R2, MinIO, or another compatible service:
S3_ENDPOINT=https://storage.example.com
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
```

The browser uploads with a 10-minute signed request. The API verifies size and content type with
`HeadObject` before exposing metadata. Keep the bucket private and allow browser `PUT` from the web
origin in bucket CORS.

### Analytics

```env
ANALYTICS_PROVIDER=posthog
POSTHOG_API_KEY=phc_...
POSTHOG_HOST=https://us.i.posthog.com
```

`disabled` and `console` providers are available. Analytics failures are logged without failing the
product operation.

### Platform Administration

Set the same comma-separated value on the API and Next.js server:

```env
ADMIN_EMAILS=founder@example.com,ops@example.com
```

Navigation visibility is only a convenience; every admin API operation independently verifies the
authenticated email.

## Tenant and Integration Security

The session stores an active organization. API context resolves its membership, and procedures
derive `organizationId` from server context. Product inputs do not accept tenant IDs. Queries and
mutations include the derived tenant predicate; project writes store audit records transactionally.

RBAC lives in `packages/auth/src/permissions.ts`. Billing management is owner-only; integrations are
managed by owners/admins; audit logs require admin/owner plus the Pro entitlement.

Outgoing webhooks accept only public HTTPS destinations, encrypt signing secrets with AES-256-GCM,
reject redirects, and retry through the worker. Receivers verify `x-webhook-signature` over
`<x-webhook-timestamp>.<raw-body>` with HMAC-SHA256 (`v1=<hex>`). Use restricted production egress as
an additional SSRF boundary. See [SECURITY.md](./SECURITY.md).

## Database and Migrations

```bash
npm run db:generate
npm run db:migrate
```

Commit generated migrations and run them before new app code. Use `db:push` only for disposable
development databases. CI and Docker Compose use migrations.

## Verification

```bash
npm run format:check
npm run lint
npm run check-types
npm test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

CI runs these checks with PostgreSQL. Local E2E skips the database-writing signup test unless `CI`
is set.

## Operations

- `GET /health/live`: process liveness
- `GET /health/ready`: PostgreSQL readiness
- `X-Request-Id`: propagated/generated correlation ID
- API/worker logs: structured JSON
- Audit events: tenant-scoped records with sensitive metadata redaction

Queue failures use capped exponential backoff. Stale locks are reclaimable, and unknown job types
fail visibly in platform administration.

## Structure

```text
apps/
  web/             Next.js UI
  server/          Hono API
  worker/          Background worker
packages/
  api/             tRPC orchestration
  auth/            Better Auth and RBAC
  db/              Drizzle schema and migrations
  ui/              Shared shadcn/ui
  email/           Email templates/providers
  billing/         Stripe and entitlements
  audit/           Audit construction/redaction
  jobs/            PostgreSQL queue
  storage/         S3 provider
  analytics/       Analytics providers
  feature-flags/   Evaluation and rollout
  integrations/    Webhook encryption/signing/delivery
  env/             Typed environment validation
```

See [docs/architecture.md](./docs/architecture.md) for request and event flows.

## Useful Scripts

- `npm run dev`, `dev:web`, `dev:server`, `dev:worker`, `dev:email`
- `npm run db:start`, `db:stop`, `db:migrate`, `db:generate`, `db:studio`
- `npm run test`, `test:watch`, `test:e2e`
- `npm run format`, `format:check`, `lint`, `check-types`, `build`
- `npm run docker:up`, `docker:logs`, `docker:down`

Shared tokens live in `packages/ui/src/styles/globals.css`. Add shared primitives with shadcn using
`-c packages/ui`.
