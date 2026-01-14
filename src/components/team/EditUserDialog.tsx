"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { Loader2, User, Phone, Mail } from "lucide-react";
import { useUpdateUser } from "@/hooks/queries/useUsers";
import { OrdocUser } from "@/services/users";
import { toast } from "sonner";

interface EditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: OrdocUser | null;
}

export const EditUserDialog = ({ open, onOpenChange, user }: EditUserDialogProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [emailNotifications, setEmailNotifications] = useState(true);

    const updateUser = useUpdateUser();

    // Preencher formulário quando o usuário mudar
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || "");
            setLastName(user.last_name || "");
            setPhone(user.phone || "");
            setEmailNotifications(user.email_notifications);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!firstName || !lastName) {
            toast.error("Nome e sobrenome são obrigatórios");
            return;
        }

        try {
            await updateUser.mutateAsync({
                id: user.id,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone || undefined,
                    email_notifications: emailNotifications,
                },
            });

            toast.success("Usuário atualizado com sucesso!");

            // Fechar dialog
            onOpenChange(false);
        } catch (error: any) {
            console.error("Erro ao atualizar usuário:", error);
            toast.error("Erro ao atualizar usuário", {
                description: error.message || "Tente novamente mais tarde",
            });
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black">Editar Usuário</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do usuário {user.username}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Email (read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="pl-10 bg-muted"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                O email não pode ser alterado
                            </p>
                        </div>

                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-semibold">
                                Nome *
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="João"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Sobrenome */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-semibold">
                                Sobrenome *
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="da Silva"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Telefone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-semibold">
                                Telefone
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="(11) 98765-4321"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Notificações por email */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="emailNotifications"
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <Label
                                htmlFor="emailNotifications"
                                className="text-sm font-normal cursor-pointer"
                            >
                                Receber notificações por email
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateUser.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700"
                            disabled={updateUser.isPending}
                        >
                            {updateUser.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar Alterações"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
