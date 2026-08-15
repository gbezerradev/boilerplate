"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  return showSignIn ? (
    <SignInForm callbackURL={callbackURL} onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm callbackURL={callbackURL} onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}
