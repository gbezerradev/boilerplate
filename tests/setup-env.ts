process.env.DATABASE_URL ??= "postgresql://postgres:password@localhost:5432/boilerplate_test";
process.env.BETTER_AUTH_SECRET ??= "test-secret-that-is-at-least-thirty-two-characters";
process.env.BETTER_AUTH_URL ??= "http://localhost:3000";
process.env.CORS_ORIGIN ??= "http://localhost:3001";
process.env.EMAIL_PROVIDER ??= "console";
process.env.EMAIL_FROM ??= "Boilerplate <noreply@example.com>";
process.env.BILLING_PROVIDER ??= "disabled";
process.env.NODE_ENV = "test";
