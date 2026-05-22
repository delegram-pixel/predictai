import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PredictAI — No-Show Intelligence",
  description: "AI-powered appointment cancellation & no-show prediction system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
