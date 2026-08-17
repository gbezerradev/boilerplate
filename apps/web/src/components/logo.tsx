import type React from "react";

export function LogoIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 2h6v4h-6v-4Z" fill="currentColor" />
      <path d="M14 12h3v3h-3v-3Z" fill="currentColor" opacity=".55" />
    </svg>
  );
}
