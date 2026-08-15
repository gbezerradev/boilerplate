import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
    <main id="main-content" className="flex min-h-svh items-center justify-center px-4 py-12">
      <CreateOrganizationForm />
    </main>
  );
}
