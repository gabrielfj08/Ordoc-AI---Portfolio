import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainHeader } from "./components/main-header"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { AlertsProvider } from "@/contexts/alerts-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ordoc - Gestão Inteligente de Documentos",
  description: "Plataforma de gestão documental com IA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <AlertsProvider>
              <MainHeader />
              {children}

              {/* Botão flutuante global */}
              <button className="fixed bottom-8 right-8 size-14 rounded-full bg-orange-600 text-primary-foreground shadow-2xl hover:shadow-primary/20 hover:scale-110 transition-all flex items-center justify-center group z-30">
                <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
              </button>

              <Toaster />
            </AlertsProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
