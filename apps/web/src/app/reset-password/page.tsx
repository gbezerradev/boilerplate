import { buttonVariants } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import Link from "next/link";

import ResetPasswordForm from "@/components/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

  return (
    <main id="main-content" className="flex min-h-svh items-center justify-center px-4 py-12">
      {token && !error ? (
        <ResetPasswordForm token={token} />
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>
              <h1>Reset link unavailable</h1>
            </CardTitle>
            <CardDescription>This password reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/forgot-password" className={buttonVariants({ variant: "default" })}>
              Request another link
            </Link>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
