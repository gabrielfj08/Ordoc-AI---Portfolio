// src/app/layout.tsx
import { ToastProvider } from '@/components/ui/toast-context';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/QueryProvider';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className="h-screen w-full bg-[#FDFDFD]">
        <QueryProvider>
          <ToastProvider>
            {children}
            <ShadcnToaster />
            <Toaster position="top-right" richColors />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}