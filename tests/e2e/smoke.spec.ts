import { expect, test } from "@playwright/test";

test("loads the application with a connected API and security headers", async ({ page }) => {
  const response = await page.goto("/");

  expect(response).not.toBeNull();
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  await expect(page.getByText("API Status")).toBeVisible();
  await expect(page.getByText("Connected")).toBeVisible();
});

test("exposes the complete password authentication flow", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveAttribute("autocomplete", "email");

  await page.getByRole("button", { name: "Need an account? Sign up" }).click();
  await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
  await expect(page.getByLabel("Password")).toHaveAttribute("autocomplete", "new-password");

  await page.goto("/forgot-password");
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();

  await page.goto("/reset-password?token=example-token");
  await expect(page.getByRole("heading", { name: "Choose a new password" })).toBeVisible();
  await expect(page.getByLabel("Confirm new password")).toBeVisible();

  await page.goto("/reset-password");
  await expect(page.getByRole("heading", { name: "Reset link unavailable" })).toBeVisible();
});

test("protects organization routes and preserves invitation callbacks", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page).toHaveURL(
    /\/login\?callbackURL=%2Fonboarding|\/login\?callbackURL=\/onboarding/,
  );

  await page.goto("/accept-invitation");
  await expect(page.getByRole("heading", { name: "Invitation unavailable" })).toBeVisible();

  await page.goto("/accept-invitation?id=invite-id");
  const signInLink = page.getByRole("link", { name: "Sign in to accept" });
  await expect(signInLink).toBeVisible();
  await expect(signInLink).toHaveAttribute("href", /callbackURL=.*accept-invitation/);

  await page.goto("/organization/invite");
  await expect(page).toHaveURL(
    /\/login\?callbackURL=%2Forganization%2Finvite|\/login\?callbackURL=\/organization\/invite/,
  );

  for (const protectedRoute of ["/files", "/settings/integrations", "/admin/feature-flags"]) {
    await page.goto(protectedRoute);
    await expect(page).toHaveURL(/\/login(?:\?|$)/);
  }
});

test("creates an email-verification account against PostgreSQL", async ({ page }) => {
  test.skip(
    !process.env.CI,
    "The local smoke suite does not require a running PostgreSQL instance",
  );

  await page.goto("/login");
  await page.getByRole("button", { name: "Need an account? Sign up" }).click();
  await page.getByLabel("Name").fill("CI User");
  await page.getByLabel("Email").fill(`ci-${Date.now()}-${crypto.randomUUID()}@example.com`);
  await page.getByLabel("Password").fill("correct-horse-battery-staple");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Check your inbox to verify your email address.")).toBeVisible();
});
