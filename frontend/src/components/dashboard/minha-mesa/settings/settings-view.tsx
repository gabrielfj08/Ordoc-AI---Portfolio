'use client';

import React, { useState } from 'react';
import {
    UserCircle,
    Users,
    ShieldCheck,
    Lock,
    Settings,
    Building2,
    Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileSettings } from './profile-settings';
import { UsersManager } from './users-manager';
import { GroupsManager } from './groups-manager';
import { OrganizationsManager } from './organizations-manager';
import { AccessPoliciesManager } from './access-policies-manager';
import { CategorizationRules } from './categorization-rules';
import { Sparkles } from 'lucide-react';

type View = 'profile' | 'users' | 'groups' | 'organizations' | 'policies' | 'categorization';

interface SettingsViewProps {
    initialView?: View;
}

import { SettingsProvider } from './settings-context';

export const SettingsView = ({ initialView = 'profile' }: SettingsViewProps) => {
    const [view, setView] = useState<View>(initialView);

    return (
        <SettingsProvider>
            {view === 'profile' ? (
                <ProfileSettings />
            ) : (
                <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Main Content Area (Left) */}
                        <div className="lg:col-span-8 space-y-4">
                            {view === 'users' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h2>
                                    </div>
                                    <UsersManager />
                                </div>
                            )}

                            {view === 'groups' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">Grupos de Acesso</h2>
                                    </div>
                                    <GroupsManager />
                                </div>
                            )}

                            {view === 'organizations' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">Organizações e Filiais</h2>
                                    </div>
                                    <OrganizationsManager />
                                </div>
                            )}

                            {view === 'policies' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">Políticas de Acesso</h2>
                                    </div>
                                    <AccessPoliciesManager />
                                </div>
                            )}

                            {view === 'categorization' && (
                                <CategorizationRules />
                            )}
                        </div>

                        {/* Sidebar Navigation (Right) */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur sticky top-6">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gestão da Plataforma</CardTitle>
                                </CardHeader>
                                <CardContent className="p-2 space-y-1">
                                    <button
                                        onClick={() => setView('users')}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'users' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                                    >
                                        <Users className={`w-5 h-5 ${view === 'users' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Usuários</span>
                                    </button>
                                    <button
                                        onClick={() => setView('groups')}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'groups' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                                    >
                                        <Shield className={`w-5 h-5 ${view === 'groups' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Grupos</span>
                                    </button>
                                    <button
                                        onClick={() => setView('organizations')}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'organizations' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                                    >
                                        <Building2 className={`w-5 h-5 ${view === 'organizations' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Organizações</span>
                                    </button>
                                    <button
                                        onClick={() => setView('policies')}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'policies' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                                    >
                                        <ShieldCheck className={`w-5 h-5 ${view === 'policies' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Políticas de Acesso</span>
                                    </button>
                                    <button
                                        onClick={() => setView('categorization')}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${view === 'categorization' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                                    >
                                        <Sparkles className={`w-5 h-5 ${view === 'categorization' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Regras de Categorização</span>
                                    </button>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            )}
        </SettingsProvider>
    );
};
