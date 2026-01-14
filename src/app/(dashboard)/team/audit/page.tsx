"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { useRouter } from "next/navigation";
import {
    Activity,
    FileText,
    Calendar,
    Clock,
    User as UserIcon,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Download,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditLogs } from "@/hooks/queries/useUsers";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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

// Mapa de cores para tipos de ação
const actionColors: Record<string, string> = {
    user_login: "bg-blue-500",
    user_create: "bg-green-500",
    user_update: "bg-yellow-500",
    user_delete: "bg-red-500",
    user_block: "bg-red-600",
    user_unlock: "bg-green-600",
    document_upload: "bg-purple-500",
    document_sign: "bg-orange-500",
    policy_create: "bg-indigo-500",
    role_assign: "bg-pink-500",
    default: "bg-gray-500",
};

export default function AuditPage() {
    const router = useRouter();
    const [actionFilter, setActionFilter] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");

    const { data: auditData, isLoading } = useAuditLogs({
        action: actionFilter || undefined,
        search: searchTerm || undefined,
    });

    const auditLogs = auditData?.results || [];

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
            second: "2-digit",
        });
    };

    const exportToCSV = () => {
        if (auditLogs.length === 0) return;

        const headers = [
            "Data/Hora",
            "Ação",
            "Usuário",
            "Alvo",
            "Descrição",
            "IP",
        ].join(",");

        const rows = auditLogs.map((log) => {
            return [
                `${formatDate(log.created_at)} ${formatTime(log.created_at)}`,
                log.action_display,
                log.user_name || "Sistema",
                log.target_user_name || "-",
                `"${log.description.replace(/"/g, '""')}"`,
                log.ip_address || "-",
            ].join(",");
        });

        const csv = [headers, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
    };

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
            <div className="max-w-7xl mx-auto space-y-6 pb-12">
                {/* Header com Voltar */}
                <Button variant="ghost" onClick={() => router.push("/team")} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Equipe
                </Button>

                {/* Cabeçalho */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-cyan-500 rounded-2xl">
                                <FileText size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-foreground">
                                    Log de Auditoria
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    Rastreamento completo de todas as ações na plataforma
                                </p>
                            </div>
                        </div>
                        <Button onClick={exportToCSV} disabled={auditLogs.length === 0}>
                            <Download size={14} className="mr-2" />
                            Exportar CSV
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-background rounded-[40px] border border-border p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={16} className="text-muted-foreground" />
                        <h3 className="text-sm font-bold text-foreground">Filtros</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Filtro por ação */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                Tipo de Ação
                            </label>
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas as ações" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">Todas as ações</SelectItem>
                                    {Object.entries(actionTranslation).map(([code, name]) => (
                                        <SelectItem key={code} value={code}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Busca */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-2 block">
                                Buscar
                            </label>
                            <Input
                                type="text"
                                placeholder="Buscar por usuário, descrição..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-background rounded-2xl border border-border p-4">
                        <p className="text-xs text-muted-foreground mb-1">Total de Eventos</p>
                        <p className="text-2xl font-black text-foreground">
                            {auditData?.count || 0}
                        </p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl border border-blue-200 p-4">
                        <p className="text-xs text-muted-foreground mb-1">Logins</p>
                        <p className="text-2xl font-black text-blue-600">
                            {auditLogs.filter((l) => l.action === "user_login").length}
                        </p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl border border-purple-200 p-4">
                        <p className="text-xs text-muted-foreground mb-1">Documentos</p>
                        <p className="text-2xl font-black text-purple-600">
                            {
                                auditLogs.filter((l) =>
                                    ["document_upload", "document_sign"].includes(l.action)
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-orange-50 rounded-2xl border border-orange-200 p-4">
                        <p className="text-xs text-muted-foreground mb-1">Usuários Alterados</p>
                        <p className="text-2xl font-black text-orange-600">
                            {
                                auditLogs.filter((l) =>
                                    [
                                        "user_create",
                                        "user_update",
                                        "user_block",
                                        "user_unlock",
                                    ].includes(l.action)
                                ).length
                            }
                        </p>
                    </div>
                </div>

                {/* Timeline de Logs */}
                {auditLogs.length > 0 ? (
                    <div className="space-y-3">
                        {auditLogs.map((log) => {
                            const actionName =
                                actionTranslation[log.action] || log.action_display;
                            const color = actionColors[log.action] || actionColors.default;

                            return (
                                <div
                                    key={log.id}
                                    className="bg-background rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Ícone */}
                                        <div className={`p-3 ${color} rounded-xl mt-0.5 flex-shrink-0`}>
                                            <Activity size={18} className="text-white" />
                                        </div>

                                        {/* Conteúdo */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-foreground">
                                                        {actionName}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {log.description}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                                        <Calendar size={12} />
                                                        {formatDate(log.created_at)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Clock size={12} />
                                                        {formatTime(log.created_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Metadata */}
                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <UserIcon size={12} />
                                                    <span className="font-semibold">
                                                        {log.user_name || "Sistema"}
                                                    </span>
                                                </div>
                                                {log.target_user_name && (
                                                    <div>
                                                        → Alvo: <strong>{log.target_user_name}</strong>
                                                    </div>
                                                )}
                                                {log.ip_address && <div>IP: {log.ip_address}</div>}
                                            </div>

                                            {/* Detalhes expandíveis */}
                                            {(log.old_values || log.new_values) && (
                                                <details className="mt-3">
                                                    <summary className="cursor-pointer text-xs text-orange-600 hover:text-orange-700 font-semibold">
                                                        Ver valores alterados
                                                    </summary>
                                                    <div className="mt-2 p-3 bg-muted rounded-lg space-y-2">
                                                        {log.old_values && (
                                                            <div>
                                                                <span className="text-xs font-semibold text-foreground">
                                                                    Valores anteriores:
                                                                </span>
                                                                <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                                                                    {JSON.stringify(
                                                                        log.old_values,
                                                                        null,
                                                                        2
                                                                    )}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {log.new_values && (
                                                            <div>
                                                                <span className="text-xs font-semibold text-foreground">
                                                                    Novos valores:
                                                                </span>
                                                                <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                                                                    {JSON.stringify(
                                                                        log.new_values,
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
                    <div className="text-center py-12 bg-background rounded-[40px] border border-border">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Nenhum log de auditoria encontrado
                        </p>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-cyan-50 border border-cyan-200 rounded-[40px] p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-cyan-500 rounded-xl shrink-0">
                            <FileText size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-foreground mb-1">
                                Conformidade LGPD e Rastreabilidade
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Todos os eventos e ações na plataforma são registrados para garantir
                                conformidade com LGPD, ISO 27001 e e-ARQ Brasil. Os logs incluem
                                informações sobre quem executou a ação, quando, de onde (IP) e quais
                                mudanças foram realizadas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}
