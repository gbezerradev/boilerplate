"use client";

import { Button } from "@boilerplate/ui/components/button";
import { HomeIcon, RotateCcwIcon } from "lucide-react";
import Link from "next/link";

import { ErrorPageShell } from "@/components/http-error-page";

type ErrorFallbackProps = {
  title: string;
  description: string;
  onRetry: () => void;
  contained?: boolean;
};

export function ErrorFallback({
  title,
  description,
  onRetry,
  contained = false,
}: ErrorFallbackProps) {
  return (
    <ErrorPageShell code="500" contained={contained} description={description} title={title}>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={onRetry}>
          <RotateCcwIcon data-icon="inline-start" />
          Try again
        </Button>
        <Button nativeButton={false} render={<Link href="/" />} variant="outline">
          <HomeIcon data-icon="inline-start" />
          Go home
        </Button>
      </div>
    </ErrorPageShell>
  );
}
