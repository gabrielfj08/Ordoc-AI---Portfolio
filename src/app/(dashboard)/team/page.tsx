"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { Users, Building2, Shield, Lock, FileText } from "lucide-react";
import { TeamHierarchy } from "@/components/team/TeamHierarchy";
import { TeamActivity } from "@/components/team/TeamActivity";
import { GlobalSettings } from "@/components/team/GlobalSettings";
import { useRouter } from "next/navigation";

export default function TeamPage() {
    const router = useRouter();

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

                {/* Navegação Rápida */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => router.push("/team/roles")}
                        className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-2xl p-4 text-left transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-500 rounded-xl">
                                <Shield size={20} className="text-white" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Funções e Permissões</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Gerencie roles e níveis de acesso
                        </p>
                    </button>

                    <button
                        onClick={() => router.push("/team/policies")}
                        className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl p-4 text-left transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-500 rounded-xl">
                                <Lock size={20} className="text-white" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Políticas IAM</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Configure políticas de acesso
                        </p>
                    </button>

                    <button
                        onClick={() => router.push("/team/audit")}
                        className="bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-2xl p-4 text-left transition-all hover:shadow-md"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500 rounded-xl">
                                <FileText size={20} className="text-white" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Log de Auditoria</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Rastreamento completo de ações
                        </p>
                    </button>
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
