'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Settings, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Separator } from '@/components/ui/separator';

export const DashboardHeader = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { logout } = useAuth();
    const activeTab = searchParams.get('view') || 'home';
    const folderName = searchParams.get('folderName');

    const tabs = [
        { id: 'home', label: 'Minha Mesa' },
        { id: 'documents', label: 'Documentos' },
        { id: 'workflows', label: 'Workflows' },
        { id: 'signatures', label: 'Assinaturas' },
        { id: 'analytics', label: 'Analytics' },
    ];

    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('view', tabId);
        router.push(`?${params.toString()}`);
    };

    const handleLogout = () => {
        try {
            logout(); // Limpa estado/storage
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
        // Forçar navegação completa para limpar qualquer estado de memória
        window.location.href = '/login';
    };

    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleMobileTabChange = (tabId: string) => {
        handleTabChange(tabId);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 flex flex-col border-b bg-background z-10 w-full animate-in fade-in duration-300">
            <div className="flex h-16 shrink-0 items-center justify-between px-4">
                {/* Left: Trigger & Logo */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-orange-500/20">
                            O
                        </div>
                        <div className="flex flex-col leading-none hidden lg:flex">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">ORDOC AI</span>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-foreground">Minha Mesa</span>
                                {folderName && (
                                    <>
                                        <span className="text-muted-foreground/50">|</span>
                                        <span className="text-sm font-medium text-muted-foreground">{folderName}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Mobile Logo Text */}
                        <div className="flex flex-col leading-none lg:hidden">
                            <span className="text-sm font-bold text-foreground">Minha Mesa</span>
                        </div>
                    </div>
                </div>

                {/* Center: Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[400px] xl:max-w-none mask-gradient-x sm:mask-none absolute left-1/2 -translate-x-1/2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-orange-100 text-orange-700 font-semibold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Right: Actions & Profile & Mobile Toggle */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Mobile Toggle Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-muted-foreground"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>

                    <div className="flex items-center gap-1 border-r border-border/60 pr-4 hidden sm:flex">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary">
                            <Bell className="h-4 w-4" />
                        </Button>
                    </div>

                    <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <div className="text-right hidden lg:block">
                                    <div className="text-sm font-bold leading-none text-foreground group-hover:text-primary transition-colors">Ricardo Ferreira</div>
                                    <div className="text-[10px] text-muted-foreground font-medium">Coordenador Jurídico</div>
                                </div>
                                <Avatar className="h-8 w-8 border-2 border-background ring-1 ring-border bg-orange-100 dark:bg-orange-900/20 group-hover:opacity-80 transition-opacity">
                                    <AvatarFallback className="text-orange-600 dark:text-orange-400 font-bold text-[10px]">RF</AvatarFallback>
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56" onMouseDown={(e) => e.stopPropagation()}>
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => { handleTabChange('profile'); setIsUserMenuOpen(false); }}>
                                <UserCircle className="mr-2 h-4 w-4" />
                                <span>Meu Perfil</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => { handleTabChange('users'); setIsUserMenuOpen(false); }}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configurações</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <nav className="flex flex-col p-4 space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleMobileTabChange(tab.id)}
                                className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 text-left w-full ${activeTab === tab.id
                                    ? 'bg-orange-100 text-orange-700 font-semibold'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                        <div className="border-t my-2 pt-2 flex flex-col space-y-2 sm:hidden">
                            {/* Mobile-only extra actions */}
                            <button onClick={() => handleMobileTabChange('settings')} className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary/50">
                                <Settings className="h-4 w-4 mr-2" />
                                Configurações
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};
