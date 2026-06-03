import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FocusAI — Test Before You Publish",
  description:
    "AI-powered pre-publication content review. Know how your content will perform before you hit publish.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} bg-dark-bg text-dark-text antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
