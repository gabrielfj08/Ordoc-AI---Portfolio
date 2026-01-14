"use client";

import { Activity, TrendingUp, FileCheck, Users, Loader2, AlertCircle } from "lucide-react";
import { useAuditLogStats } from "@/hooks/queries/useUsers";

// Mapa de cores para tipos de ação
const actionColors: Record<string, string> = {
    user_login: "bg-blue-500",
    user_create: "bg-green-500",
    document_upload: "bg-purple-500",
    document_sign: "bg-orange-500",
    policy_create: "bg-indigo-500",
    role_assign: "bg-pink-500",
    default: "bg-gray-500",
};

// Mapa de tradução de ações
const actionTranslation: Record<string, string> = {
    user_login: "Login de usuário",
    user_create: "Usuário criado",
    user_update: "Usuário atualizado",
    user_delete: "Usuário excluído",
    user_block: "Usuário bloqueado",
    user_unlock: "Usuário desbloqueado",
    role_assign: "Função atribuída",
    role_remove: "Função removida",
    policy_create: "Política criada",
    policy_update: "Política atualizada",
    document_upload: "Documento enviado",
    document_sign: "Documento assinado",
    "2fa_enable": "2FA habilitado",
    "2fa_disable": "2FA desabilitado",
};

export const TeamActivity = () => {
    const { data: stats, isLoading, error } = useAuditLogStats();

    if (isLoading) {
        return (
            <div className="bg-background rounded-[40px] border border-border p-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background rounded-[40px] border border-border p-6">
                <div className="flex items-center justify-center gap-3 py-12 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">Erro ao carregar estatísticas</p>
                </div>
            </div>
        );
    }

    const totalActivities = stats?.total_last_7_days || 0;
    const actionCounts = stats?.by_action || [];
    const topUsers = stats?.top_users || [];

    // Pegar top 4 ações
    const topActions = actionCounts.slice(0, 4);

    return (
        <div className="bg-background rounded-[40px] border border-border p-6">
            <div className="mb-6">
                <h3 className="text-lg font-black text-foreground">Atividade do Time</h3>
                <p className="text-xs text-muted-foreground">
                    Ações realizadas nos últimos 7 dias ({totalActivities} ações totais)
                </p>
            </div>

            {topActions.length === 0 ? (
                <div className="text-center py-8">
                    <Activity className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topActions.map((item, idx) => {
                        const actionKey = item.action;
                        const color = actionColors[actionKey] || actionColors.default;
                        const actionName = actionTranslation[actionKey] || actionKey;
                        const percentage = totalActivities > 0
                            ? ((item.count / totalActivities) * 100).toFixed(0)
                            : 0;

                        return (
                            <div key={idx} className="p-4 bg-muted rounded-2xl border border-border">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 ${color} rounded-xl`}>
                                            <Activity size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{actionName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {percentage}% do total
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                        <TrendingUp size={12} />
                                        Top {idx + 1}
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-foreground">{item.count}</span>
                                    <span className="text-xs text-muted-foreground">ações</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {topUsers.length > 0 && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                    <div className="flex items-start gap-3">
                        <FileCheck size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-foreground mb-2">
                                Usuários Mais Ativos (últimos 7 dias)
                            </p>
                            <div className="space-y-1">
                                {topUsers.slice(0, 3).map((user, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                            {idx + 1}. {user.user__user__username}
                                        </span>
                                        <span className="text-xs font-bold text-orange-600">
                                            {user.count} ações
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
