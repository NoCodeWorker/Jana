"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MockDataProvider } from "@/components/mock-data-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <MockDataProvider>
        <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
      </MockDataProvider>
    </ThemeProvider>
  );
}

