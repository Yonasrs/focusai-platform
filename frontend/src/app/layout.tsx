import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
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
      {/* suppressHydrationWarning prevents mismatch from the anti-FOUC script below */}
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Reads localStorage before React hydrates so there's no flash of wrong theme */}
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
