import type { Metadata } from "next";

import { HttpErrorPage } from "@/components/http-error-page";

export const metadata: Metadata = { title: "Access denied" };

export default function ForbiddenPage() {
  return (
    <HttpErrorPage
      code="403"
      description="Your account is signed in, but it does not have permission to access this resource."
      title="Access denied"
    />
  );
}
