import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainHeader } from "./components/main-header"
import { QueryProvider } from "@/components/providers/query-provider"
import { AuthInitializer } from "@/components/providers/auth-initializer"
import { NotificationsProvider } from "@/components/providers/notifications-provider"
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          <AuthInitializer>
            <NotificationsProvider>
              <MainHeader />
              {children}

              {/* Botão flutuante global */}
              <button className="fixed bottom-8 right-8 size-14 rounded-full bg-orange-600 text-primary-foreground shadow-2xl hover:shadow-primary/20 hover:scale-110 transition-all flex items-center justify-center group z-30">
                <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
              </button>

              <Toaster />
            </NotificationsProvider>
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  )
}
