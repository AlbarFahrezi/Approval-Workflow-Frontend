import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Approval Workflow",
  description: "Approval Workflow Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}