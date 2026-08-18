import { Button } from "@boilerplate/ui/components/button";

import { GithubIcon } from "@/components/icons/github-icon";
import { LogoIcon } from "@/components/logo";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Stories" },
  { href: "#faqs", label: "FAQ" },
  { href: "#contact", label: "Contact" },
  { href: "/login", label: "Sign in" },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl *:px-4 *:md:px-6">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex items-center justify-between">
          <a className="flex items-center gap-2 font-medium" href="/">
            <LogoIcon className="size-4" />
            SaaS
          </a>
          <Button
            aria-label="GitHub"
            nativeButton={false}
            render={
              <a
                href="https://github.com/gbezerradev/boilerplate"
                rel="noreferrer"
                target="_blank"
              />
            }
            size="icon"
            variant="ghost"
          >
            <GithubIcon />
          </Button>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a className="hover:text-foreground" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex items-center justify-between gap-4 border-t py-4 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} SaaS Boilerplate</p>
        <p>Built to be customized.</p>
      </div>
    </footer>
  );
}
