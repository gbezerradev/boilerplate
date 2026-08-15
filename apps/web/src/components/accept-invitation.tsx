"use client";

import { Button, buttonVariants } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

export default function AcceptInvitation({ invitationId }: { invitationId?: string }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (!invitationId) {
    return (
      <InvitationCard
        title="Invitation unavailable"
        description="This invitation link is incomplete."
      />
    );
  }

  const callbackURL = `/accept-invitation?id=${encodeURIComponent(invitationId)}`;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h1>Join this workspace</h1>
        </CardTitle>
        <CardDescription>
          Invitations are bound to the invited email address and expire after seven days.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          <Link
            href={`/login?callbackURL=${encodeURIComponent(callbackURL)}`}
            className={buttonVariants({ variant: "default" })}
          >
            Sign in to accept
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

function InvitationCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          <h1>{title}</h1>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/login" className={buttonVariants({ variant: "default" })}>
          Go to sign in
        </Link>
      </CardContent>
    </Card>
  );
}
