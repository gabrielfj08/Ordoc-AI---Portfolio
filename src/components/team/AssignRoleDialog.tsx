"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Shield, X, Plus, AlertCircle } from "lucide-react";
import {
    useUserRoles,
    useAvailableRoles,
    useAssignRole,
    useRemoveRole,
} from "@/hooks/queries/useUsers";
import { OrdocUser } from "@/services/users";
import { toast } from "sonner";

interface AssignRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: OrdocUser | null;
}

export const AssignRoleDialog = ({ open, onOpenChange, user }: AssignRoleDialogProps) => {
    const [selectedRole, setSelectedRole] = useState("");

    const { data: userRoles, isLoading: isLoadingUserRoles } = useUserRoles(user?.id || "");
    const { data: availableRoles, isLoading: isLoadingAvailableRoles } = useAvailableRoles();
    const assignRole = useAssignRole();
    const removeRole = useRemoveRole();

    // Resetar seleção quando o dialog abrir
    useEffect(() => {
        if (open) {
            setSelectedRole("");
        }
    }, [open]);

    const handleAssignRole = async () => {
        if (!user || !selectedRole) {
            toast.error("Selecione uma função");
            return;
        }

        try {
            await assignRole.mutateAsync({
                userId: user.id,
                role: selectedRole,
            });

            toast.success("Função atribuída com sucesso!");
            setSelectedRole("");
        } catch (error: any) {
            console.error("Erro ao atribuir função:", error);
            toast.error("Erro ao atribuir função", {
                description: error.message || "Tente novamente mais tarde",
            });
        }
    };

    const handleRemoveRole = async (roleCode: string) => {
        if (!user) return;

        try {
            await removeRole.mutateAsync({
                userId: user.id,
                role: roleCode,
            });

            toast.success("Função removida com sucesso!");
        } catch (error: any) {
            console.error("Erro ao remover função:", error);
            toast.error("Erro ao remover função", {
                description: error.message || "Tente novamente mais tarde",
            });
        }
    };

    if (!user) return null;

    // Filtrar roles disponíveis que o usuário ainda não tem
    const assignedRoleCodes = userRoles?.map((r) => r.role) || [];
    const unassignedRoles =
        availableRoles?.filter((r) => !assignedRoleCodes.includes(r.code)) || [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">Gerenciar Funções</DialogTitle>
                    <DialogDescription>
                        Gerencie as funções e permissões de {user.first_name} {user.last_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Funções Atuais */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Funções Atuais</Label>

                        {isLoadingUserRoles ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : userRoles && userRoles.length > 0 ? (
                            <div className="space-y-2">
                                {userRoles.map((userRole) => (
                                    <div
                                        key={userRole.id}
                                        className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <Shield size={16} className="text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">
                                                    {userRole.role_display}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {userRole.organization_name}
                                                    {userRole.is_primary && " • Função Principal"}
                                                </p>
                                            </div>
                                        </div>
                                        {!userRole.is_primary && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemoveRole(userRole.role)}
                                                disabled={removeRole.isPending}
                                            >
                                                <X size={14} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-sm text-muted-foreground bg-muted rounded-lg">
                                Nenhuma função atribuída
                            </div>
                        )}
                    </div>

                    {/* Atribuir Nova Função */}
                    {unassignedRoles.length > 0 && (
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold">Atribuir Nova Função</Label>

                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma função" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isLoadingAvailableRoles ? (
                                                <div className="flex items-center justify-center py-4">
                                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                </div>
                                            ) : (
                                                unassignedRoles.map((roleOption) => (
                                                    <SelectItem
                                                        key={roleOption.code}
                                                        value={roleOption.code}
                                                    >
                                                        {roleOption.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={handleAssignRole}
                                    disabled={!selectedRole || assignRole.isPending}
                                    className="bg-orange-600 hover:bg-orange-700"
                                >
                                    {assignRole.isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Plus size={14} className="mr-1" />
                                            Adicionar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Aviso sobre função primária */}
                    {userRoles && userRoles.some((r) => r.is_primary) && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-700">
                                A função principal não pode ser removida. Entre em contato com um
                                administrador para alterar a função principal.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Fechar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
