import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "@/providers/convex-client-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ComparisonProvider } from "@/contexts/comparison-context";
import { ComparisonBar } from "@/components/monitors/comparison-bar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Owners Club | Honest Monitor Reviews",
    template: "%s | Owners Club",
  },
  description:
    "Join the Owners Club community for honest, in-depth monitor reviews from real users and experts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <ComparisonProvider>
              {children}
              <ComparisonBar />
              <Toaster position="bottom-right" />
            </ComparisonProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
