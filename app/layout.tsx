import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chop Chop",
  description: "Chop em vids to reels/toks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
