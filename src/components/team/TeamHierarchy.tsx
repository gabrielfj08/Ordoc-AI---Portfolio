"use client";

import { Users, Crown, Shield, Eye, Edit, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/queries/useUsers";
import { useState } from "react";

// Mapa de cores para avatares
const avatarColors = [
    "bg-orange-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-yellow-500",
    "bg-red-500",
];

// Mapa de tradução de roles
const roleTranslation: Record<string, string> = {
    admin: "Administrador",
    organization_manager: "Gestor da Organização",
    organization_member: "Membro da Organização",
    department_manager: "Gestor de Departamento",
    department_member: "Membro de Departamento",
};

// Mapa de níveis de acesso
const accessLevelMap: Record<string, string> = {
    admin: "Total",
    organization_manager: "Organizacional",
    organization_member: "Básico",
    department_manager: "Departamental",
    department_member: "Limitado",
};

export const TeamHierarchy = () => {
    const [showInviteDialog, setShowInviteDialog] = useState(false);

    // Buscar usuários da organização
    const { data, isLoading, error } = useUsers({
        page_size: 50,
    });

    const users = data?.results || [];

    // Função para gerar iniciais do avatar
    const getInitials = (firstName: string, lastName: string) => {
        const first = firstName?.charAt(0)?.toUpperCase() || '';
        const last = lastName?.charAt(0)?.toUpperCase() || '';
        return first + last || '?';
    };

    // Função para obter cor consistente baseada no ID
    const getAvatarColor = (id: string) => {
        const index = parseInt(id.replace(/[^0-9]/g, ''), 10) % avatarColors.length;
        return avatarColors[index];
    };

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
                    <p className="text-sm">Erro ao carregar membros da equipe</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background rounded-[40px] border border-border p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-black text-foreground">Hierarquia de Confiança</h3>
                    <p className="text-xs text-muted-foreground">
                        Níveis de acesso ao cérebro da IA e aos documentos. {users.length} membros
                    </p>
                </div>
                <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                    onClick={() => setShowInviteDialog(true)}
                >
                    <Users size={14} className="mr-2" />
                    Convidar Membro
                </Button>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Nenhum membro encontrado</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Clique em "Convidar Membro" para adicionar usuários
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((member) => {
                        const initials = getInitials(member.first_name, member.last_name);
                        const avatarColor = getAvatarColor(member.id);
                        const roleCode = member.current_role?.code || 'organization_member';
                        const roleName = member.current_role?.name || roleTranslation[roleCode] || 'Membro';
                        const accessLevel = accessLevelMap[roleCode] || 'Básico';
                        const isAdmin = roleCode === 'admin';

                        return (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-4 bg-muted rounded-2xl border border-border hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    {member.avatar ? (
                                        <img
                                            src={member.avatar}
                                            alt={`${member.first_name} ${member.last_name}`}
                                            className="w-12 h-12 rounded-xl object-cover"
                                        />
                                    ) : (
                                        <div className={`w-12 h-12 ${avatarColor} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                                            {initials}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-foreground">
                                                {member.first_name} {member.last_name}
                                            </p>
                                            {isAdmin && <Crown size={14} className="text-orange-500" />}
                                            {member.status === 'blocked' && (
                                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                                    Bloqueado
                                                </span>
                                            )}
                                            {member.status === 'inactive' && (
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                                                    Inativo
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-muted-foreground">{roleName}</span>
                                            <span className="text-xs text-orange-600 font-semibold">• {accessLevel}</span>
                                            {member.department && (
                                                <span className="text-xs text-muted-foreground">
                                                    • {member.department.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                        onClick={() => {
                                            // TODO: Navegar para página de atividades do usuário
                                            console.log('Ver atividade:', member.id);
                                        }}
                                    >
                                        <Eye size={14} className="mr-1" />
                                        Ver Atividade
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                        onClick={() => {
                                            // TODO: Abrir modal de edição
                                            console.log('Editar usuário:', member.id);
                                        }}
                                    >
                                        <Edit size={14} className="mr-1" />
                                        Editar
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TODO: Adicionar InviteUserDialog */}
        </div>
    );
};
