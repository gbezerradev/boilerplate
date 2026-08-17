"use client";

import { Button } from "@boilerplate/ui/components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthShell } from "@/components/auth-shell";
import { authClient } from "@/lib/auth-client";

export default function AcceptInvitation({ invitationId }: { invitationId?: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (!invitationId) {
    return (
      <InvitationState
        title="Invitation unavailable"
        description="This invitation link is incomplete."
      />
    );
  }

  const callbackURL = `/accept-invitation?id=${encodeURIComponent(invitationId)}`;

  return (
    <AuthShell
      title="Join this workspace"
      description="Invitations are bound to the invited email address and expire after seven days."
    >
      {isPending ? (
        <p className="text-muted-foreground">Checking your account…</p>
      ) : session?.user ? (
        <Button
          className="w-full"
          onClick={async () => {
            await authClient.organization.acceptInvitation(
              { invitationId },
              {
                onSuccess: () => {
                  toast.success("Invitation accepted.");
                  router.push("/dashboard");
                  router.refresh();
                },
                onError: ({ error }) => {
                  toast.error(error.message || error.statusText);
                },
              },
            );
          }}
        >
          Accept invitation
        </Button>
      ) : (
        <Button
          nativeButton={false}
          render={<Link href={`/login?callbackURL=${encodeURIComponent(callbackURL)}`} />}
        >
          Sign in to accept
        </Button>
      )}
    </AuthShell>
  );
}

function InvitationState({ title, description }: { title: string; description: string }) {
  return (
    <AuthShell title={title} description={description}>
      <Button nativeButton={false} render={<Link href="/login" />}>
        Go to sign in
      </Button>
    </AuthShell>
  );
}
