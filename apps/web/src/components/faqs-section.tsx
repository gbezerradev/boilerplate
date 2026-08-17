import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@boilerplate/ui/components/accordion";

import { DecorIcon } from "@/components/decor-icon";

const faqs = [
  {
    id: "included",
    title: "What is included in this boilerplate?",
    content:
      "It includes a production-oriented Next.js application, Better Auth flows, multi-tenant organizations, role-based access, Stripe billing, PostgreSQL persistence, background jobs, storage, integrations, audit logs, and a reusable shadcn interface.",
  },
  {
    id: "customize",
    title: "Can I replace the branding and product screens?",
    content:
      "Yes. Every screen and component lives in your codebase. The neutral Nova design system gives you a consistent starting point while keeping copy, navigation, colors, and product modules fully editable.",
  },
  {
    id: "authentication",
    title: "Which authentication flows are ready?",
    content:
      "Email and password sign-up, email verification, sign-in, password recovery, session management, organization onboarding, and invitation acceptance are already structured around Better Auth.",
  },
  {
    id: "tenancy",
    title: "How does multi-tenancy work?",
    content:
      "Users work inside an active organization. Server-side context resolves membership and permissions, while tenant identifiers are derived from the authenticated session instead of trusting product inputs.",
  },
  {
    id: "billing",
    title: "Is Stripe billing already connected?",
    content:
      "The foundation includes checkout, customer portal, subscription lifecycle webhooks, entitlements, and organization-scoped billing permissions. You still provide your Stripe keys, products, prices, and final plan copy.",
  },
  {
    id: "production",
    title: "What do I need before deploying?",
    content:
      "Configure the documented environment variables, database, email delivery, Stripe webhooks, object storage, and production domains. Then run the included checks and deployment workflow for your platform.",
  },
];

export function FaqsSection() {
  return (
    <section
      id="faqs"
      className="grid w-full scroll-mt-24 grid-cols-1 border-t md:min-h-[42rem] md:grid-cols-2"
    >
      <div className="px-4 pt-16 pb-10 md:px-8 md:py-24">
        <div className="flex flex-col gap-5 md:sticky md:top-28">
          <p className="font-mono text-muted-foreground text-xs tracking-[0.2em] uppercase">FAQ</p>
          <h2 className="text-balance font-bold text-4xl md:text-5xl lg:font-black">
            Frequently Asked Questions
          </h2>
          <p className="max-w-md text-muted-foreground">
            Quick answers about what is ready, what stays customizable, and what you need before
            shipping your SaaS.
          </p>
          <p className="text-muted-foreground">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href="https://github.com/gbezerradev/boilerplate/issues"
              rel="noreferrer"
              target="_blank"
            >
              Open an issue
            </a>
          </p>
        </div>
      </div>

      <div className="relative place-content-center border-t md:border-t-0 md:border-l">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-3 h-full w-px bg-border"
        />

        <Accordion className="rounded-none border-y">
          {faqs.map((item) => (
            <AccordionItem className="group relative pl-5" key={item.id} value={item.id}>
              <DecorIcon className="left-[13px] size-3 group-last:hidden" position="bottom-left" />
              <AccordionTrigger className="px-4 py-4 hover:no-underline focus-visible:underline focus-visible:ring-0">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-muted-foreground">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
