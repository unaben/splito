import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Splito — split expenses with friends",
  description: "Track group expenses and settle up easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
