import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multi-Lang",
  description: "Multi-Language dynamic page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* Adicionando suspensão de verificação do userSearch */
    <Suspense>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Suspense>
  );
}
