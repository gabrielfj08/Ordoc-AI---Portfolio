"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Activity, Calendar, Clock, User as UserIcon, AlertCircle } from "lucide-react";
import { useAuditLogsByUser } from "@/hooks/queries/useUsers";
import { OrdocUser } from "@/services/users";

interface UserActivityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: OrdocUser | null;
}

// Mapa de tradução de ações
const actionTranslation: Record<string, string> = {
    user_login: "Login realizado",
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

export const UserActivityDialog = ({ open, onOpenChange, user }: UserActivityDialogProps) => {
    const { data: activities, isLoading, error } = useAuditLogsByUser(user?.id || "");

    if (!user) return null;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">Atividades do Usuário</DialogTitle>
                    <DialogDescription>
                        Histórico de atividades de {user.first_name} {user.last_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 overflow-y-auto max-h-[500px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center gap-3 py-12 text-destructive">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm">Erro ao carregar atividades</p>
                        </div>
                    ) : activities && activities.length > 0 ? (
                        <div className="space-y-3">
                            {activities.map((activity) => {
                                const actionName =
                                    actionTranslation[activity.action] || activity.action_display;
                                const color = actionColors[activity.action] || actionColors.default;

                                return (
                                    <div
                                        key={activity.id}
                                        className="p-4 bg-muted rounded-lg border border-border hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-2 ${color} rounded-lg mt-0.5`}>
                                                <Activity size={16} className="text-white" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {actionName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {activity.description}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Calendar size={12} />
                                                            {formatDate(activity.created_at)}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Clock size={12} />
                                                            {formatTime(activity.created_at)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Informações adicionais */}
                                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                                    {activity.target_user_name && (
                                                        <div className="flex items-center gap-1">
                                                            <UserIcon size={12} />
                                                            Alvo: {activity.target_user_name}
                                                        </div>
                                                    )}
                                                    {activity.ip_address && (
                                                        <div>IP: {activity.ip_address}</div>
                                                    )}
                                                </div>

                                                {/* Valores alterados */}
                                                {(activity.old_values || activity.new_values) && (
                                                    <details className="text-xs">
                                                        <summary className="cursor-pointer text-orange-600 hover:text-orange-700 font-semibold">
                                                            Ver detalhes
                                                        </summary>
                                                        <div className="mt-2 p-2 bg-background rounded border border-border space-y-1">
                                                            {activity.old_values && (
                                                                <div>
                                                                    <span className="font-semibold">
                                                                        Valores anteriores:
                                                                    </span>
                                                                    <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                                                                        {JSON.stringify(
                                                                            activity.old_values,
                                                                            null,
                                                                            2
                                                                        )}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                            {activity.new_values && (
                                                                <div>
                                                                    <span className="font-semibold">
                                                                        Novos valores:
                                                                    </span>
                                                                    <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                                                                        {JSON.stringify(
                                                                            activity.new_values,
                                                                            null,
                                                                            2
                                                                        )}
                                                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </details>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end border-t pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
