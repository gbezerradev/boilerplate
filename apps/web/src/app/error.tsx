"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error-fallback";

export default function ErrorPage({
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
      title="Something went wrong"
      description="This page could not be loaded because of an unexpected error."
      onRetry={reset}
    />
  );
}
