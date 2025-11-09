import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ibe160 - Smart Food & Recipe Platform",
  description: "Reduce food waste, inspire cooking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
