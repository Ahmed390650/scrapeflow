import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AppProviders from "@/components/providers/AppProviders";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/sign-in"}
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-sm !shadow-none",
          footer: "hidden",
        },
      }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <main>
            <AppProviders>{children}</AppProviders>
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
