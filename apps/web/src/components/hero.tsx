import { Button } from "@boilerplate/ui/components/button";
import { cn } from "@boilerplate/ui/lib/utils";
import { ArrowRightIcon, RocketIcon } from "lucide-react";
import Link from "next/link";

import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { DecorIcon } from "@/components/decor-icon";
import { FullWidthDivider } from "@/components/full-width-divider";

export function HeroSection() {
  return (
    <section id="about">
      <div className="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-24 lg:py-28">
        <div aria-hidden="true" className="absolute inset-0 -z-1 size-full overflow-hidden">
          <div
            className={cn(
              "absolute -inset-x-20 inset-y-0 z-0 rounded-full",
              "bg-[radial-gradient(ellipse_at_center,theme(--color-foreground/.1),transparent,transparent)]",
              "blur-[50px]",
            )}
          />
          <div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-border to-border md:left-8" />
          <div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-border to-border md:right-8" />
          <div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:left-12" />
          <div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-border/50 to-border/50 md:right-12" />
        </div>

        <a
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out",
          )}
          href="#features"
        >
          <div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
            <p className="font-mono text-xs">READY</p>
          </div>
          <span className="text-xs">production-ready SaaS foundation</span>
          <span className="block h-5 border-l" />
          <div className="pr-1">
            <ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
          </div>
        </a>

        <h1
          className={cn(
            "max-w-3xl text-balance text-center text-3xl text-foreground md:text-5xl lg:text-6xl",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out",
          )}
        >
          Launch your SaaS without rebuilding the foundation
        </h1>

        <p
          className={cn(
            "max-w-2xl text-balance text-center text-muted-foreground text-sm tracking-wide sm:text-lg",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out",
          )}
        >
          Authentication, organizations, billing, background jobs and a polished dashboard — wired
          together and ready to customize.
        </p>

        <div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
          <Button nativeButton={false} render={<a href="#features" />} variant="outline">
            Explore features
          </Button>
          <Button nativeButton={false} render={<Link href="/login" />}>
            <RocketIcon data-icon="inline-start" />
            Get started
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <DecorIcon className="size-4" position="top-left" />
        <DecorIcon className="size-4" position="top-right" />
        <DecorIcon className="size-4" position="bottom-left" />
        <DecorIcon className="size-4" position="bottom-right" />
        <FullWidthDivider className="-top-px" />
        <div className="h-[32rem] overflow-hidden bg-background p-4 md:p-6">
          <DashboardSkeleton />
        </div>
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  );
}
