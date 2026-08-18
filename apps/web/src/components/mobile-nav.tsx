import { Button } from "@boilerplate/ui/components/button";
import { cn } from "@boilerplate/ui/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { navLinks } from "@/components/header";
import { Portal, PortalBackdrop } from "@/components/portal";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? <XIcon /> : <MenuIcon />}
      </Button>
      {open ? (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4",
            )}
            data-slot="open"
          >
            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  className="justify-start"
                  key={link.label}
                  nativeButton={false}
                  render={<a href={link.href} />}
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Button>
              ))}
            </div>
            <div className="mt-12 flex flex-col gap-2">
              <Button
                className="w-full"
                nativeButton={false}
                render={<Link href="/login" />}
                variant="outline"
              >
                Sign in
              </Button>
              <Button className="w-full" nativeButton={false} render={<Link href="/login" />}>
                Get started
              </Button>
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  );
}
