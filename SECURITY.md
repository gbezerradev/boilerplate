# Security Policy

## Reporting

Do not open public issues for suspected vulnerabilities. Configure a private security contact or
repository security-advisory process before publishing a derived product.

## Production Checklist

- Replace example secrets and use a managed secret store.
- Serve web and API over HTTPS; restrict CORS and Better Auth trusted origins.
- Use least-privilege PostgreSQL, Stripe, email, analytics, and S3 credentials.
- Keep S3 private; allow only the required browser CORS origin and methods.
- Put worker and API behind restricted outbound network policies or an egress proxy.
- Configure `ADMIN_EMAILS` intentionally and strongly protect administrator accounts.
- Run committed migrations before starting new application versions.
- Preserve logs/audit events according to an explicit retention policy.
- Alert on repeated job failures, signature failures, readiness failures, and elevated 5xx rates.
- Run dependency, secret, SAST, and container scans in CI; patch supported runtimes promptly.
- Back up PostgreSQL, test restores, and document RTO/RPO targets.

This boilerplate provides boundaries and secure defaults. Derived products still need a threat
model, privacy review, abuse controls, rate-limit tuning, and provider-specific hardening.
