import AcceptInvitation from "@/components/accept-invitation";

interface AcceptInvitationPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AcceptInvitationPage({ searchParams }: AcceptInvitationPageProps) {
  const { id } = await searchParams;

  return <AcceptInvitation invitationId={id} />;
}
