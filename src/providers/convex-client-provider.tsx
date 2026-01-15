"use client";

import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || ""
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // Simple provider without Clerk for now - can add auth later
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    // If no Convex URL, just render children without provider
    return <>{children}</>;
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
