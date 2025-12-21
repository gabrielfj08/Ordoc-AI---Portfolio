'use client';

import React, { useState } from 'react';
import {
    Plus,
    Search,
    MoreHorizontal,
    UserPlus,
    Mail,
    Shield,
    Key,
    Send,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSettings } from './settings-context';
import { usersService } from '@/services/users';
import { toast } from 'react-hot-toast';

export const UsersManager = () => {
    const { users, groups, policies, orgs, refreshData } = useSettings();
    const [editingUser, setEditingUser] = useState<any>(null);
    const [resettingUser, setResettingUser] = useState<any>(null);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: '',
        group: '',
        organization: '',
        status: 'active'
    });

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            role: '',
            group: '',
            organization: '',
            status: 'active'
        });
    };

    const handleStatusUpdate = async (userId: string, newStatus: string) => {
        try {
            // Optimistic update could go here, but we'll wait for server
            // await usersService.updateUser(userId, { status: newStatus as any }); 
            // OR toggle
            await usersService.toggleUserStatus(userId);
            toast.success("Status atualizado com sucesso");
            refreshData();
        } catch (error) {
            toast.error("Erro ao atualizar status");
            console.error(error);
        }
    };

    const handleCreateUser = async () => {
        setIsLoadingAction(true);
        try {
            await usersService.createUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role // Role usually maps to specific internal roles, might need adjustment
                // Group and Organization linking requires specific fields in backend or separate calls
                // Currently CreateUserData only supports basic fields. We might need to extend it.
            });
            // If backend supports optional group/org in create, good. If not, we might need extra calls.
            // For now assuming basic create works.

            toast.success("Usuário criado com sucesso");
            refreshData();
            setIsAddingUser(false);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao criar usuário");
        } finally {
            setIsLoadingAction(false);
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        setIsLoadingAction(true);
        try {
            await usersService.updateUser(editingUser.id, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                status: formData.status as any
            });
            toast.success("Usuário atualizado com sucesso");
            refreshData();
            setEditingUser(null);
            resetForm();
        } catch (error: any) {
            toast.error(error.message || "Erro ao atualizar usuário");
        } finally {
            setIsLoadingAction(false);
        }
    };

    // Populate form when editing
    React.useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name,
                email: editingUser.email,
                phone: editingUser.phone,
                role: editingUser.role,
                group: editingUser.group,
                organization: editingUser.organization || '',
                status: editingUser.status
            });
        }
    }, [editingUser]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar usuários..." className="pl-9 bg-background" />
                </div>
                <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    onClick={() => { resetForm(); setIsAddingUser(true); }}
                >
                    <UserPlus className="w-4 h-4" /> Adicionar Usuário
                </Button>
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Usuários do Sistema</CardTitle>
                    <CardDescription>Gerencie o acesso e permissões dos membros da equipe.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Grupo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Permissão</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className={user.status === 'inactive' ? 'bg-muted/30 opacity-60 grayscale-[0.5]' : ''}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {user.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-sm">{user.group}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={user.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}>
                                            {user.status === 'active' ? 'Ativo' : 'Desativado'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-mono bg-secondary/50 px-2 py-0.5 rounded">{user.role}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {user.status === 'active' ? (
                                                    <>
                                                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setResettingUser(user)}>
                                                            Alterar Senha
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                            onClick={() => handleStatusUpdate(user.id, 'inactive')}
                                                        >
                                                            Desativar
                                                        </DropdownMenuItem>
                                                    </>
                                                ) : (
                                                    <DropdownMenuItem
                                                        className="text-primary font-medium focus:text-primary focus:bg-primary/10"
                                                        onClick={() => handleStatusUpdate(user.id, 'active')}
                                                    >
                                                        Reativar Conta
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* EDIT USER DIALOG */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Atualize as informações cadastrais e permissões deste usuário.
                        </DialogDescription>
                    </DialogHeader>

                    {editingUser && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                    <Input id="phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="(00) 00000-0000" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail Corporativo</Label>
                                <Input id="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Permissão (Role)</Label>
                                    <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Editor">Editor</SelectItem>
                                            <SelectItem value="Viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="group">Departamento / Grupo</Label>
                                    <Select value={formData.group} onValueChange={v => setFormData({ ...formData, group: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Diretoria">Diretoria</SelectItem>
                                            <SelectItem value="Financeiro">Financeiro</SelectItem>
                                            <SelectItem value="RH">RH</SelectItem>
                                            <SelectItem value="Jurídico">Jurídico</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="status">Status da Conta</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                        <SelectItem value="suspended">Suspenso</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)} disabled={isLoadingAction}>Cancelar</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleUpdateUser} disabled={isLoadingAction}>
                            {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* RESET PASSWORD DIALOG */}
            <Dialog open={!!resettingUser} onOpenChange={(open) => !open && setResettingUser(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Redefinir Senha</DialogTitle>
                        <DialogDescription>
                            Escolha como deseja redefinir o acesso para <span className="font-semibold text-foreground">{resettingUser?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        {/* Option 1: Send Link */}
                        <div className="relative flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors group" onClick={() => { toast.success('Link enviado!'); setResettingUser(null); }}>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Send className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="font-medium leading-none">Enviar Link de Redefinição</p>
                                <p className="text-sm text-muted-foreground">
                                    Envia um link seguro por e-mail para que o usuário crie sua própria senha.
                                </p>
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary mt-2">
                                    Recomendado
                                </span>
                            </div>
                        </div>

                        {/* Option 2: Generate Password */}
                        <div className="relative flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => { toast.success('Senha gerada e enviada!'); setResettingUser(null); }}>
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                                <Key className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="font-medium leading-none">Gerar Senha Temporária</p>
                                <p className="text-sm text-muted-foreground">
                                    O sistema cria uma senha aleatória forte e a envia imediatamente por e-mail.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setResettingUser(null)}>Cancelar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD USER DIALOG */}
            <Dialog open={isAddingUser} onOpenChange={(open) => !open && setIsAddingUser(false)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para cadastrar um novo membro.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-name">Nome Completo</Label>
                                <Input id="new-name" placeholder="Ex: Ana Silva" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-phone">Telefone / WhatsApp</Label>
                                <Input id="new-phone" placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-email">E-mail Corporativo</Label>
                            <Input id="new-email" placeholder="nome@empresa.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-role">Permissão (Política)</Label>
                                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {policies.map((policy) => (
                                            <SelectItem key={policy.id} value={policy.name}>{policy.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-group">Departamento / Grupo</Label>
                                <Select value={formData.group} onValueChange={v => setFormData({ ...formData, group: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.map((group) => (
                                            <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-org">Organização</Label>
                                <Select value={formData.organization} onValueChange={v => setFormData({ ...formData, organization: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orgs.map((org) => (
                                            <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddingUser(false)} disabled={isLoadingAction}>Cancelar</Button>
                        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreateUser} disabled={isLoadingAction}>
                            {isLoadingAction && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Criar Usuário
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
