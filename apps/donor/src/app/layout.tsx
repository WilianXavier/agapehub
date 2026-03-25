import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ÁgapeHub — Doe com propósito",
  description: "Plataforma de doações para igrejas e organizações religiosas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
