"use client";

import { Button } from "@boilerplate/ui/components/button";
import { cn } from "@boilerplate/ui/lib/utils";
import Link from "next/link";

import { LogoIcon } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { useScroll } from "@/hooks/use-scroll";

export const navLinks = [
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "Stories",
    href: "#testimonials",
  },
  {
    label: "FAQ",
    href: "#faqs",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
        {
          "border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-4xl md:shadow":
            scrolled,
        },
      )}
    >
      <nav
        aria-label="Main navigation"
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          },
        )}
      >
        <Link className="flex items-center gap-2 rounded-md p-2 hover:bg-muted" href="/">
          <LogoIcon className="size-4" />
          <span className="font-medium">SaaS</span>
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <div>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                nativeButton={false}
                render={<a href={link.href} />}
                size="sm"
                variant="ghost"
              >
                {link.label}
              </Button>
            ))}
          </div>
          <Button nativeButton={false} render={<Link href="/login" />} size="sm" variant="outline">
            Sign in
          </Button>
          <Button nativeButton={false} render={<Link href="/login" />} size="sm">
            Get started
          </Button>
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
