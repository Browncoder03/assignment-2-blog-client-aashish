import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";

import { ThemeProvider } from "@/components/Themes/ThemeContext";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Full-Stack Blog",
  description: "Blog about full stack development",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read the saved theme from cookies
  const serverCookies = await cookies();

  const theme =
    serverCookies.get("theme")?.value === "dark"
      ? "dark"
      : "light";

  return (
    <html lang="en" data-theme={theme}>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {/* ThemeProvider allows all child components
            to access and change the theme */}
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}