import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AppShell from "@/components/app-shell";
import { authClient } from "@/lib/auth-client";

function isPlatformAdminEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalizedEmail);
}

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) redirect("/login");

  return (
    <AppShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      isPlatformAdmin={isPlatformAdminEmail(session.user.email)}
    >
      {children}
    </AppShell>
  );
}
