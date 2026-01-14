"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { Users, Building2 } from "lucide-react";
import { TeamHierarchy } from "@/components/team/TeamHierarchy";
import { TeamActivity } from "@/components/team/TeamActivity";
import { GlobalSettings } from "@/components/team/GlobalSettings";

export default function TeamPage() {
    return (
        <MainContainer>
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-blue-500 rounded-2xl">
                            <Users size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground">Gestão de Ecossistema</h1>
                            <p className="text-sm text-muted-foreground">Orquestre seu time e defina a governança da IA</p>
                        </div>
                    </div>
                </div>

                {/* Hierarquia de Time */}
                <TeamHierarchy />

                {/* Grid: Atividade + Configurações Globais */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TeamActivity />
                    <GlobalSettings />
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-[40px] p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500 rounded-xl shrink-0">
                            <Building2 size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-foreground mb-1">Organização: Cofre Soberano Brasil</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Você está gerenciando <strong>5 membros</strong> com diferentes níveis de acesso.
                                As configurações globais aplicam-se a todos os usuários da organização.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}
