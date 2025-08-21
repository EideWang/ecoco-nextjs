import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/layouts/AuthProvider";
import * as React from "react";
import ClientThemeProvider from "@/components/layouts/ClientThemeProvider";
import { AuthRedirectWrapper } from "@/components/layouts/AuthRedirectWrapper";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ECOCO",
  description: "Your eco-friendly companion",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ECOCO",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "zh_Hant",
    url: "https://ecoco.app",
    title: "ECOCO",
    description: "Your eco-friendly companion",
    siteName: "ECOCO",
  },
  twitter: {
    card: "summary",
    title: "ECOCO",
    description: "Your eco-friendly companion",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>
        <AuthProvider>
          <AuthRedirectWrapper>
            <ClientThemeProvider>{children}</ClientThemeProvider>
          </AuthRedirectWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
