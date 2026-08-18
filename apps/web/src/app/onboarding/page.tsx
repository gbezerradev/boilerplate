import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth-shell";
import CreateOrganizationForm from "@/components/create-organization-form";
import { authClient } from "@/lib/auth-client";

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/login?callbackURL=/onboarding");
  }

  return (
    <AuthShell
      title="Create your workspace"
      description="Workspaces keep each organization’s data and access isolated."
    >
      <CreateOrganizationForm />
    </AuthShell>
  );
}
