import type { Metadata } from "next";

import { HttpErrorPage } from "@/components/http-error-page";

export const metadata: Metadata = { title: "Bad request" };

export default function BadRequestPage() {
  return (
    <HttpErrorPage
      code="400"
      description="The request could not be understood. Check the address or submitted information and try again."
      title="Bad request"
    />
  );
}
