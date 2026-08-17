import { Badge } from "@boilerplate/ui/components/badge";
import { Button } from "@boilerplate/ui/components/button";
import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";

import { DecorIcon } from "@/components/decor-icon";

export function PricingSection() {
  return (
    <section id="pricing" className="flex w-full scroll-mt-24 flex-col gap-5 py-16 md:py-24">
      <div className="mx-auto max-w-lg px-4">
        <div className="flex justify-center">
          <div className="rounded-md border px-4 py-1 text-sm">Example pricing</div>
        </div>
        <h2 className="mt-4 text-center font-bold text-2xl tracking-tight md:text-3xl">
          Ready for your own business model
        </h2>
        <p className="mt-2 text-center text-muted-foreground text-sm md:text-base">
          These example plans demonstrate a complete billing surface. Replace the copy and prices
          with your product configuration.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-4">
        <div className="relative grid border bg-background p-4 shadow-xs md:grid-cols-2">
          <DecorIcon className="size-3" position="top-left" />
          <DecorIcon className="size-3" position="top-right" />
          <DecorIcon className="size-3" position="bottom-left" />
          <DecorIcon className="size-3" position="bottom-right" />

          <div className="w-full px-4 pt-5 pb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-none">Starter</h3>
                <Badge variant="secondary">For evaluation</Badge>
              </div>
              <p className="text-muted-foreground text-sm">Explore the complete product flow.</p>
            </div>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-end gap-0.5 text-muted-foreground text-xl">
                <span>$</span>
                <span className="-mb-0.5 font-extrabold text-4xl text-foreground tracking-tighter">
                  0
                </span>
                <span>/month</span>
              </div>
              <Button
                className="w-full"
                nativeButton={false}
                render={<Link href="/login" />}
                variant="outline"
              >
                Start free
              </Button>
            </div>
          </div>

          <div className="relative w-full rounded-md border bg-card p-4 shadow dark:bg-card/80">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-none">Pro</h3>
                <Badge>Most popular</Badge>
              </div>
              <p className="text-muted-foreground text-sm">A production plan example for teams.</p>
            </div>
            <div className="mt-10 flex flex-col gap-4">
              <div className="flex items-end text-muted-foreground text-xl">
                <span>$</span>
                <span className="-mb-0.5 font-extrabold text-4xl text-foreground tracking-tighter">
                  29
                </span>
                <span>/month</span>
              </div>
              <Button className="w-full" nativeButton={false} render={<Link href="/login" />}>
                Get started
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-x-2 text-muted-foreground text-sm">
          <ShieldCheckIcon className="size-4" />
          <span>Example content — wire it to your billing provider.</span>
        </div>
      </div>
    </section>
  );
}
