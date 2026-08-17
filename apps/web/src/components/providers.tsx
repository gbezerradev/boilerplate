"use client";

import { Toaster } from "@boilerplate/ui/components/sonner";
import { TooltipProvider } from "@boilerplate/ui/components/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/utils/trpc";

import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
          <ReactQueryDevtools />
        </TooltipProvider>
      </QueryClientProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}
