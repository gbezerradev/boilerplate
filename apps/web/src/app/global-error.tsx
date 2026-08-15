"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error-fallback";

import "../index.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
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
          onRetry={retry}
        />
      </body>
    </html>
  );
}
