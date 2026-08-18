import type { Metadata } from "next";

import { HttpErrorPage } from "@/components/http-error-page";

export const metadata: Metadata = { title: "Authentication required" };

export default function UnauthorizedPage() {
  return (
    <HttpErrorPage
      code="401"
      description="Sign in with an account that has access to this workspace, then try again."
      primaryAction={{ href: "/login", label: "Sign in" }}
      secondaryAction={{ href: "/", label: "Go home" }}
      title="Authentication required"
    />
  );
}
