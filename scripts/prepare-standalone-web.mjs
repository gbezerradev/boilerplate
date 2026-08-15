import { access, cp, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const workspaceRoot = resolve(import.meta.dirname, "..");
const webRoot = resolve(workspaceRoot, "apps/web");
const standaloneWebRoot = resolve(webRoot, ".next/standalone/apps/web");

await mkdir(resolve(standaloneWebRoot, ".next"), { recursive: true });
await cp(resolve(webRoot, ".next/static"), resolve(standaloneWebRoot, ".next/static"), {
  recursive: true,
  force: true,
});

try {
  await access(resolve(webRoot, "public"));
  await cp(resolve(webRoot, "public"), resolve(standaloneWebRoot, "public"), {
    recursive: true,
    force: true,
  });
} catch {
  // The public directory is optional in Next.js applications.
}
