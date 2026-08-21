import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relay — conversations, kept close",
  description:
    "A focused chat space for direct conversations and small groups.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
