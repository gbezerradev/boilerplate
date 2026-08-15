import { buttonVariants } from "@boilerplate/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@boilerplate/ui/components/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-full items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <h1>Page not found</h1>
          </CardTitle>
          <CardDescription>The page you requested does not exist or was moved.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Check the address or return to the home page.</p>
        </CardContent>
        <CardFooter>
          <Link href="/" className={buttonVariants()}>
            Return home
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
