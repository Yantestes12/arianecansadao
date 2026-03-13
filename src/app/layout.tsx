import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cansadão Repasse - AI Verifier",
  description: "API e dashboard de validação de imagens de carros via Inteligência Artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
