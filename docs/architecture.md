# Architecture

## Request Flow

```text
Browser -> Next.js -> Hono -> Better Auth / tRPC -> PostgreSQL
                       |              |
                       |              +-> Stripe / S3 / analytics
                       +-> signed Stripe webhook
```

Next.js renders public and authenticated routes. Hono adds request IDs, secure headers, body limits,
CORS, structured logging, sanitized errors, Better Auth routes, and tRPC routes.

Authenticated tRPC context resolves session, active organization, and membership. Tenant procedures
reject incomplete context. Authorization adds permission and entitlement checks for billing,
integrations, audit logs, and platform administration.

## Durable Event Flow

```text
API/auth callback -> background_job -> worker claim (FOR UPDATE SKIP LOCKED)
                                      -> email provider
                                      -> signed outgoing webhook
```

Workers claim due jobs in batches. Claims increment attempts and attach worker/lock time. Success
completes the job; failure clears the lock and schedules capped exponential backoff. A unique nullable
idempotency key prevents duplicate logical jobs.

## Data Ownership

Tenant tables carry `organization_id` and use server-derived predicates. Foreign keys cascade
product data with workspace deletion. Audit rows retain events while nullable organization/actor
references become null. Platform tables have separate administrative access paths.

## Provider Boundaries

- Email: console or Resend
- Billing: disabled or Stripe
- Storage: disabled or S3-compatible
- Analytics: disabled, console, or PostHog capture API
- Feature flags: PostgreSQL with deterministic rollout
- Integrations: signed outgoing webhooks executed by the worker

Provider code stays outside route components so a product can replace it without changing tenant
and authorization boundaries.
