import { defineConfig, devices } from "@playwright/test";

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://postgres:password@127.0.0.1:5432/boilerplate";
const serverUrl = "http://localhost:3000";
const webUrl = "http://localhost:3001";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: webUrl,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: process.env.CI ? "npm run start --workspace=server" : "npm run dev:server",
      url: `${serverUrl}/health/live`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        DATABASE_URL: databaseUrl,
        BETTER_AUTH_SECRET:
          process.env.BETTER_AUTH_SECRET ?? "e2e-secret-that-is-at-least-thirty-two-characters",
        BETTER_AUTH_URL: serverUrl,
        CORS_ORIGIN: webUrl,
        EMAIL_PROVIDER: "console",
        EMAIL_FROM: "Boilerplate <noreply@example.com>",
        NODE_ENV: process.env.CI ? "production" : "test",
        PORT: "3000",
      },
    },
    {
      command: process.env.CI ? "npm run start --workspace=web" : "npm run dev:web",
      url: webUrl,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        NEXT_PUBLIC_SERVER_URL: serverUrl,
        PORT: "3001",
      },
    },
  ],
});
