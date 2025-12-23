import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Ordoc-AI - Ordem Inteligente no Cuidado",
  description: "Transforme conversas médicas em documentação perfeita. Plataforma completa de gestão documental e workflow empresarial com IA para profissionais de saúde.",
  keywords: "gestão documental, workflow médico, IA médica, assinatura digital, OCR, documentação médica, prontuário eletrônico",
  authors: [{ name: "Ordoc-AI Team" }],
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
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-right" />
              <SonnerToaster position="top-right" richColors />
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
