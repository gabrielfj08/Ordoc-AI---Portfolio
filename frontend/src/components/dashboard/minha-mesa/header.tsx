'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Bell, Settings, LogOut, UserCircle } from 'lucide-react';
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

    return (
        <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 z-10 w-full animate-in fade-in duration-300">
            {/* Left: Trigger & Logo */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-orange-500/20">
                        O
                    </div>
                    <div className="flex flex-col leading-none hidden md:flex">
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
                </div>
            </div>

            {/* Center: Navigation */}
            <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[400px] lg:max-w-none mask-gradient-x sm:mask-none absolute left-1/2 -translate-x-1/2 hidden md:flex">
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

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 border-r border-border/60 pr-4">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary">
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary"
                        onClick={() => handleTabChange('settings')}
                    >
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>

                <DropdownMenu>
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
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleTabChange('settings')}>
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Meu Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTabChange('settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" asChild>
                            <Link href="/">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Sair</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};
