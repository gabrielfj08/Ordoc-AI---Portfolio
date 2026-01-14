"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { useParams, useRouter } from "next/navigation";
import {
    User as UserIcon,
    Mail,
    Phone,
    Calendar,
    Shield,
    Activity,
    FileText,
    Lock,
    Unlock,
    RefreshCw,
    ArrowLeft,
    Loader2,
    AlertCircle,
    Crown,
    Edit,
    Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    useUser,
    useUserRoles,
    useAuditLogsByUser,
    useBlockUser,
    useUnlockUser,
    useSendPasswordReset,
} from "@/hooks/queries/useUsers";
import { useState } from "react";
import { EditUserDialog } from "@/components/team/EditUserDialog";
import { AssignRoleDialog } from "@/components/team/AssignRoleDialog";
import { toast } from "sonner";

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);

    const { data: user, isLoading, error } = useUser(userId);
    const { data: roles } = useUserRoles(userId);
    const { data: activities } = useAuditLogsByUser(userId);

    const blockUser = useBlockUser();
    const unlockUser = useUnlockUser();
    const sendPasswordReset = useSendPasswordReset();

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const handleBlockUser = async () => {
        if (!user) return;

        if (!confirm(`Tem certeza que deseja bloquear ${user.first_name} ${user.last_name}?`)) {
            return;
        }

        try {
            await blockUser.mutateAsync({ id: user.id, reason: "Bloqueado via interface" });
            toast.success("Usuário bloqueado com sucesso");
        } catch (error: any) {
            toast.error("Erro ao bloquear usuário", {
                description: error.message,
            });
        }
    };

    const handleUnlockUser = async () => {
        if (!user) return;

        try {
            await unlockUser.mutateAsync(user.id);
            toast.success("Usuário desbloqueado com sucesso");
        } catch (error: any) {
            toast.error("Erro ao desbloquear usuário", {
                description: error.message,
            });
        }
    };

    const handleSendPasswordReset = async () => {
        if (!user) return;

        try {
            await sendPasswordReset.mutateAsync(user.id);
            toast.success("Email de redefinição enviado", {
                description: `Um email foi enviado para ${user.email}`,
            });
        } catch (error: any) {
            toast.error("Erro ao enviar email", {
                description: error.message,
            });
        }
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

    if (error || !user) {
        return (
            <MainContainer>
                <div className="flex flex-col items-center justify-center gap-4 py-24">
                    <AlertCircle className="w-16 h-16 text-destructive" />
                    <p className="text-lg text-muted-foreground">Usuário não encontrado</p>
                    <Button variant="outline" onClick={() => router.push("/team")}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Equipe
                    </Button>
                </div>
            </MainContainer>
        );
    }

    const isBlocked = user.status === "blocked";
    const loginCount = activities?.filter((a) => a.action === "user_login").length || 0;
    const documentCount = activities?.filter((a) => a.action === "document_upload").length || 0;

    return (
        <MainContainer>
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Header com Voltar */}
                <Button
                    variant="ghost"
                    onClick={() => router.push("/team")}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para Equipe
                </Button>

                {/* Cabeçalho do Usuário */}
                <div className="bg-background rounded-[40px] border border-border p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        className="w-24 h-24 rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                                        {user.first_name.charAt(0)}
                                        {user.last_name.charAt(0)}
                                    </div>
                                )}
                                {user.current_role?.code === "admin" && (
                                    <div className="absolute -top-2 -right-2 p-2 bg-orange-500 rounded-full">
                                        <Crown size={16} className="text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Informações */}
                            <div className="space-y-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-black text-foreground">
                                            {user.first_name} {user.last_name}
                                        </h1>
                                        {isBlocked && (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                                Bloqueado
                                            </span>
                                        )}
                                        {user.status === "inactive" && (
                                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                                                Inativo
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-orange-600 font-semibold">
                                        {user.current_role?.name || "Membro"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={14} />
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone size={14} />
                                            {user.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar size={14} />
                                        Membro desde {formatDate(user.created_at)}
                                    </div>
                                    {user.last_login_at && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Activity size={14} />
                                            Último acesso: {formatDate(user.last_login_at)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Ações Rápidas */}
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowEditDialog(true)}
                            >
                                <Edit size={14} className="mr-2" />
                                Editar
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowRoleDialog(true)}
                            >
                                <Shield size={14} className="mr-2" />
                                Funções
                            </Button>
                            {isBlocked ? (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={handleUnlockUser}
                                    disabled={unlockUser.isPending}
                                >
                                    <Unlock size={14} className="mr-2" />
                                    Desbloquear
                                </Button>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={handleBlockUser}
                                    disabled={blockUser.isPending}
                                >
                                    <Ban size={14} className="mr-2" />
                                    Bloquear
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSendPasswordReset}
                                disabled={sendPasswordReset.isPending}
                            >
                                <RefreshCw size={14} className="mr-2" />
                                Reset Senha
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-background rounded-[40px] border border-border p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Activity size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total de Logins</p>
                                <p className="text-2xl font-black text-foreground">{loginCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background rounded-[40px] border border-border p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <FileText size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Documentos Enviados</p>
                                <p className="text-2xl font-black text-foreground">{documentCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background rounded-[40px] border border-border p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Shield size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Funções Ativas</p>
                                <p className="text-2xl font-black text-foreground">
                                    {roles?.filter((r) => r.is_active).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Funções e Permissões */}
                {roles && roles.length > 0 && (
                    <div className="bg-background rounded-[40px] border border-border p-6">
                        <h3 className="text-lg font-black text-foreground mb-4">
                            Funções e Permissões
                        </h3>
                        <div className="space-y-3">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Shield size={16} className="text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {role.role_display}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {role.organization_name}
                                                {role.is_primary && " • Função Principal"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Desde {formatDate(role.started_at)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Atividades Recentes */}
                {activities && activities.length > 0 && (
                    <div className="bg-background rounded-[40px] border border-border p-6">
                        <h3 className="text-lg font-black text-foreground mb-4">
                            Atividades Recentes
                        </h3>
                        <div className="space-y-2">
                            {activities.slice(0, 10).map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Activity size={14} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">
                                                {activity.action_display}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.description}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(activity.created_at)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <EditUserDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                user={user}
            />
            <AssignRoleDialog
                open={showRoleDialog}
                onOpenChange={setShowRoleDialog}
                user={user}
            />
        </MainContainer>
    );
}
