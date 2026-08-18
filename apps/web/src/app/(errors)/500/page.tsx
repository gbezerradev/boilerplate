import type { Metadata } from "next";

import { HttpErrorPage } from "@/components/http-error-page";

export const metadata: Metadata = { title: "Server error" };

export default function ServerErrorPage() {
  return (
    <HttpErrorPage
      code="500"
      description="An unexpected error interrupted this request. Your data is safe; wait a moment and try again."
      title="Unexpected server error"
    />
  );
}
