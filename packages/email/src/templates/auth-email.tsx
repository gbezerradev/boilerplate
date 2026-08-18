import * as React from "react";

void React;

interface AuthEmailProps {
  preview: string;
  heading: string;
  body: string;
  actionLabel: string;
  actionUrl: string;
  recipientName?: string;
}

export function AuthEmail({
  preview,
  heading,
  body,
  actionLabel,
  actionUrl,
  recipientName,
}: AuthEmailProps) {
  return (
    <html lang="en">
      <head>
        <meta content="text/html; charset=UTF-8" httpEquiv="Content-Type" />
      </head>
      <body style={styles.body}>
        <div style={styles.preview}>{preview}</div>
        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={styles.container}
                >
                  <tbody>
                    <tr>
                      <td>
                        <p style={styles.brand}>BOILERPLATE</p>
                        <h1 style={styles.heading}>{heading}</h1>
                        <p style={styles.text}>Hi{recipientName ? ` ${recipientName}` : ""},</p>
                        <p style={styles.text}>{body}</p>
                        <a href={actionUrl} style={styles.button}>
                          {actionLabel}
                        </a>
                        <p style={styles.help}>
                          If the button does not work, copy and paste this link into your browser:
                        </p>
                        <p style={styles.link}>{actionUrl}</p>
                        <hr style={styles.rule} />
                        <p style={styles.footer}>
                          If you did not request this email, you can safely ignore it.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

AuthEmail.PreviewProps = {
  preview: "Confirm your email address to activate your account.",
  heading: "Verify your email address",
  body: "Confirm your email address to finish creating your account.",
  actionLabel: "Verify email",
  actionUrl: "http://localhost:3000/api/auth/verify-email?token=example",
  recipientName: "Ada",
} satisfies AuthEmailProps;

export default AuthEmail;

const styles = {
  body: {
    backgroundColor: "#f4f4f5",
    color: "#18181b",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: "32px 12px",
  },
  preview: {
    display: "none",
    maxHeight: 0,
    maxWidth: 0,
    opacity: 0,
    overflow: "hidden",
  },
  container: {
    backgroundColor: "#ffffff",
    border: "1px solid #e4e4e7",
    margin: "0 auto",
    maxWidth: "520px",
    padding: "32px",
  },
  brand: {
    color: "#71717a",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    margin: "0 0 24px",
  },
  heading: {
    fontSize: "24px",
    lineHeight: "1.3",
    margin: "0 0 20px",
  },
  text: {
    fontSize: "15px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },
  button: {
    backgroundColor: "#18181b",
    borderRadius: "0",
    color: "#ffffff",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    margin: "8px 0 24px",
    padding: "12px 20px",
    textDecoration: "none",
  },
  help: {
    color: "#71717a",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0 0 6px",
  },
  link: {
    color: "#3f3f46",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: 0,
    overflowWrap: "anywhere" as const,
  },
  rule: {
    borderColor: "#e4e4e7",
    margin: "28px 0 20px",
  },
  footer: {
    color: "#71717a",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: 0,
  },
};
