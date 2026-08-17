import LoginPanel from "@/components/login-panel";

interface LoginPageProps {
  searchParams: Promise<{
    verified?: string;
    reset?: string;
    error?: string;
    callbackURL?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const notice = params.verified === "true" ? "verified" : params.reset === "true" ? "reset" : null;
  const callbackURL =
    params.callbackURL?.startsWith("/") && !params.callbackURL.startsWith("//")
      ? params.callbackURL
      : "/dashboard";

  return <LoginPanel notice={notice} error={params.error} callbackURL={callbackURL} />;
}
