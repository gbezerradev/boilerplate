import { BugIcon, MessagesSquareIcon } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { DecorIcon } from "@/components/decor-icon";

const contactOptions = [
  {
    title: "Report an issue",
    value: "GitHub Issues",
    href: "https://github.com/gbezerradev/boilerplate/issues",
    icon: BugIcon,
  },
  {
    title: "Ask the community",
    value: "GitHub Discussions",
    href: "https://github.com/gbezerradev/boilerplate/discussions",
    icon: MessagesSquareIcon,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 border-t px-4 py-16 md:py-24">
      <div className="relative mx-auto w-full max-w-xl border bg-background">
        <div className="border-b px-6 py-8">
          <div className="mb-8 flex flex-col gap-2">
            <p className="font-mono text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Contact
            </p>
            <h2 className="font-semibold text-2xl tracking-tight md:text-3xl">Get in touch</h2>
            <p className="text-muted-foreground text-sm">
              Have a question, found an issue, or want to adapt this foundation to your product?
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {contactOptions.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  className="flex items-center gap-4 rounded-md p-2 hover:bg-muted"
                  href={item.href}
                  key={item.title}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Icon className="size-5 text-muted-foreground" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm">{item.title}</span>
                    <span className="text-muted-foreground text-xs">{item.value}</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="mb-8 flex flex-col gap-1.5">
            <h3 className="font-medium text-xl">Send a message</h3>
            <p className="text-muted-foreground text-sm">
              This reusable form is ready for your preferred support workflow.
            </p>
          </div>
          <ContactForm />
        </div>

        <DecorIcon position="top-left" />
        <DecorIcon position="top-right" />
        <DecorIcon position="bottom-left" />
        <DecorIcon position="bottom-right" />
      </div>
    </section>
  );
}
