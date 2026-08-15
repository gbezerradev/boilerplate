import { describe, expect, it } from "vitest";

import {
  sendOrganizationInvitationEmail,
  sendPasswordResetEmail,
  sendVerificationEmail,
  type EmailMessage,
} from ".";

class TestEmailProvider {
  messages: EmailMessage[] = [];

  async send(message: EmailMessage) {
    this.messages.push(message);
  }
}

describe("transactional auth emails", () => {
  it("renders a verification email with HTML and plain text", async () => {
    const provider = new TestEmailProvider();

    await sendVerificationEmail(
      { to: "ada@example.com", name: "Ada", url: "https://app.example.com/verify?token=secret" },
      provider,
    );

    expect(provider.messages).toHaveLength(1);
    expect(provider.messages[0]).toMatchObject({
      to: "ada@example.com",
      subject: "Verify your email address",
    });
    expect(provider.messages[0]?.html).toContain("https://app.example.com/verify?token=secret");
    expect(provider.messages[0]?.text).toContain("VERIFY YOUR EMAIL ADDRESS");
  });

  it("renders a password reset email", async () => {
    const provider = new TestEmailProvider();

    await sendPasswordResetEmail(
      { to: "ada@example.com", url: "https://app.example.com/reset-password?token=secret" },
      provider,
    );

    expect(provider.messages[0]?.subject).toBe("Reset your password");
    expect(provider.messages[0]?.text).toContain(
      "https://app.example.com/reset-password?token=secret",
    );
  });

  it("renders an organization invitation email", async () => {
    const provider = new TestEmailProvider();

    await sendOrganizationInvitationEmail(
      {
        to: "grace@example.com",
        url: "https://app.example.com/accept-invitation?id=invite-id",
        organizationName: "Acme",
        inviterName: "Ada",
      },
      provider,
    );

    expect(provider.messages[0]?.subject).toBe("You are invited to Acme");
    expect(provider.messages[0]?.text).toContain("Accept invitation");
  });
});
