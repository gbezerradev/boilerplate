import { AuthShell } from "@/components/auth-shell";
import ForgotPasswordForm from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter your account email and we will send you a secure reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
