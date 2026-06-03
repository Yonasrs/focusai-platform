import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FocusAI — Test Before You Publish",
    template: "%s — FocusAI",
  },
  description:
    "AI-powered pre-publication content review. Know how your content will perform before you hit publish. Hook analysis, retention analysis, clarity analysis.",
  keywords: [
    "content review",
    "AI content analysis",
    "pre-publication review",
    "hook analysis",
    "video analysis",
    "content score",
    "FocusAI",
  ],
  authors: [{ name: "FocusAI" }],
  creator: "FocusAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FocusAI",
    title: "FocusAI — Test Before You Publish",
    description:
      "AI-powered pre-publication content review. Know how your content will perform before you hit publish.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusAI — Test Before You Publish",
    description:
      "AI-powered pre-publication content review. Know how your content will perform before you hit publish.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* suppressHydrationWarning prevents mismatch from the anti-FOUC theme script */}
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Reads localStorage before React hydrates to avoid flash of wrong theme */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`,
            }}
          />
        </head>
        <body
          className={`${inter.className} bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text antialiased`}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
