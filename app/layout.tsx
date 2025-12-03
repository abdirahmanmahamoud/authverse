import "@/app/global.css";
import ThemeProvider from "@/components/themeProvider";
import { RootProvider } from "fumadocs-ui/provider";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Authverse",
    template: "%s | Authverse",
  },
  description:
    "Authverse is a modern, open-source CLI tool that generates a complete authentication system instantly inside your project.",
  keywords: ["Nextjs", "shadcn", "better auth"],
  authors: [
    {
      name: "Abdirahman Mohamoud",
      url: "https://www.abdirahmandev.com",
    },
  ],
  creator: "Abdirahman Mohamoud",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://authverse.dev",
    title: "Authverse",
    description:
      "Authverse is a modern, open-source CLI tool that generates a complete authentication system instantly inside your project.",
    siteName: "Authverse",
    images: [
      {
        url: "https://authverse.dev/og.png",
        width: 800,
        height: 600,
        alt: "Authverse",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Authverse",
    description:
      "Authverse is a modern, open-source CLI tool that generates a complete authentication system instantly inside your project.",
    images: ["https://authverse.dev/og.png"],
    creator: "@abdumahamoud",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo-1.png",
    apple: "/logo-1.png",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
