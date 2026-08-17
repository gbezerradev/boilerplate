import { HttpErrorPage } from "@/components/http-error-page";

export default function NotFound() {
  return (
    <HttpErrorPage
      code="404"
      description="The page you are looking for may have moved, been removed, or never existed."
      title="Page not found"
    />
  );
}
