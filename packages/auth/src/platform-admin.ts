import { env } from "@boilerplate/env/server";

export function isPlatformAdminEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return env.ADMIN_EMAILS.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalizedEmail);
}
