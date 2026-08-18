import { cn } from "@boilerplate/ui/lib/utils";

import { DecorIcon } from "@/components/decor-icon";

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main
      id="main-content"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden px-6 py-12 md:px-8"
    >
      <section
        aria-labelledby="auth-title"
        className={cn(
          "relative flex w-full max-w-sm flex-col justify-between p-6 md:p-8",
          "dark:bg-[radial-gradient(50%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]",
        )}
      >
        <div className="absolute -inset-y-6 -left-px w-px bg-border" />
        <div className="absolute -inset-y-6 -right-px w-px bg-border" />
        <div className="absolute -inset-x-6 -top-px h-px bg-border" />
        <div className="absolute -inset-x-6 -bottom-px h-px bg-border" />
        <DecorIcon position="top-left" />
        <DecorIcon position="bottom-right" />

        <div className="flex w-full max-w-sm animate-in flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h1 id="auth-title" className="font-bold text-2xl tracking-wide">
              {title}
            </h1>
            <p className="text-base text-muted-foreground">{description}</p>
          </div>
          {children}
          {footer ? <div className="text-muted-foreground text-sm">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
