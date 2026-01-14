"use client";

import { Users, Crown, Shield, Eye, Edit, Loader2, AlertCircle, Search, Filter, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/queries/useUsers";
import { useState, useMemo } from "react";
import { InviteUserDialog } from "./InviteUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { AssignRoleDialog } from "./AssignRoleDialog";
import { UserActivityDialog } from "./UserActivityDialog";
import { BulkImportDialog } from "./BulkImportDialog";
import { OrdocUser } from "@/services/users";

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
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [showActivityDialog, setShowActivityDialog] = useState(false);
    const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<OrdocUser | null>(null);

    // Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    // Buscar usuários da organização
    const { data, isLoading, error, refetch } = useUsers({
        page_size: 100,
    });

    const allUsers = data?.results || [];

    // Filtrar usuários baseado nos filtros aplicados
    const users = useMemo(() => {
        let filtered = [...allUsers];

        // Filtro de busca
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.first_name.toLowerCase().includes(search) ||
                    user.last_name.toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search) ||
                    user.username.toLowerCase().includes(search)
            );
        }

        // Filtro de role
        if (roleFilter) {
            filtered = filtered.filter((user) => user.current_role?.code === roleFilter);
        }

        // Filtro de status
        if (statusFilter) {
            filtered = filtered.filter((user) => user.status === statusFilter);
        }

        return filtered;
    }, [allUsers, searchTerm, roleFilter, statusFilter]);

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
                        Níveis de acesso ao cérebro da IA e aos documentos. {users.length} de {allUsers.length} membros
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => setShowBulkImportDialog(true)}
                    >
                        <Upload size={14} className="mr-2" />
                        Importar CSV
                    </Button>
                    <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
                        onClick={() => setShowInviteDialog(true)}
                    >
                        <Users size={14} className="mr-2" />
                        Convidar Membro
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 space-y-3">
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">Filtros</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Busca */}
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            type="text"
                            placeholder="Buscar por nome ou email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 text-sm"
                        />
                    </div>

                    {/* Filtro por Role */}
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Todas as funções" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todas as funções</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="organization_manager">
                                Gestor da Organização
                            </SelectItem>
                            <SelectItem value="organization_member">
                                Membro da Organização
                            </SelectItem>
                            <SelectItem value="department_manager">
                                Gestor de Departamento
                            </SelectItem>
                            <SelectItem value="department_member">
                                Membro de Departamento
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Filtro por Status */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todos os status</SelectItem>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                            <SelectItem value="blocked">Bloqueado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
                                            setSelectedUser(member);
                                            setShowActivityDialog(true);
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
                                            setSelectedUser(member);
                                            setShowRoleDialog(true);
                                        }}
                                    >
                                        <Shield size={14} className="mr-1" />
                                        Funções
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                        onClick={() => {
                                            setSelectedUser(member);
                                            setShowEditDialog(true);
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

            <InviteUserDialog open={showInviteDialog} onOpenChange={setShowInviteDialog} />
            <EditUserDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                user={selectedUser}
            />
            <AssignRoleDialog
                open={showRoleDialog}
                onOpenChange={setShowRoleDialog}
                user={selectedUser}
            />
            <UserActivityDialog
                open={showActivityDialog}
                onOpenChange={setShowActivityDialog}
                user={selectedUser}
            />
            <BulkImportDialog
                open={showBulkImportDialog}
                onOpenChange={setShowBulkImportDialog}
                onImportComplete={() => {
                    refetch();
                    setShowBulkImportDialog(false);
                }}
            />
        </div>
    );
};
