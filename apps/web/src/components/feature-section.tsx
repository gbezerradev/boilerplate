import { cn } from "@boilerplate/ui/lib/utils";
import { BlocksIcon, Building2Icon, CreditCardIcon, ShieldCheckIcon } from "lucide-react";
import type React from "react";

type FeatureType = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export function FeatureSection() {
  return (
    <section id="features" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto mb-10 max-w-xl px-4 text-center">
        <p className="font-mono text-muted-foreground text-xs uppercase tracking-widest">
          Included
        </p>
        <h2 className="mt-3 font-bold text-2xl tracking-tight md:text-3xl">
          The infrastructure a SaaS actually needs
        </h2>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 py-4 md:grid-cols-4">
        {features.map((feature, index) => (
          <div
            className={cn(
              "relative flex flex-col items-center justify-center p-2",
              "after:absolute after:inset-y-0 after:right-0 after:h-full after:w-px after:bg-linear-to-b after:from-foreground/6 after:via-foreground/25 after:to-foreground/6",
              "[&_svg]:size-6 [&_svg]:text-muted-foreground",
              {
                "after:hidden": index === features.length - 1,
                "after:hidden after:md:block": index === 1,
              },
            )}
            key={feature.title}
          >
            {feature.icon}
            <h3 className="mt-4 text-center font-medium text-xs md:text-sm lg:text-base">
              {feature.title}
            </h3>
            <p className="mt-1 text-center text-[10px] text-muted-foreground md:text-xs">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

const features: FeatureType[] = [
  {
    title: "Secure authentication",
    icon: <ShieldCheckIcon />,
    description: "Email flows, sessions and account security.",
  },
  {
    title: "Multi-tenant workspaces",
    icon: <Building2Icon />,
    description: "Organizations, invitations and role-based access.",
  },
  {
    title: "Billing ready",
    icon: <CreditCardIcon />,
    description: "Plans, subscriptions and billing boundaries.",
  },
  {
    title: "Composable stack",
    icon: <BlocksIcon />,
    description: "Type-safe APIs, jobs, storage and integrations.",
  },
];
