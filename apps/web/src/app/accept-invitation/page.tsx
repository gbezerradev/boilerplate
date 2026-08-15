import AcceptInvitation from "@/components/accept-invitation";

interface AcceptInvitationPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AcceptInvitationPage({ searchParams }: AcceptInvitationPageProps) {
  const { id } = await searchParams;

  return (
    <main id="main-content" className="flex min-h-svh items-center justify-center px-4 py-12">
      <AcceptInvitation invitationId={id} />
    </main>
  );
}
