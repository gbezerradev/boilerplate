import { Button } from "@boilerplate/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@boilerplate/ui/components/empty";
import { ArrowRightIcon, HomeIcon } from "lucide-react";
import Link from "next/link";

import { FullWidthDivider } from "@/components/full-width-divider";

type ErrorAction = {
  href: "/" | "/dashboard" | "/login";
  label: string;
};

type ErrorPageShellProps = {
  code: string;
  title: string;
  description: string;
  children: React.ReactNode;
  contained?: boolean;
};

type HttpErrorPageProps = Omit<ErrorPageShellProps, "children"> & {
  primaryAction?: ErrorAction;
  secondaryAction?: ErrorAction;
};

export function ErrorPageShell({
  code,
  title,
  description,
  children,
  contained = false,
}: ErrorPageShellProps) {
  return (
    <main
      id="main-content"
      className={
        contained
          ? "flex min-h-[70svh] w-full items-center justify-center overflow-hidden"
          : "flex min-h-svh w-full items-center justify-center overflow-hidden"
      }
    >
      <div className="relative flex min-h-96 w-full max-w-2xl items-center justify-center border-x">
        <FullWidthDivider position="top" />
        <Empty className="py-16">
          <EmptyHeader>
            <p className="font-mono text-muted-foreground text-xs tracking-[0.24em] uppercase">
              Error {code}
            </p>
            <EmptyTitle className="font-black font-mono text-7xl tracking-tighter md:text-8xl">
              {code}
            </EmptyTitle>
            <h1 className="font-semibold text-xl tracking-tight">{title}</h1>
            <EmptyDescription className="max-w-md text-pretty">{description}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>{children}</EmptyContent>
        </Empty>
        <FullWidthDivider position="bottom" />
      </div>
    </main>
  );
}

export function HttpErrorPage({
  code,
  title,
  description,
  primaryAction = { href: "/", label: "Go home" },
  secondaryAction = { href: "/dashboard", label: "Open dashboard" },
  contained,
}: HttpErrorPageProps) {
  return (
    <ErrorPageShell code={code} contained={contained} description={description} title={title}>
      <div className="flex flex-wrap justify-center gap-2">
        <Button nativeButton={false} render={<Link href={primaryAction.href} />}>
          <HomeIcon data-icon="inline-start" />
          {primaryAction.label}
        </Button>
        {secondaryAction ? (
          <Button
            nativeButton={false}
            render={<Link href={secondaryAction.href} />}
            variant="outline"
          >
            {secondaryAction.label}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        ) : null}
      </div>
    </ErrorPageShell>
  );
}
