import type { Metadata } from "next";

import { HttpErrorPage } from "@/components/http-error-page";

export const metadata: Metadata = { title: "Service unavailable" };

export default function ServiceUnavailablePage() {
  return (
    <HttpErrorPage
      code="503"
      description="The service is temporarily unavailable while maintenance or recovery is in progress. Please try again shortly."
      title="Service unavailable"
    />
  );
}
