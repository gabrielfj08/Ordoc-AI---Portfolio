"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, User, Shield } from "lucide-react";
import { useCreateUser, useAvailableRoles } from "@/hooks/queries/useUsers";
import { toast } from "sonner";

interface InviteUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const InviteUserDialog = ({ open, onOpenChange }: InviteUserDialogProps) => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("organization_member");
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);

    const createUser = useCreateUser();
    const { data: availableRoles, isLoading: isLoadingRoles } = useAvailableRoles();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("O email é obrigatório");
            return;
        }

        try {
            await createUser.mutateAsync({
                email,
                name,
                role,
                send_welcome_email: sendWelcomeEmail,
            });

            toast.success("Usuário convidado com sucesso!", {
                description: sendWelcomeEmail
                    ? "Um email de boas-vindas foi enviado"
                    : "O usuário foi criado",
            });

            // Resetar form
            setEmail("");
            setName("");
            setRole("organization_member");
            setSendWelcomeEmail(true);

            // Fechar dialog
            onOpenChange(false);
        } catch (error: any) {
            console.error("Erro ao convidar usuário:", error);
            toast.error("Erro ao convidar usuário", {
                description: error.message || "Tente novamente mais tarde",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">Convidar Novo Membro</DialogTitle>
                    <DialogDescription>
                        Adicione um novo membro à organização. Um email de convite será enviado.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold">
                                Email *
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@exemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold">
                                Nome Completo
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="João da Silva"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Opcional. Se não informado, será derivado do email.
                            </p>
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-sm font-semibold">
                                Função *
                            </Label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="pl-10">
                                        <SelectValue placeholder="Selecione uma função" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {isLoadingRoles ? (
                                            <div className="flex items-center justify-center py-4">
                                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : (
                                            availableRoles?.map((roleOption) => (
                                                <SelectItem key={roleOption.code} value={roleOption.code}>
                                                    {roleOption.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Enviar email de boas-vindas */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="sendWelcome"
                                type="checkbox"
                                checked={sendWelcomeEmail}
                                onChange={(e) => setSendWelcomeEmail(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <Label
                                htmlFor="sendWelcome"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Enviar email de boas-vindas
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={createUser.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={createUser.isPending}
                        >
                            {createUser.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Convidar Membro"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
