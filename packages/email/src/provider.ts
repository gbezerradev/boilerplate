import { env } from "@boilerplate/env/server";
import { Resend } from "resend";

export interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage) {
    console.info(
      JSON.stringify({
        level: "info",
        event: "email.sent",
        provider: "console",
        ...message,
      }),
    );
  }
}

export class ResendEmailProvider implements EmailProvider {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage) {
    const { error } = await this.client.emails.send(message);

    if (error) {
      throw new Error(`Resend rejected the email: ${error.message}`);
    }
  }
}

export function assertEmailConfiguration() {
  if (env.EMAIL_PROVIDER === "resend" && !env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER is resend");
  }
}

export function createEmailProvider(): EmailProvider {
  assertEmailConfiguration();

  if (env.EMAIL_PROVIDER === "resend") {
    return new ResendEmailProvider(env.RESEND_API_KEY!);
  }

  return new ConsoleEmailProvider();
}
