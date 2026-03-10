import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
};

export const metadata: Metadata = {
  title: "SAAS Checklist",
  description: "Plataforma Premium de Gestão de Checklists para Restaurantes",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Checklist",
  },
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
