"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth-shell";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

interface LoginPanelProps {
  notice: "verified" | "reset" | null;
  error?: string;
  callbackURL: string;
}

export default function LoginPanel({ notice, error, callbackURL }: LoginPanelProps) {
  const [showSignIn, setShowSignIn] = useState(true);

  useEffect(() => {
    if (notice === "verified") {
      toast.success("Email verified. You can now sign in.");
    }

    if (notice === "reset") {
      toast.success("Password updated. Sign in with your new password.");
    }

    if (error) {
      toast.error("This authentication link is invalid or has expired.");
    }
  }, [error, notice]);

  return (
    <AuthShell
      title={showSignIn ? "Welcome back" : "Create your account"}
      description={
        showSignIn
          ? "Sign in to continue to your workspace."
          : "Start a new workspace in a few seconds."
      }
      footer={
        <>
          By continuing, you agree to our{" "}
          <a className="underline underline-offset-4 hover:text-primary" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="underline underline-offset-4 hover:text-primary" href="#">
            Privacy Policy
          </a>
          .
        </>
      }
    >
      {showSignIn ? (
        <SignInForm callbackURL={callbackURL} onSwitchToSignUp={() => setShowSignIn(false)} />
      ) : (
        <SignUpForm callbackURL={callbackURL} onSwitchToSignIn={() => setShowSignIn(true)} />
      )}
    </AuthShell>
  );
}
