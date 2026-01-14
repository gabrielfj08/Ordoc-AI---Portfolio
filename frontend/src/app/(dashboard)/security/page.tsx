"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { Shield, Lock, Eye } from "lucide-react";
import { SharingControl } from "@/components/security/SharingControl";
import { IdentityControl } from "@/components/security/IdentityControl";
import { PersonalAudit } from "@/components/security/PersonalAudit";

export default function SecurityPage() {
    return (
        <MainContainer>
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-orange-500 rounded-2xl">
                            <Shield size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground">Central de Segurança</h1>
                            <p className="text-sm text-muted-foreground">Cockpit de controle da sua soberania digital</p>
                        </div>
                    </div>
                </div>

                {/* Grid de Componentes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Identidade Digital */}
                    <IdentityControl />

                    {/* Controle de Compartilhamento */}
                    <SharingControl />
                </div>

                {/* Auditoria Pessoal (Full Width) */}
                <PersonalAudit />

                {/* Alertas de Segurança */}
                <div className="bg-orange-50 border border-orange-200 rounded-[40px] p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-orange-500 rounded-xl shrink-0">
                            <Lock size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-foreground mb-1">Modo de Soberania Ativo</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Seus dados estão em <strong>Modo Isolado</strong>. A IA trabalha exclusivamente dentro do seu Vault.
                                Nenhum dado é compartilhado externamente para treinamento ou análise comparativa.
                            </p>
                        </div>
                        <button className="text-xs text-orange-600 font-bold hover:underline shrink-0">
                            Alterar Modo
                        </button>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}
