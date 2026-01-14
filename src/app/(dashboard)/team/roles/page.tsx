"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { useRouter } from "next/navigation";
import {
    Shield,
    Users,
    Crown,
    Building2,
    Briefcase,
    UserCircle,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAvailableRoles, useUsers } from "@/hooks/queries/useUsers";

// Mapa de descrições detalhadas das roles
const roleDescriptions: Record<string, string> = {
    admin: "Acesso total ao sistema. Pode gerenciar usuários, configurações, políticas e todas as funcionalidades da plataforma.",
    organization_manager:
        "Gerencia toda a organização. Pode convidar membros, criar departamentos e definir políticas organizacionais.",
    organization_member:
        "Membro padrão da organização. Acesso básico a documentos e funcionalidades compartilhadas.",
    department_manager:
        "Gerencia um departamento específico. Pode adicionar membros ao departamento e gerenciar documentos do departamento.",
    department_member:
        "Membro de um departamento. Acesso limitado aos recursos do departamento.",
};

// Mapa de ícones por role
const roleIcons: Record<string, React.ReactNode> = {
    admin: <Crown size={24} className="text-orange-600" />,
    organization_manager: <Building2 size={24} className="text-blue-600" />,
    organization_member: <UserCircle size={24} className="text-green-600" />,
    department_manager: <Briefcase size={24} className="text-purple-600" />,
    department_member: <Users size={24} className="text-gray-600" />,
};

// Mapa de cores de fundo
const roleBackgrounds: Record<string, string> = {
    admin: "bg-orange-50 border-orange-200",
    organization_manager: "bg-blue-50 border-blue-200",
    organization_member: "bg-green-50 border-green-200",
    department_manager: "bg-purple-50 border-purple-200",
    department_member: "bg-gray-50 border-gray-200",
};

export default function RolesPage() {
    const router = useRouter();

    const { data: availableRoles, isLoading: isLoadingRoles } = useAvailableRoles();
    const { data: usersData } = useUsers({ page_size: 1000 }); // Buscar todos para contagem

    const users = usersData?.results || [];

    // Contar usuários por role
    const getUserCountByRole = (roleCode: string): number => {
        return users.filter((user) => user.current_role?.code === roleCode).length;
    };

    if (isLoadingRoles) {
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
                        <div className="p-3 bg-purple-500 rounded-2xl">
                            <Shield size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground">
                                Funções e Permissões
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Gerencie as funções disponíveis e suas permissões na organização
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de Roles */}
                {availableRoles && availableRoles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {availableRoles.map((role) => {
                            const userCount = getUserCountByRole(role.code);
                            const description = roleDescriptions[role.code] || "Função do sistema";
                            const icon = roleIcons[role.code] || (
                                <Shield size={24} className="text-gray-600" />
                            );
                            const bgClass = roleBackgrounds[role.code] || "bg-gray-50 border-gray-200";

                            return (
                                <div
                                    key={role.code}
                                    className={`${bgClass} rounded-[40px] border p-6 hover:shadow-lg transition-shadow`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-white rounded-2xl border border-border">
                                                {icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-foreground">
                                                    {role.name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground font-mono">
                                                    {role.code}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-foreground">
                                                {userCount}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {userCount === 1 ? "usuário" : "usuários"}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        {description}
                                    </p>

                                    {/* Permissões Chave */}
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold text-foreground">
                                            Permissões Chave:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {role.code === "admin" && (
                                                <>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-orange-700 border border-orange-200">
                                                        Gestão Total
                                                    </span>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-orange-700 border border-orange-200">
                                                        Configurações
                                                    </span>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-orange-700 border border-orange-200">
                                                        Políticas
                                                    </span>
                                                </>
                                            )}
                                            {role.code === "organization_manager" && (
                                                <>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-blue-700 border border-blue-200">
                                                        Gestão Organização
                                                    </span>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-blue-700 border border-blue-200">
                                                        Convidar Usuários
                                                    </span>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-blue-700 border border-blue-200">
                                                        Criar Departamentos
                                                    </span>
                                                </>
                                            )}
                                            {role.code === "organization_member" && (
                                                <>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-green-700 border border-green-200">
                                                        Ver Documentos
                                                    </span>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-green-700 border border-green-200">
                                                        Upload Básico
                                                    </span>
                                                </>
                                            )}
                                            {role.code === "department_manager" && (
                                                <>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-purple-700 border border-purple-200">
                                                        Gestão Departamento
                                                    </span>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-purple-700 border border-purple-200">
                                                        Adicionar Membros
                                                    </span>
                                                </>
                                            )}
                                            {role.code === "department_member" && (
                                                <>
                                                    <span className="px-2 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200">
                                                        Acesso Departamento
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ver Usuários */}
                                    {userCount > 0 && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full mt-4"
                                            onClick={() =>
                                                router.push(`/team?role=${role.code}`)
                                            }
                                        >
                                            <Users size={14} className="mr-2" />
                                            Ver {userCount}{" "}
                                            {userCount === 1 ? "usuário" : "usuários"}
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Nenhuma função encontrada</p>
                    </div>
                )}

                {/* Info Card */}
                <div className="bg-purple-50 border border-purple-200 rounded-[40px] p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-purple-500 rounded-xl shrink-0">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-foreground mb-1">
                                Sistema de Controle de Acesso Baseado em Funções (RBAC)
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                As funções determinam o nível de acesso e permissões de cada usuário
                                na plataforma. Um usuário pode ter múltiplas funções, mas apenas uma
                                função principal que define seu nível de acesso padrão.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainContainer>
    );
}
