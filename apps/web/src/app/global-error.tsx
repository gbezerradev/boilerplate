"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error-fallback";

import "../index.css";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <ErrorFallback
          title="The application encountered an error"
          description="The application shell could not be rendered safely."
          onRetry={reset}
        />
      </body>
    </html>
  );
}
