import { Button } from "@boilerplate/ui/components/button";
import Link from "next/link";

import { AuthShell } from "@/components/auth-shell";
import ResetPasswordForm from "@/components/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

  return token && !error ? (
    <AuthShell
      title="Choose a new password"
      description="Use at least 8 characters and keep it unique to this account."
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  ) : (
    <AuthShell
      title="Reset link unavailable"
      description="This password reset link is invalid or has expired."
    >
      <Button nativeButton={false} render={<Link href="/forgot-password" />}>
        Request another link
      </Button>
    </AuthShell>
  );
}
