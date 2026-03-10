import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAAS Checklist",
  description: "Plataforma Premium de Gestão de Checklists para Restaurantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen text-slate-50 antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
