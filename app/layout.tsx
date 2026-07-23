import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LifeCharter Executive Dashboard",
  description: "AI-powered command center for AmiLynne Carroll",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ivory-light">
        {children}
      </body>
    </html>
  );
}