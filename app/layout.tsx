import type { Metadata } from "next";
import SessionProvider from "@/components/Providers";
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
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
