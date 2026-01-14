"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { useRouter } from "next/navigation";
import {
    Shield,
    Lock,
    CheckCircle,
    XCircle,
    Users,
    ArrowLeft,
    Loader2,
    AlertCircle,
    FileText,
    Eye,
    Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePolicies, useTogglePolicyStatus } from "@/hooks/queries/useUsers";
import { useState } from "react";
import { toast } from "sonner";

export default function PoliciesPage() {
    const router = useRouter();
    const [filterEffect, setFilterEffect] = useState<"all" | "allow" | "deny">("all");

    const { data: policiesData, isLoading } = usePolicies();
    const toggleStatus = useTogglePolicyStatus();

    const policies = policiesData?.results || [];

    const handleToggleStatus = async (policyId: string, currentStatus: boolean) => {
        try {
            await toggleStatus.mutateAsync(policyId);
            toast.success(
                currentStatus ? "Política desativada com sucesso" : "Política ativada com sucesso"
            );
        } catch (error: any) {
            toast.error("Erro ao alterar status da política", {
                description: error.message,
            });
        }
    };

    const filteredPolicies =
        filterEffect === "all"
            ? policies
            : policies.filter((p) => p.effect === filterEffect);

    if (isLoading) {
        return (
            <MainContainer>
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
                </div>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Header com Voltar */}
                <Button variant="ghost" onClick={() => router.push("/team")} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Equipe
                </Button>

                {/* Cabeçalho */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-indigo-500 rounded-2xl">
                            <Lock size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground">
                                Políticas de Acesso (IAM)
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Gerencie políticas de permissão e controle de acesso da organização
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-2 mb-6">
                    <Button
                        size="sm"
                        variant={filterEffect === "all" ? "default" : "outline"}
                        onClick={() => setFilterEffect("all")}
                        className={
                            filterEffect === "all"
                                ? "bg-orange-600 hover:bg-orange-700"
                                : ""
                        }
                    >
                        Todas ({policies.length})
                    </Button>
                    <Button
                        size="sm"
                        variant={filterEffect === "allow" ? "default" : "outline"}
                        onClick={() => setFilterEffect("allow")}
                        className={
                            filterEffect === "allow"
                                ? "bg-green-600 hover:bg-green-700"
                                : ""
                        }
                    >
                        <CheckCircle size={14} className="mr-2" />
                        Allow ({policies.filter((p) => p.effect === "allow").length})
                    </Button>
                    <Button
                        size="sm"
                        variant={filterEffect === "deny" ? "default" : "outline"}
                        onClick={() => setFilterEffect("deny")}
                        className={
                            filterEffect === "deny" ? "bg-red-600 hover:bg-red-700" : ""
                        }
                    >
                        <XCircle size={14} className="mr-2" />
                        Deny ({policies.filter((p) => p.effect === "deny").length})
                    </Button>
                </div>

                {/* Lista de Políticas */}
                {filteredPolicies.length > 0 ? (
                    <div className="space-y-4">
                        {filteredPolicies.map((policy) => {
                            const isAllow = policy.effect === "allow";
                            const isActive = policy.is_active;

                            return (
                                <div
                                    key={policy.id}
                                    className={`bg-background rounded-[40px] border-2 ${
                                        isAllow
                                            ? "border-green-200 bg-green-50/30"
                                            : "border-red-200 bg-red-50/30"
                                    } p-6 ${!isActive ? "opacity-60" : ""}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Ícone */}
                                            <div
                                                className={`p-3 rounded-2xl ${
                                                    isAllow
                                                        ? "bg-green-100 border border-green-200"
                                                        : "bg-red-100 border border-red-200"
                                                }`}
                                            >
                                                {isAllow ? (
                                                    <CheckCircle
                                                        size={24}
                                                        className="text-green-600"
                                                    />
                                                ) : (
                                                    <XCircle size={24} className="text-red-600" />
                                                )}
                                            </div>

                                            {/* Informações */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-lg font-black text-foreground">
                                                        {policy.name}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            isAllow
                                                                ? "bg-green-600 text-white"
                                                                : "bg-red-600 text-white"
                                                        }`}
                                                    >
                                                        {policy.effect_display}
                                                    </span>
                                                    {!isActive && (
                                                        <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
                                                            Inativa
                                                        </span>
                                                    )}
                                                    {policy.source === "system" && (
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                            Sistema
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {policy.description}
                                                </p>

                                                {/* Detalhes */}
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                                                    <div>
                                                        <p className="text-muted-foreground">Serviço</p>
                                                        <p className="font-semibold text-foreground">
                                                            {policy.service_display || policy.service}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Prioridade</p>
                                                        <p className="font-semibold text-foreground">
                                                            {policy.priority}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Usuários</p>
                                                        <p className="font-semibold text-foreground flex items-center gap-1">
                                                            <Users size={12} />
                                                            {policy.users_count}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Grupos</p>
                                                        <p className="font-semibold text-foreground">
                                                            {policy.user_groups_count}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Recursos e Ações */}
                                                {policy.resource && policy.resource.length > 0 && (
                                                    <div className="mt-3">
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            Recursos:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {policy.resource.map((res, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 bg-background border border-border rounded text-xs font-mono"
                                                                >
                                                                    {res}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {policy.actions && policy.actions.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            Ações:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {policy.actions.map((action, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-2 py-0.5 bg-background border border-border rounded text-xs font-mono"
                                                                >
                                                                    {action}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Ações */}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    handleToggleStatus(policy.id, policy.is_active)
                                                }
                                                disabled={
                                                    toggleStatus.isPending ||
                                                    policy.source === "system"
                                                }
                                            >
                                                <Power size={14} className="mr-2" />
                                                {isActive ? "Desativar" : "Ativar"}
                                            </Button>
                                            {policy.users_count > 0 && (
                                                <Button size="sm" variant="outline">
                                                    <Eye size={14} className="mr-2" />
                                                    Ver Usuários
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer com metadata */}
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
                                        <span>Versão {policy.version}</span>
                                        {policy.created_by_name && (
                                            <span>Criado por {policy.created_by_name}</span>
                                        )}
                                        <span>
                                            Criado em{" "}
                                            {new Date(policy.created_at).toLocaleDateString("pt-BR")}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-background rounded-[40px] border border-border">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Nenhuma política encontrada
                        </p>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-[40px] p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-indigo-500 rounded-xl shrink-0">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-foreground mb-1">
                                Sistema de Políticas IAM (Identity and Access Management)
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                As políticas definem quem pode acessar quais recursos e executar
                                quais ações. Políticas <strong>Allow</strong> concedem permissões,
                                enquanto políticas <strong>Deny</strong> negam explicitamente o
                                acesso. Políticas de sistema não podem ser desativadas ou excluídas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}
