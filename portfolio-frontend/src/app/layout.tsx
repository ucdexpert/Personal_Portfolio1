import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourportfolio.com"),
  title: "Muhammad Uzair | Full Stack Developer & UI/UX Designer",
  description:
    "Passionate Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js. Building beautiful, functional, and user-centered digital experiences. Based in Karachi, Pakistan.",
  keywords: [
    "Muhammad Uzair",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "UI/UX Designer",
    "Web Developer",
    "Frontend Developer",
    "Backend Developer",
    "Karachi",
    "Pakistan",
  ],
  authors: [{ name: "Muhammad Uzair" }],
  creator: "Muhammad Uzair",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    siteName: "Muhammad Uzair Portfolio",
    title: "Muhammad Uzair | Full Stack Developer & UI/UX Designer",
    description:
      "Passionate Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Uzair Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Uzair | Full Stack Developer & UI/UX Designer",
    description:
      "Passionate Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js.",
    creator: "@UzairKhilj60869",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
