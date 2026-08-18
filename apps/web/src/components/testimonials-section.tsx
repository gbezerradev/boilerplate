import { Avatar, AvatarFallback } from "@boilerplate/ui/components/avatar";
import { cn } from "@boilerplate/ui/lib/utils";
import { QuoteIcon } from "lucide-react";

import { DecorIcon } from "@/components/decor-icon";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "The organization model and permission boundaries gave our product team a clear foundation instead of another prototype to rewrite.",
    name: "Alex Morgan",
    role: "Product lead",
    company: "Example Labs",
    initials: "AM",
  },
  {
    quote:
      "Authentication, billing, storage, and audit trails already speak the same language. That makes the first production decisions much easier.",
    name: "Jordan Lee",
    role: "Engineering lead",
    company: "Example Cloud",
    initials: "JL",
  },
  {
    quote:
      "The UI feels like a real product on day one, while every component remains local and straightforward to adapt to our brand.",
    name: "Taylor Reed",
    role: "Founder",
    company: "Example SaaS",
    initials: "TR",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="scroll-mt-24 border-t px-4 py-16 md:px-6 md:py-24">
      <div className="mb-14 flex max-w-2xl flex-col gap-3">
        <p className="font-mono text-muted-foreground text-xs tracking-[0.2em] uppercase">
          Example testimonials
        </p>
        <h2 className="text-balance font-semibold text-3xl tracking-tight md:text-4xl">
          Show the outcome, not just the feature list
        </h2>
        <p className="text-muted-foreground">
          Replace these illustrative stories with verified customer feedback when your product goes
          live.
        </p>
      </div>

      <div className="grid w-full gap-8 pb-4 md:grid-cols-3 md:gap-6 md:pb-24">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard index={index} key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
  index: number;
}) {
  const { quote, name, role, company, initials } = testimonial;

  return (
    <figure
      className={cn(
        "relative flex flex-col justify-between gap-6 px-8 pt-8 pb-6 shadow-xs md:translate-y-[calc(3rem*var(--testimonial-index))]",
        className,
      )}
      style={{ "--testimonial-index": index } as React.CSSProperties}
      {...props}
    >
      <div aria-hidden="true" className="absolute -inset-y-4 -left-px w-px bg-border" />
      <div aria-hidden="true" className="absolute -inset-y-4 -right-px w-px bg-border" />
      <div aria-hidden="true" className="absolute -inset-x-4 -top-px h-px bg-border" />
      <div aria-hidden="true" className="absolute -right-4 -bottom-px -left-4 h-px bg-border" />
      <DecorIcon className="size-3.5" position="top-left" />

      <blockquote className="flex gap-4">
        <QuoteIcon aria-hidden="true" className="size-6 shrink-0 stroke-1" />
        <p className="flex-1 text-base text-muted-foreground leading-relaxed">{quote}</p>
      </blockquote>

      <figcaption className="flex items-center gap-3">
        <Avatar className="size-10 rounded-full ring-2 ring-border ring-offset-2 ring-offset-background">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="flex flex-col">
          <cite className="font-medium text-foreground text-sm not-italic">{name}</cite>
          <span className="text-muted-foreground text-xs">
            {role}, <span className="text-foreground/80">{company}</span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
