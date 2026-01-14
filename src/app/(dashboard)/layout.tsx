// Layout para páginas do dashboard (com Topbar)
import { Topbar } from '@/components/layout/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen w-full flex flex-col overflow-hidden">
            <Topbar />
            <main className="flex-1 w-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
