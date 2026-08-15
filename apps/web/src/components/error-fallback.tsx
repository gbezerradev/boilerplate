"use client";

import { Button } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";

type ErrorFallbackProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export function ErrorFallback({ title, description, onRetry }: ErrorFallbackProps) {
  return (
    <main id="main-content" className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1>{title}</h1>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If the problem continues, try again later or contact support with the time it occurred.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onRetry}>Try again</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
