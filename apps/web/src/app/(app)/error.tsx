"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error-fallback";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorFallback
      contained
      description="This workspace view could not be loaded. Try the request again without leaving the application."
      onRetry={reset}
      title="The workspace encountered an error"
    />
  );
}
