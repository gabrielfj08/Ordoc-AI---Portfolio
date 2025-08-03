import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Ordoc-AI - Ordem Inteligente no Cuidado",
  description: "Transforme conversas médicas em documentação perfeita. Plataforma completa de gestão documental e workflow empresarial com IA para profissionais de saúde.",
  keywords: "gestão documental, workflow médico, IA médica, assinatura digital, OCR, documentação médica, prontuário eletrônico",
  authors: [{ name: "Ordoc-AI Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Ordoc-AI - Ordem Inteligente no Cuidado",
    description: "Transforme conversas médicas em documentação perfeita com nossa plataforma de IA.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ordoc-AI - Ordem Inteligente no Cuidado",
    description: "Transforme conversas médicas em documentação perfeita com nossa plataforma de IA.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
